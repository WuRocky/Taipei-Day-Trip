from flask import *
from flask import Blueprint
from flask_cors import CORS
from myModules.mysql_pool import *
from myModules.success_or_error import *

attractions_api = Blueprint('attractions_api', __name__)

CORS(attractions_api)

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
    
    # show next page number
    if next_page >= 0:
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

    # everyone data information
    for api in sql_data:
      sql_page_data.append(datebase_data(
          api["id"], 
          api["name"], 
          api["category"], 
          api["description"], 
          api["address"], 
          api["transport"], 
          api["mrt"], 
          api["lat"], 
          api["lng"], 
          api["images"]
        )
      )

    # judging the next page and data
    if len(sql_page_data) !=13:
      return jsonify(data_api_success(None, sql_page_data))  
    elif next_page > 0:
      return jsonify(data_api_success(next_page,sql_page_data[0:12]))
    elif input_keyword != None:
      return jsonify(data_api_success(next_page+1,sql_page_data[0:12]))    

  except: 
    mes = "伺服器錯誤"
    return jsonify(error(mes)),404
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

    # if not id show error
    if api == None:
      re = "查無資料"
      return jsonify(data_id_api_error(re))

    # everyone id data information
    attractions_id_api = datebase_data(
      api["id"], 
      api["name"], 
      api["category"], 
      api["description"], 
      api["address"], 
      api["transport"], 
      api["mrt"], 
      api["lat"], 
      api["lng"], 
      api["images"]
    )

    # show pairing info
    return jsonify(data_id_api(attractions_id_api))
  except: 
    mes = "伺服器錯誤"
    return jsonify(error(mes)),404
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
    mes = "伺服器錯誤"
    return jsonify(error(mes)),404
  finally:
    mycursor.close()
    connection.close()