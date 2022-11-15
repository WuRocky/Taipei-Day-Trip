import json
from mysql.connector import pooling
from mySQL import MySQLPassword
import re


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

try:
  with open("./data/taipei-attractions.json", mode="r", encoding="utf-8") as file:
    connection = get_connection()
    mycursor = connection.cursor()
    
    drop_data_SQL = """DROP TABLE IF EXISTS data,categories"""
    mycursor.execute(drop_data_SQL)
    create_data_SQL = """create table data (id bigint primary key auto_increment, name varchar(255) not null, category varchar(255), description text, address varchar(255), transport text, mrt varchar(255), lat float, lng float, images text) """
    mycursor.execute(create_data_SQL)

    create_categories_SQL = """create table categories (id bigint primary key auto_increment, category varchar(255) UNIQUE KEY);"""
    mycursor.execute(create_categories_SQL)


    data=json.load(file)
    clist = data["result"]["results"]
    for item in clist:
      item_file = item["file"]
      split_url = item_file.split("https://")
      
      item_name = item["name"] # name
      item_category = item["CAT"].replace(u"\u3000","")  # category
      item_description = re.sub(r'\n', '',item["description"]) # description
      item_address = item["address"].replace(" ", "")  # address
      item_transport = item["direction"] # transport
      item_mrt = item["MRT"] # mrt
      item_lat = item["latitude"] # lat
      item_lng = item["longitude"] # lng
      item_images = "https://"+ split_url[1] # images


      mycursor.execute("""insert into data(name, category, description, address, transport,mrt,lat,lng,images) values(%s,%s,%s,%s,%s,%s,%s,%s,%s)""",(item_name,item_category, item_description,item_address, item_transport,item_mrt,item_lat,item_lng,item_images))
      mycursor.execute("""insert into categories(category) values(%s) on duplicate key update category=%s""",(item_category,item_category,))

    

    connection.commit()
except:
  print("Unexpected Error")
finally: 
  mycursor.close()
  connection.close()