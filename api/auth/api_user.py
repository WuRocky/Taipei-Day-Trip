from flask import *
from flask import Blueprint
from flask_cors import CORS
from myModules.mysql_pool import *
from myModules.jwt import *
from myModules.regular import *
from myModules.success_or_error import *
from password import *
import bcrypt


user_api = Blueprint('user_api', __name__)
CORS(user_api)

# api_user_post register
@user_api.route("/api/user/auth", methods=["POST"])
def api_user_post():
  try:
    connection = get_connection()
    mycursor = connection.cursor()

    # get post info from the client
    request_api = request.json
    name = request_api["name"]
    email = request_api["email"]
    password = request_api["password"]

    # if data wrong format
    if not re.fullmatch(name_regex(), name):
      er = "姓名格式錯誤，須為3個字"
      return jsonify(error(er)),404
    elif not re.fullmatch(email_regex(), email):
      er = "信箱格式錯誤"
      return jsonify(error(er)),404
    elif not re.fullmatch(passwor_regex(), password):
      er = "密碼格式錯誤，至少須有3個字"
      return jsonify(error(er)),404

    # search databases
    mycursor.execute("select email from member where email = %s LIMIT 1",(email,))
    reuslt=mycursor.fetchone()
    
    # if already have data return error
    if reuslt != None:
      res = "資料重複"
      return jsonify(error(res)),404

    # used bcrypt store password
    bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    bcrypt_hash = bcrypt.hashpw(bytes, salt)
    
    # if there is no data, save it to the database, return success
    mycursor.execute("insert into member(name, email, password) values(%s, %s, %s)",(name, email, bcrypt_hash))
    connection.commit()
    return jsonify(success()), 200

  except: 
    mes = "伺服器錯誤"
    return jsonify(error(mes)),404
  finally:
    mycursor.close()
    connection.close()

# api_user_put login
@user_api.route("/api/user/auth", methods=["PUT"])
def api_user_auth_put():
  try:
    connection = get_connection()
    mycursor = connection.cursor()
    
    # get put info from the client
    request_api = request.json
    email = request_api["email"]
    password = request_api["password"] 

    # if data wrong format
    if not re.fullmatch(email_regex(), email):
      er = "信箱格式錯誤"
      return jsonify(error(er)),404
    elif not re.fullmatch(passwor_regex(), password):
      er = "密碼格式錯誤，至少須有3個字"
      return jsonify(error(er)),404
      
    # search databases info
    mycursor.execute("select id, name, email, password from member where email = %s ",(email,))
    reuslt=mycursor.fetchone()

    # bcrypt check password and database password
    hash = reuslt[3].encode('utf-8')
    userBytes = password.encode('utf-8')
    result = bcrypt.checkpw(userBytes, hash)

    if reuslt != None and result:
      data_success = jsonify(success())

      # use jwt encode function make token        
      jwt_encode = jwt_token(reuslt[0], reuslt[1], reuslt[2])

      # make jwt_encode in cookie and set time
      data_success.set_cookie("Token",jwt_encode,60*60*24*7)

      # return success
      return data_success, 200

    # if data wrong format return error
    res = "信箱或密碼輸入錯誤"
    return jsonify(error(res)),404

  except: 
    mes = "伺服器錯誤"
    return jsonify(error(mes)),404
  finally:
    mycursor.close()
    connection.close()


# api_user_get get login info
@user_api.route("/api/user/auth", methods=["GET"])
def api_user_auth_get():
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
    id = data["id"]
    name = data["name"]
    email = data["email"]

    # search databases data info
    mycursor.execute("select id, name, email from member where id = %s and name = %s and email = %s ",(id, name, email,))
    reuslt=mycursor.fetchone()

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
    mycursor.close()
    connection.close()

# api_user_detele
@user_api.route("/api/user/auth", methods=["DELETE"])
def api_user_auth_delete():
  try:
    # get info the client
    logout= jsonify(success())

    # set cookie time to zero, response to client
    logout.set_cookie("Token",max_age=0)
    return logout,200
  except: 
    return 404