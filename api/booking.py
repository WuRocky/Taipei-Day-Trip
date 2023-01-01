from flask import *
from flask import Blueprint
from flask_cors import CORS
from models.jwt import *
from utils.regular import *
from jwt_password import *

from models.booking_db import Booking_api_get
from models.booking_db import Booking_api_post
from models.booking_db import Booking_api_delete
from models.booking_db import reuslt_booking_api

booking_api = Blueprint('booking_api', __name__)
CORS(booking_api)

# check user booking
@booking_api.route("/api/booking", methods=["GET"])
def book_api_get():
  try:

    # get cookies from the client
    token = request.headers.get('authorization')
    
    # parser client cookies get token
    jwt_toke = token.split(' ', 1)

    # get correct token info
    encoded = jwt_toke[1]

    # if not login return error
    if encoded == "undefined":
      return jsonify({
        "error": True,
        "message": "未登入系統，拒絕存取"
      }),403
    
    # use jwt decod function ， decod token
    jwt_decod_token = jwt_decod(encoded)
    
    # get token data info user_id and username
    data = jwt_decod_token["data"]
    user_id = data["id"]
    user_name = data["name"]

    # use models booking_db
    booking_db = Booking_api_get()
    reuslt_check_booking = booking_db.check_booking_user(user_id)

    # if not booking trip return message
    if not reuslt_check_booking:
      not_booking_api={
        "name":user_name,
        "booking":False
      }
      return jsonify(not_booking_api)

    booking_data = []
    # get all need data
    for data in reuslt_check_booking:
      result=booking_db.search_data_database(data["attractionId"])
      booking_data.append(reuslt_booking_api(
        data["attractionId"],
        result["name"],
        result["address"],
        data["booking_img"],
        data["booking_date"],
        data["booking_time"],
        data["booking_price"],
      ))

    # reuslt_booking_api = {
    #   "data":{
    #     "attraction": {
    #       "id": attraction_id,
    #       "name": attractions_name,
    #       "address": attractions_adrress,
    #       "image": img
    #     },
    #     "date": date,
    #     "time": time,
    #     "price": price
    #   }
    # }
    
    return jsonify(booking_data),200

  except:
    return jsonify({
    "error": True,
    "message": "伺服器內部錯誤"
    }),500

  finally:
    Booking_api_get().close_connection()



@booking_api.route("/api/booking", methods=["POST"])
def book_api_post():
  try:

    request_api = request.json
    attraction_id = request_api["id"]
    date = request_api["date"]
    price_text = request_api["price"]
    time = request_api["time"]
    img = request_api["img"]


    # get cookies from the client
    token = request.headers.get('authorization')
    
    # parser client cookies get token
    jwt_toke = token.split(' ', 1)

    # get correct token info
    encoded = jwt_toke[1]

    # if not login return error
    if encoded == "undefined":
      return{
      "error": True,
      "message": "未登入系統，拒絕存取"
      },403
    
    # if not choose date return message
    if date == "":
      return{
      "error": True,
      "message": "請輸入日期"
      },400

    # use jwt decod function ， decod token
    jwt_decod_token = jwt_decod(encoded)

    # get token data info user_id
    data = jwt_decod_token["data"]
    user_id = data["id"]

    # get price_numbers
    price_numbers = sum(map(int, numbers_regex().findall(price_text)))
    
    # use models booking_db
    booking_db = Booking_api_post()

    # # check if the database table booking has data
    reuslt= booking_db.check_booking(user_id, attraction_id, date, price_numbers, time)
    if reuslt != None:
      return{
        "error": True,
        "message": "重複預定行程"
      },400
    else:
      booking_db.add_booking(
        user_id, 
        attraction_id, 
        date, 
        time, 
        price_numbers, 
        price_text, 
        img
      )
      return jsonify({
        "ok":True
        }),200
  
  except:
    return{
      "error": True,
      "message": "伺服器內部錯誤"
      },500
  
  finally:
    Booking_api_post().close_connection()



@booking_api.route("/api/booking", methods=["DELETE"])
def book_api_delete():
  try:
    token = request.headers.get('authorization')
    
    # parser client cookies get token
    jwt_toke = token.split(' ', 1)

    # get correct token info
    encoded = jwt_toke[1]

    # if not login return error
    if encoded == "undefined":
      return{
        "error": True,
        "message": "未登入系統，拒絕存取"
      },403

    # use jwt decod function decod token
    jwt_decod_token = jwt_decod(encoded)

    # get token data info user_id
    data = jwt_decod_token["data"]
    user_id = data["id"]

    request_api = request.json
    name = request_api["attractionsName"]
    date = request_api["attractionsdate"]
    time = request_api["attractionsTime"]
    pay = request_api["attractionsPay"]

    # use models booking_db
    db = Booking_api_delete()
    attraction_id = db.check_attractions_name(name)["id"]

    # check user id
    check_user = db.check_member(user_id)

    if check_user:
      # delete booking data
      db.delete_booking(user_id, attraction_id, date, time, pay)
      return jsonify( {
        "ok":True
      }),200
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
    Booking_api_delete().close_connection()