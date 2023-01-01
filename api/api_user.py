from flask import *
from flask import Blueprint
from flask_cors import CORS
from models.jwt import *
from utils.regular import *
from jwt_password import *
import bcrypt

from models.api_user_db import Api_user_post as User
from models.api_user_db import Api_user_auth_put as User_db
from models.api_user_db import Api_user_auth_get as Get_user_db


user_api = Blueprint('user_api', __name__)
CORS(user_api)

# api_user_post register
@user_api.route("/api/user/auth", methods=["POST"])
def api_user_post():
  try:
    # get post info from the client
    request_api = request.json
    name = request_api["name"]
    email = request_api["email"]
    password = request_api["password"]

    # if data wrong format
    if not re.fullmatch(name_regex(), name):
      return jsonify({
        "error": True,
        "message": "姓名格式錯誤，須為3個字"
      }),400
    elif not re.fullmatch(email_regex(), email):
      return jsonify({
        "error": True,
        "message": "信箱格式錯誤"
      }),400
    elif not re.fullmatch(passwor_regex(), password):
      return jsonify({
        "error": True,
        "message": "密碼格式錯誤，至少須有3個字"
      }),400
    
    # use models api_user_db
    db = User()
    # if already have data return error
    if db.search_member_info(email) != None:
      return jsonify({
        "error": True,
        "message": "已有註冊"
      }),400
    
    # add_member_info
    db.add_member_info(name, email, password)
    return jsonify({
      "ok":True
      }), 200
  except: 
    return jsonify({
    "error": True,
    "message": "伺服器內部錯誤"
    }),500
  finally:
    User().close_connection()

# api_user_put login
@user_api.route("/api/user/auth", methods=["PUT"])
def api_user_auth_put():
  try:
    # get put info from the client
    request_api = request.json
    email = request_api["email"]
    password = request_api["password"] 

    # if data wrong format
    if not re.fullmatch(email_regex(), email):
      return jsonify({
        "error": True,
        "message": "信箱格式錯誤"
      }),400
    elif not re.fullmatch(passwor_regex(), password):
      return jsonify({
        "error": True,
        "message": "密碼格式錯誤，至少須有3個字"
      }),400
    
    # use models api_user_db
    db = User_db()
    result = db.search_member(email)
    # if data unregistered
    if result== None:
      return jsonify({
        "error": True,
        "message": "尚未註冊"
      }),400
    
    # bcrypt check password and database password
    hash = result["password"].encode('utf-8')
    userBytes = password.encode('utf-8')
    password_result = bcrypt.checkpw(userBytes, hash)


    if result != None and password_result:
      data_success = jsonify({
        "ok":True
      })

      # use jwt encode function make token        
      jwt_encode = jwt_token(result["id"], result["name"], result["email"])

      # make jwt_encode in cookie and set time
      data_success.set_cookie("Token",jwt_encode,60*60*24*7)
      
      # return success
      return data_success, 200
      # if password error return message
    elif password_result == False:
      return {
        "error": True,
        "message": "密碼錯誤"
      },400
  except: 
    return jsonify({
    "error": True,
    "message": "伺服器內部錯誤"
    }),500
  finally:
    User_db().close_connection()


# api_user_get get login info
@user_api.route("/api/user/auth", methods=["GET"])
def api_user_auth_get():
  try:

    # get cookies from the client
    token = request.headers.get('authorization')
    
    # parser client cookies get token
    jwt_toke = token.split(' ', 1)
    
    # get correct token info
    encoded = jwt_toke[1]
    
    if encoded == "undefined" :
      return jsonify(None), 200

    # use jwt decod function ， decod token
    jwt_decod_token = jwt_decod(encoded)

    # get token data info id, email, name
    data = jwt_decod_token["data"]
    id = data["id"]
    name = data["name"]
    email = data["email"]

    # use models api_user_db
    db = Get_user_db()
    reuslt = db.get_member(id, name, email)

    # if have data response to client
    if reuslt != None:
      api = {"data": {
        "id": id,
        "name": name,
        "email": email
        }
      }
      return api,200
      
  except: 
    return jsonify(None),404
  finally:
    Get_user_db().close_connection()

# api_user_detele
@user_api.route("/api/user/auth", methods=["DELETE"])
def api_user_auth_delete():
  try:
    # get info the client
    logout= jsonify({
      "ok":True
    })

    # set cookie time to zero, response to client
    logout.set_cookie("Token",max_age=0)
    return logout,200
  except: 
    return 404