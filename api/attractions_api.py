from flask import *
from mysql.connector import pooling
from mySQL import MySQLPassword
from flask import Blueprint
from flask_cors import cross_origin


attractions_api = Blueprint('attractions_api', __name__)

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
@cross_origin()
def api():
  try:
    connection = get_connection()
    mycursor = connection.cursor(dictionary=True)

    # get page and keyword
    input_nextPage = request.args.get("page",0)   
    input_keyword = request.args.get("keyword",None)

    # page string chenge to number
    nextPage = int(input_nextPage)
    
    if nextPage > 0:
      nextPage +=1

    # search 13 data 
    row_num = 12
    # get 12 data
    fixd_num = 13
    
    # start to the data
    start = (nextPage-1)*row_num
    
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
    if nextPage == 0:
      data_api={
        "nextPage":nextPage+1,
        "data":sql_page_data[0:12]
        
      }
    elif nextPage > 0:
      data_api={
        "nextPage":nextPage,
        "data":sql_page_data[0:12]
      }
    elif input_keyword != None:
      data_api={
        "nextPage":nextPage+1,
        "data":sql_page_data[0:12]
      }
      print(data_api)
      
      

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