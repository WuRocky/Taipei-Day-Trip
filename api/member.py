from flask import *
from flask import Blueprint
from flask_cors import CORS
from models.jwt import *
from utils.regular import *
from jwt_password import *

from models.member_db import Member_api_get

from models.booking_db import Booking_api_get
from models.order_db import Order_api_get
from models.booking_db import reuslt_booking_api

mamber_api = Blueprint('member_api', __name__)
CORS(mamber_api)

# check user booking
@mamber_api.route("/api/member", methods=["GET"])
def mamber_api_get():
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
    member_db = Member_api_get()
    check_member = member_db.check_member_user(user_id, user_name)
    
    member_id = check_member["id"]
    booking_db = Booking_api_get()
    booking_info = booking_db.check_booking_user(member_id)
    orders_db = Order_api_get()
    order_done_info = orders_db.order_member_id(member_id)

    booking_data = []

    for data in booking_info:
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

    if not check_member:
      return{
        "error": True,
        "message": "沒有權限"
      },403
    elif not booking_info and not order_done_info:
      return jsonify({
      "ok": True,
      "message": "找無資料"
      }),200

    return jsonify({
      "data":{
        "member":check_member,
        "booking":booking_data,
        "order_done": order_done_info
      }
    }),200
  except:
    return jsonify({
    "error": True,
    "message": "伺服器內部錯誤"
    }),500

  finally:
    Member_api_get().close_connection()