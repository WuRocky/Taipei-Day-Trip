from flask import *
from mysql.connector import pooling
from mySQL import MySQLPassword
from flask import Blueprint
from flask_cors import CORS

attractions_api = Blueprint('attractions_api', __name__)

CORS(attractions_api)

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

# attractions_API
@attractions_api.route("/api/attractions")
def api():
  try:
    connection = get_connection()
    mycursor = connection.cursor(dictionary=True)

    # get page and keyword
    input_nextPage = request.args.get("page",0)   
    input_keyword = request.args.get("keyword",None)

    # page string chenge to number
    next_page = int(input_nextPage)
    
    if next_page > 0:
      next_page +=1

    # search 13 data 
    row_num = 12
    # get 12 data
    fixd_num = 13
    
    # start to the data
    start = (next_page-1)*row_num
    
    # if start not plus
    if start < 0 :
      start = 0
    
    # determine whether the input contains keywords
    if input_keyword != None:
      # search keywords from database
      mycursor.execute("""select * from data where category = %s or name like %s limit %s,%s""",(input_keyword,"%"+input_keyword+"%",start,fixd_num,))
    else:
      # search for 12 records from the database
      mycursor.execute("""select * from data limit %s,%s""",(start,fixd_num,))
    
    # search database data from judgment
    sql_data=mycursor.fetchall()
    
    sql_page_data = []
    change_data = {}
    # everyone data information
    for api in sql_data:
      # name, category, description, address, transport,mrt,lat,lng,images
      change_data = {
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
      
      sql_page_data.append(change_data)
    
    # judging URL input content display information
    if next_page == 0:
      data_api={
        "nextPage":next_page+1,
        "data":sql_page_data[0:12]
        
      }
    elif next_page > 0:
      data_api={
        "nextPage":next_page,
        "data":sql_page_data[0:12]
      }
    elif input_keyword != None:
      data_api={
        "nextPage":next_page+1,
        "data":sql_page_data[0:12]
      }      

    # if the page data does not meet the criteria show None
    if len(sql_page_data) !=13:
      data_api={
        "nextPage":None,
        "data":sql_page_data
      }

    return jsonify(data_api)
  except: 
    data_api_error ={
      "error":True,
      "message":"請按照情境提供對應的錯誤訊息"
    }
    return jsonify(data_api_error)
  finally:
    mycursor.close()
    connection.close()

# attractions_id_api
@attractions_api.route("/api/attractions/<int:attractionId>")
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

# categories
@attractions_api.route("/api/categories")
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