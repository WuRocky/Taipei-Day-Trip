from flask import *
from mysql.connector import pooling
from mySQL import MySQLPassword
from flask import Blueprint
from flask_cors import CORS
import jwt
from password import *
from datetime import *
user_api = Blueprint('user_api', __name__)
CORS(user_api)


# jwt encode function
def jwt_token(user_id, name, email): 
  payload = {
  "data": {
    "id": user_id,
    "name": name,
    "email": email
  },
  "exp": datetime.utcnow() + timedelta(days=7),
  "iat": datetime.utcnow(),
  }
  jwt_token = jwt.encode(payload, JWT_SECRET(), JWT_ALGORITHM())
  return jwt_token

# jwt decod function
def jwt_decod(token):
  jwt_decod = jwt.decode(token, JWT_SECRET(), JWT_ALGORITHM())
  return jwt_decod




def get_connection():
  connection = pooling.MySQLConnectionPool(
    pool_name="python_pool",
    pool_size=10,
    pool_reset_session=True,
    host="localhost",
    user="root",
    password=MySQLPassword(),
    database='taipei_day_trip'
    )
  return connection.get_connection()


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
    # error info
    data_api_error = {
      "error": True,
      "message": "請按照情境提供對應的錯誤訊息"
      }
    
    # success info
    data_api_success= {
      "ok":True
    }

    # search databases
    mycursor.execute("select email from member where email = %s LIMIT 1",(email,))
    reuslt=mycursor.fetchone()
    
    # if already have data return error
    if reuslt != None:
      return jsonify(data_api_error)

    # if there is no data, save it to the database, return success
    mycursor.execute("insert into member(name, email, password) values(%s, %s, %s)",(name, email, password))
    connection.commit()
    return jsonify(data_api_success)

  except: 
    data_api_error={
      "error": True,
      "message": "請按照情境提供對應的錯誤訊息"
    }
    return jsonify(data_api_error)
  finally:
    mycursor.close()
    connection.close()

# api_user_put login
@user_api.route("/api/user/auth", methods=["PUT"])
def api_user_auth_put():
  try:
    connection = get_connection()
    mycursor = connection.cursor()

    # error info
    data_error ={
      "error": True,
      "message": "請按照情境提供對應的錯誤訊息"
    }
    if request.method == "PUT":
      # get put info from the client
      email = request.json.get("email",None) 
      password = request.json.get("password",None) 

      # search databases info
      mycursor.execute("select id, name, email from member where email = %s and password = %s",(email,password,))
      reuslt=mycursor.fetchone()

      # if get data
      if reuslt != None:

        # response to client info
        data_success = jsonify({
          "ok": True
        })

        # use jwt encode function make token        
        jwt_encode = jwt_token(reuslt[0],reuslt[1],reuslt[2])
        print("test")
        # make jwt_encode in cookie and set time
        data_success.set_cookie("Token",jwt_encode,60*60*24*7)

        # return success
        return data_success, 200

      # if not data return error
      return jsonify(data_error), 401

  except: 
    data_api_error={
      "error": True,
      "message": "請按照情境提供對應的錯誤訊息"
    }
    return jsonify(data_api_error)
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
    logout= jsonify({
      "ok": True
    })

    # set cookie time to zero, response to client
    logout.set_cookie("Token",max_age=0)
    return logout,200
  except: 
    return 404