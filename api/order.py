from flask import *
from flask import Blueprint
from flask_cors import CORS
from models.jwt import *
from utils.regular import *
from jwt_password import *
import requests

from models.order_db import Order_api_post
from models.order_db import Order_api_get

order_api = Blueprint('order_api', __name__)
CORS(order_api)

@order_api.route("/api/order", methods=["POST"])
def order_api_post():
  try:
    
    # get cookies from the client
    token = request.headers.get('authorization')

    # parser client cookies get token
    jwt_toke = token.split(' ', 1)
    
    # get correct token info
    encoded = jwt_toke[1]

    # use jwt decod function ， decod token
    jwt_decod_token = jwt_decod(encoded)

    # get token data info id, email, name
    data = jwt_decod_token["data"]
    user_id = data["id"]
    
    # get put info from the client
    request_api = request.json
    prime = request_api["prime"]
    name = request_api["name"]
    email = request_api["email"]
    phone = request_api["phone"]

    # use models Order_api_post
    db =Order_api_post()

    # check whether the order number is repeated and generate a serial number
    max_order_number = db.check_booking_number()

    if max_order_number:
      order_number = f"{max_order_number[:8]}-{str(int(max_order_number[9:]) + 1).zfill(3)}"
    else:
      order_number = f"{datetime.datetime.now().strftime('%Y%m%d')}-001"
    
    check_user_id = db.check_member(user_id)
    if check_user_id:
      
      # get Info on booking attractions from the database
      reuslt = db.attractions_info(user_id)

      id = []
      date = []
      time = []
      price = []
      total = 0
      image = []
      attraction_name = []
      address = []
      for api in reuslt:
        id.append(api["attractionId"])
        date.append(api["booking_date"])
        time.append(api["booking_time"])
        price.append(api["booking_price"])
        total+=api["booking_price"]
        image.append(api["booking_img"])
        attraction_name.append(api["name"])
        address.append(api["address"])

      # add order info to database
      db.add_order(
        order_number, 
        user_id, 
        prime, 
        price, 
        id, 
        attraction_name, 
        address,
        image,
        date,
        time,
        name,
        email,
        phone
        )
      
      reuslt_order_api = {
        "prime": prime,
        "order": {
          "price": price,
          "trip": {
            "attraction": {
              "id": id,
              "name": attraction_name,
              "address": address,
              "image": image
            },
            "date": date,
            "time": time
          },
          "contact": {
            "name": name,
            "email": email,
            "phone": phone
          }
        }
      }

      # send prime and user info to TapPay server to complete payment
      url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
      x_api_key ="partner_fTPTUBgu1qwzBE1RFE0g9jWsCp8Kpfdc8d6nkkWUOyskprRueUbo3cvT"

      headers = {
        'x-api-key': x_api_key
      }
      total = int(total)
      data = {
        "prime": prime,
        "partner_key": x_api_key,
        "merchant_id": "rockywu971_CTBC",
        "amount": total,
        "currency":"TWD",
        "details":"Taipei-Day-Trip",
        "order_number": order_number,
        "cardholder": {
            "phone_number": phone,
            "name": name,
            "email": email,
        },
        "remember": True
      }
      
      # get TapPay server return info 
      response = requests.post(url, headers=headers, json=data)
      TapPay_res_msg = response.json()["msg"]
      TapPay_status = response.json()["status"]
      
      # if TapPay server return success
      if TapPay_status == 0:
        TapPay_success = {
          "data": {
            "number": order_number,
            "payment": {
              "status": 0,
              "message": "付款成功"
            }
          }
        }

        # add completed order_done database
        db.orders_done(
          user_id,
          order_number,
          price, 
          id,
          attraction_name,
          address,
          image,
          date,
          time,
          name,
          email,
          phone
        )
        return jsonify(TapPay_success),200
      # if TapPay server return error show message
      elif TapPay_status != 0:
        TapPay_error = {
          "error": True,
          "message": TapPay_res_msg
        }
        return jsonify(TapPay_error),400
      
      
      return jsonify(reuslt_order_api)
    # if not user return message
    else:
      return{
        "error": True,
        "message": "沒有權限"
      },403
    
  except:
    return jsonify({
      "error": True,
      "message": "伺服器錯誤"
    }),500
  finally:
    Order_api_post().close_connection()


@order_api.route("/api/order", methods=["GET"])
def order_api_get():
  try:
    # get order number from client 
    order_number = request.args.get("number","訂單編號")
    db = Order_api_get()
    # check if there is any data in the orders_done database
    orders_done_number_reuslt = db.check_orders_done(order_number)
    
    # if orders_done database not data return error
    if orders_done_number_reuslt == None:
      return{
        "error": True,
        "message": "查無訂單編號"
      },403
    
    order_member = []
    orders_done_number = []
    price = []
    id = []
    attraction_name = []
    address = []
    image = []
    date = []
    time = []
    name = []
    email = []
    phone = []
    status = []

    # get orders_done info
    for api in orders_done_number_reuslt:
      order_member.append(api["order_member_id"])
      orders_done_number.append(api["order_number"])
      price.append(api["price"])
      id.append(api["id"])
      attraction_name.append(api["attraction_name"])
      address.append(api["address"])
      image.append(api["image"])
      date.append(api["date"])
      time.append(api["time"])
      name.append(api["name"])
      email.append(api["email"])
      phone.append(api["phone"])
      status.append(api["status"])

    # search orders database order number
    orders_number_reuslt = db.search_orders(orders_done_number[0])

    # check the order number of the orders and orders_done database and modify the orders database to done
    if orders_done_number[0] == orders_number_reuslt[0]["order_number"]:
      db.update_orders(orders_done_number[0])
    
    db.delete_booking(order_member[0])
    
    # return the orders_done data to the front end
    get_order_number_info = {
      "data": {
        "number": orders_done_number,
        "price": price,
        "trip": {
          "attraction": {
            "id": id,
            "name": attraction_name,
            "address": address,
            "image": image
          },
          "date": date,
          "time": time
        },
        "contact": {
          "name": name,
          "email": email,
          "phone": phone
        },
        "status": status
      }
    }
    return jsonify(get_order_number_info)
  except:
    return jsonify({
      "error": True,
      "message": "伺服器錯誤"
    }),500
  finally:
    Order_api_get().close_connection()