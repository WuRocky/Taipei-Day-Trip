from flask import *
from flask import Blueprint
from flask_cors import CORS
from myModules.mysql_pool import *
from myModules.jwt import *
from myModules.regular import *
from myModules.success_or_error import *
from jwt_password import *


booking_api = Blueprint('booking_api', __name__)
CORS(booking_api)


@booking_api.route("/api/booking", methods=["GET"])
def book_aip_get():
  try:
    connection = get_connection()
    mycursor = connection.cursor()
    # get cookies from the client
    token = request.headers.get('authorization')
    
    # parser client cookies get token
    jwt_toke = token.split(' ', 1)

    # get correct token info
    encoded = jwt_toke[1]

    # if not login return error
    if encoded == "undefined":
      mes = "未登入系統，拒絕存取"
      return error(mes),403
    
    # use jwt decod function ， decod token
    jwt_decod_token = jwt_decod(encoded)

    # get token data info user_id and username
    data = jwt_decod_token["data"]
    user_id = data["id"]
    user_name = data["name"]
    
    mycursor.execute("""select * from booking where member_id = %s """,(user_id,))
    reuslt_check_booking=mycursor.fetchone()
    
    # if not booking trip return message
    if reuslt_check_booking == None:
      not_booking_api={
        "name":user_name,
        "booking":False
      }
      return jsonify(not_booking_api)
    
    # search database table data info
    mycursor.execute("""select name,address from data where id = %s """,(reuslt_check_booking[2],))
    reuslt_data=mycursor.fetchone()
    
    # get all need data
    attractions_name = reuslt_data[0]
    attractions_adrress = reuslt_data[1]
    attraction_id = reuslt_check_booking[2]
    date = reuslt_check_booking[3]
    time = reuslt_check_booking[4]
    price = reuslt_check_booking[5]
    img = reuslt_check_booking[7]


    reuslt_booking_api = {
      "data":{
        "attraction": {
          "id": attraction_id,
          "name": attractions_name,
          "address": attractions_adrress,
          "image": img
        },
        "date": date,
        "time": time,
        "price": price
      }
    }
    return jsonify(reuslt_booking_api),200

  except:
    mes = "伺服器錯誤"
    return jsonify(error(mes)),404
  
  finally:
    mycursor.close()
    connection.close()



@booking_api.route("/api/booking", methods=["POST"])
def book_api_post():
  try:
    connection = get_connection()
    mycursor = connection.cursor()

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
      mes = "未登入系統，拒絕存取"
      return error(mes),403
    
    # if not choose date return message
    if date == "":
      mes = "請輸入日期"
      return error(mes),206 

    # use jwt decod function ， decod token
    jwt_decod_token = jwt_decod(encoded)

    # get token data info user_id
    data = jwt_decod_token["data"]
    user_id = data["id"]

    # get price_numbers
    price_numbers = sum(map(int, numbers_regex().findall(price_text)))
    
    # check if the database table booking has data
    mycursor.execute("""select member_id from booking where member_id = %s """,(user_id,))
    reuslt=mycursor.fetchone()
    if reuslt == None:
      mycursor.execute("""
      insert into booking(
      member_id,
      attractionId, 
      booking_date,
      booking_time,
      booking_price,
      booking_price_text,
      booking_img) 
      values(%s, %s, %s, %s, %s, %s, %s)"""
      ,(user_id, attraction_id, date, time, price_numbers, price_text, img))
      connection.commit()

    # if there is already data update data
    elif reuslt != None:
      mycursor.execute("""UPDATE booking SET attractionId=%s,
      booking_date=%s,
      booking_time=%s,
      booking_price=%s,
      booking_price_text=%s,
      booking_img = %s
      where member_id =%s
      """, (attraction_id, date, time, price_numbers, price_text, img, user_id))
      connection.commit()
    
    # booking_post_api ={
    #   "attractionId": attraction_id,
    #   "date": date,
    #   "time": time,
    #   "price": price_numbers
    # }
    return jsonify(success()),200
  
  except:
    mes = "伺服器錯誤"
    return jsonify(error(mes)),404
  
  finally:
    mycursor.close()
    connection.close()



@booking_api.route("/api/booking", methods=["DELETE"])
def book_aip_delete():
  try:
    connection = get_connection()
    mycursor = connection.cursor()
    token = request.headers.get('authorization')
    
    # parser client cookies get token
    jwt_toke = token.split(' ', 1)

    # get correct token info
    encoded = jwt_toke[1]

    # if not login return error
    if encoded == "undefined":
      mes = "未登入系統，拒絕存取"
      return error(mes),403

    # use jwt decod function ， decod token
    jwt_decod_token = jwt_decod(encoded)

    # get token data info user_id
    data = jwt_decod_token["data"]
    user_id = data["id"]
    user_name = data["name"]
    request_api = request.json
    user_name_web = request_api["userName"]
    
    if user_name != user_name_web:
      mes = "沒有權限"
      return error(mes),403
    else:
      # delete booking data
      mycursor.execute("""DELETE FROM booking WHERE member_id = %s;""",(user_id,))
      connection.commit()
      return jsonify(success()),200
  except:
    mes = "伺服器錯誤"
    return jsonify(error(mes)),404
  finally:
    mycursor.close()
    connection.close()