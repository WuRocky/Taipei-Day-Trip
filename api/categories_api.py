from flask import *
from mysql.connector import pooling
from mySQL import MySQLPassword
from flask import Blueprint
from flask_cors import cross_origin


categories_api = Blueprint('categories_api', __name__)

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

# categories
@categories_api.route("/api/categories")
@cross_origin()
def categories():
  try:
    connection = get_connection()
    mycursor = connection.cursor()

    # search for category to database categories teble
    categories_table = """select category from categories"""
    mycursor.execute(categories_table)
    categories=mycursor.fetchall()

    # remove blank
    categories_str=["".join(i) for i in categories]
    categories_api = {
      "data":
        categories_str
    }
    return jsonify(categories_api)
  except:
    categories_api_error ={
      "error":True,
      "message":"請按照情境提供對應的錯誤訊息"
    }
    return jsonify(categories_api_error)
  finally:
    mycursor.close()
    connection.close()