from flask import *
from flask import Blueprint
from flask_cors import CORS
from models.attractions_db import Attractions_api as data_db
from models.attractions_db import Attractions_id_api as data_db_id
from models.attractions_db import Categories_api as data_db_categories
from models.attractions_db import database_data


attractions_api = Blueprint('attractions_api', __name__)

CORS(attractions_api)

# attractions_api
@attractions_api.route("/api/attractions")
def api():
  try:
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
    
    # use models attractions_db
    attractions_api = data_db()
    data = attractions_api.get_attractions_api(next_page, row_num, input_keyword, fixd_num)
    sql_page_data = []
    # everyone data information
    for api in data:
      # get data info append to the sql_page_data
      sql_page_data.append(database_data(
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
      return jsonify({
        "nextPage":None,
        "data":sql_page_data
      }),200  
    elif next_page > 0:
      return jsonify({
        "nextPage":next_page,
        "data":sql_page_data[0:12]
      }),200  
    elif input_keyword != None:
      return jsonify({
        "nextPage":next_page+1,
        "data":sql_page_data[0:12]
      }),200  
  except: 
    return jsonify({
      "error": True,
      "message": "伺服器內部錯誤"
    }),500

  finally:
    data_db().close_connection()

# attractions_id_api
@attractions_api.route("/api/attractions/<int:attractionId>")
def attractionId(attractionId):
  try:
    # use models attractions_db
    attractions_id_api = data_db_id()
    api = attractions_id_api.get_attractions_id_api(attractionId)

    # if not id show error
    if api == None:
      return jsonify({
      "error": True,
      "message": "景點編號不正確"
      }),400

    # everyone id data information
    attractions_id_api = database_data(
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
    return jsonify({
      "data":attractions_id_api
    }),200
  except: 
    return jsonify({
      "error": True,
      "message": "伺服器內部錯誤"
    }),500
  finally:
    data_db_id().close_connection()

# categories
@attractions_api.route("/api/categories")
def categories():
  try:
    # use models attractions_db
    model = data_db_categories()
    data = model.categories_api()

    return jsonify({
      "data":
        data
    }),200
  except:
    return jsonify({
      "error": True,
      "message": "伺服器內部錯誤"
    }),500
  finally:
    data_db_categories().close_connection()