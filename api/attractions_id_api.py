from flask import *
from mysql.connector import pooling
from mySQL import MySQLPassword
from flask import Blueprint
from flask_cors import cross_origin


attractions_id_api = Blueprint('attractions_id_api', __name__)

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



# attractions_id_API
@attractions_id_api.route("/api/attractions/<int:attractionId>")
@cross_origin()
def attractionId(attractionId):
  try:
    connection = get_connection()
    mycursor = connection.cursor(dictionary=True)

    # find the corresponding id data in the database
    mycursor.execute("select * from data where id = %s",(attractionId,))
    api = mycursor.fetchone()
    
    # get everyone data row name and data information
    attractions_id_API = {
      "id":api["id"],
      "name":api["name"],
      "category":api["category"],
      "description":api["description"],
      "address":api["address"],
      "transport":api["transport"],
      "mrt":api["mrt"],
      "lat":api["lat"],
      "lng":api["lng"],
      "images":json.loads(api["images"])
    }

    if attractions_id_API == None:
      data_id_api_error={
      "error": True,
      "message": "請按照情境提供對應的錯誤訊息"
      }

      return jsonify(data_id_api_error)

    # show pairing info
    data_id_api= {
      "data":attractions_id_API
    }
    return jsonify(data_id_api)
  except: 
    data_api_error ={
      "error":True,
      "message":"請按照情境提供對應的錯誤訊息"
    }
    return jsonify(data_api_error)
  finally:
    mycursor.close()
    connection.close()