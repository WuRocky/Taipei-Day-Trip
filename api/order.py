from flask import *
from flask import Blueprint
from flask_cors import CORS
from myModules.mysql_pool import *
from myModules.jwt import *
from myModules.regular import *
from myModules.success_or_error import *
from jwt_password import *
import requests


order_api = Blueprint('order_api', __name__)
CORS(order_api)

@order_api.route("/api/order", methods=["POST"])
def order_api_post():
  try:
    connection = get_connection()
    mycursor = connection.cursor()
    
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
    user_name = data["name"]
    
    # get put info from the client
    request_api = request.json
    prime = request_api["prime"]
    name = request_api["name"]
    email = request_api["email"]
    phone = request_api["phone"]
    user_name_web = request_api["userNameWeb"]
    
    # check whether the order number is repeated and generate a serial number
    mycursor.execute("SELECT MAX(order_number) FROM orders")
    max_order_number = mycursor.fetchone()[0]
    
    if max_order_number:
      order_number = f"{max_order_number[:8]}-{str(int(max_order_number[9:]) + 1).zfill(3)}"
    else:
      order_number = f"{datetime.datetime.now().strftime('%Y%m%d')}-001"
    
    # if not user return message
    if user_name_web != user_name:
      mes = "沒有權限"
      return error(mes),403
    else:
      # get Info on booking attractions from the database
      mycursor.execute("""
      select 
      a.attractionId, 
      a.booking_date, 
      a.booking_time, 
      a.booking_price, 
      a.booking_img, 
      b.name, 
      b.address
      from booking as a 
      inner join data as b on a.attractionId = b.id 
      where a.member_id = %s; """,(user_id,))

      reuslt=mycursor.fetchone()
      id = reuslt[0]
      date = reuslt[1]
      time = reuslt[2]
      price = reuslt[3]
      image = reuslt[4]
      attraction_name =  reuslt[5]
      address = reuslt[6]
      
      # add order info to database
      mycursor.execute("""
        insert into orders (
        order_number,
        order_mamber_id,
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
        VALUES 
        (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s
        )
        """,(
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
        ))
      


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
      price = int(price)
      data = {
        "prime": prime,
        "partner_key": x_api_key,
        "merchant_id": "rockywu971_CTBC",
        "amount": price,
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
        mycursor.execute("""
        insert into orders_done (
        order_mamber_id,
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
        VALUES 
        (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s
        )
        """,(
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
        ))
        connection.commit()
        return jsonify(TapPay_success),200

      # if TapPay server return error show message
      elif TapPay_status != 0:
        TapPay_error = {
          "error": True,
          "message": TapPay_res_msg
        }
        return jsonify(TapPay_error),400
      
      
      return jsonify(reuslt_order_api)
  except:
    mes = "伺服器錯誤"
    return jsonify(error(mes)),500
  finally:
    mycursor.close()
    connection.close()


@order_api.route("/api/order", methods=["GET"])
def order_api_get():
  try:
    connection = get_connection()
    mycursor = connection.cursor(dictionary=True)

    # get order number from client 
    order_number = request.args.get("number","訂單編號")

    # check if there is any data in the orders_done database
    mycursor.execute("""select 
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
    phone,
    status
    from orders_done where 
    order_number= %s""",(order_number,))
    orders_done_number_reuslt=mycursor.fetchone()

    # if orders_done database not data return error
    if orders_done_number_reuslt == None:
      mes = "查無訂單編號"
      return jsonify(error(mes)),400
    
    # get orders_done info
    orders_done_number=orders_done_number_reuslt["order_number"]
    price=orders_done_number_reuslt["price"]
    id=orders_done_number_reuslt["id"]
    attraction_name=orders_done_number_reuslt["attraction_name"]
    address=orders_done_number_reuslt["address"]
    image=orders_done_number_reuslt["image"]
    date=orders_done_number_reuslt["date"]
    time=orders_done_number_reuslt["time"]
    name=orders_done_number_reuslt["name"]
    email=orders_done_number_reuslt["email"]
    phone=orders_done_number_reuslt["phone"]
    status=orders_done_number_reuslt["status"]
    
    # search orders database order number
    mycursor.execute("""select order_number from orders where order_number= %s""",(orders_done_number,))
    orders_number_reuslt = mycursor.fetchone()

    # check the order number of the orders and orders_done database and modify the orders database to done
    orders_number = orders_number_reuslt["order_number"]
    if orders_number == orders_done_number:
      mycursor.execute("""UPDATE orders set status=%s where order_number=%s""",("done",orders_done_number))
      connection.commit()

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
    mes = "伺服器錯誤"
    return jsonify(error(mes)),404
  finally:
    mycursor.close()
    connection.close()