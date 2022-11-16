from flask import *
app=Flask(__name__)
from mysql.connector import pooling
from mySQL import MySQLPassword

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

def get_connection():
  connection = pooling.MySQLConnectionPool(
    pool_name="python_pool",
    pool_size=10,
    pool_reset_session=True,
    host="localhost",
    user="root",
    password="Root@123456",
    database='taipei_day_trip'
    )
  return connection.get_connection()



# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")


# attractions_API
@app.route("/api/attractions")
def api():
  try:
    connection = get_connection()
    mycursor = connection.cursor()

    # get page and keyword
    input_nextPage = request.args.get("page",0)   
    input_keyword = request.args.get("keyword",None)

    # page string chenge to number
    nextPage = int(input_nextPage)
    
    # 12 data per page
    row_num = 12
    
    # start to the data
    start = (nextPage-1)*row_num
    
    # if start not plus
    if start < 0 :
      start = 0
    # search for 12 records from the database

    mycursor.execute("""select * from data limit %s,%s""",(start,row_num,))
    sql_data=mycursor.fetchall()
    data_api={
      "nextPage":nextPage+1,
      "data":sql_data
    }

    # process keywords
    if input_keyword != None:

      # put existing database data into a list
      category_keyword = []
      for api in sql_data:

        # Fuzzy Search and Full Search
        if api[2] == input_keyword or api[1].find(input_keyword) !=-1:
          category_keyword.append(api)
      data_api={
        "nextPage":nextPage+1,
        "data":category_keyword
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

# attractions_id_API
@app.route("/api/attractions/<attractionId>")
def attractionId(attractionId):
  try:
    connection = get_connection()
    mycursor = connection.cursor()

    # find the corresponding id data in the database
    mycursor.execute("select * from data where id = %s",(attractionId,))
    sql_data_id = mycursor.fetchall()

    # if database not data display error
    if sql_data_id == []:
      data_id_api_error={
      "error": True,
      "message": "請按照情境提供對應的錯誤訊息"
      }
      return jsonify(data_id_api_error)

    # show pairing info
    data_id_api= {
      "data":sql_data_id
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
@app.route("/api/categories")
def categories():
  try:
    connection = get_connection()
    mycursor = connection.cursor()
    categories_table = """select category from categories"""
    mycursor.execute(categories_table)
    categories=mycursor.fetchall()
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



if __name__ == "__main__": 
  app.run(port=3000,debug=True)