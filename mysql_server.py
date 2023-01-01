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

def mysql():
  try:
    with open("./data/taipei-attractions.json", mode="r", encoding="utf-8") as file:
      connection = get_connection()
      mycursor = connection.cursor()
      
      # if there is data in the database, delete the existing data
      drop_data_SQL = """DROP TABLE IF EXISTS 
        data, 
        categories, 
        member, 
        booking, 
        orders,
        orders_done
        """
      mycursor.execute(drop_data_SQL)
      
      # create new data table
      create_data_SQL = """create table data 
        (id bigint primary key auto_increment, 
        name varchar(255) not null, 
        category varchar(255), 
        description text, 
        address varchar(255), 
        transport text, 
        mrt varchar(255), 
        lat float, 
        lng float, 
        images text);
        """
      mycursor.execute(create_data_SQL)
      
      # create new categories table to search for category
      create_categories_SQL = """create table categories 
        (id bigint primary key auto_increment, 
        category varchar(255) UNIQUE KEY);
        """
      mycursor.execute(create_categories_SQL)

      # create new categories table member
      create_member_SQL = """create table member 
        (id bigint primary key auto_increment, 
        name varchar(255) not null, 
        email varchar(255) not null, 
        password varchar(255) not null);
        """
      mycursor.execute(create_member_SQL)
      
      # create new categories table booking
      create_booking_SQL = """create table booking 
        (id  bigint primary key auto_increment, 
        member_id bigint not null, 
        attractionId bigint not null, 
        booking_date varchar(255) not null, 
        booking_time varchar(255) not null, 
        booking_price Decimal not null, 
        booking_price_text varchar(255) not null, 
        booking_img text not null, 
        foreign key (member_id) 
        references member(id)); 
        """
      mycursor.execute(create_booking_SQL)
      
      # create new categories table order_undone
      create_order_SQL = """CREATE TABLE orders (
        order_id bigint primary key auto_increment,
        order_member_id bigint,
        order_number VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL DEFAULT 'undone',
        prime text NOT NULL,
        price  Decimal NOT NULL,
        id bigint NOT NULL,
        attraction_name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        image text NOT NULL,
        date VARCHAR(255) NOT NULL,
        time VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        foreign key (order_member_id) 
        references member(id));
        """
      mycursor.execute(create_order_SQL)

      # create new categories table order_undone
      create_order_done_SQL = """CREATE TABLE orders_done (
        order_id bigint primary key auto_increment,
        order_member_id bigint,
        order_number VARCHAR(255) NOT NULL,
        price  Decimal NOT NULL,
        id bigint NOT NULL,
        attraction_name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        image text NOT NULL,
        date VARCHAR(255) NOT NULL,
        time VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL DEFAULT '1',
        foreign key (order_member_id) 
        references member(id));
        """
      mycursor.execute(create_order_done_SQL)

      data=json.load(file)
      clist = data["result"]["results"]
      for item in clist:
        item_file = item["file"]
        split_url = item_file.split("https://")
        
        item_name = item["name"] # name
        item_category = item["CAT"]  # category
        item_description = re.sub(r'\n', '',item["description"]) # description
        item_address = item["address"].replace(" ", "")  # address
        item_transport = item["direction"] # transport
        item_mrt = item["MRT"] # mrt
        item_lat = item["latitude"] # lat
        item_lng = item["longitude"] # lng
        item_images = ["https://"+str(i) for i in split_url[1:len(split_url)]] # images
        
        new_list = [x for x in item_images if re.search(".jpg|.JPG|.png|.PNG",x)]
        
        mycursor.execute("""insert into data
        (name, category, 
        description, 
        address, 
        transport,
        mrt,
        lat,
        lng,
        images) 
        values(%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
        (item_name,
        item_category, 
        item_description,
        item_address, 
        item_transport,
        item_mrt,
        item_lat,
        item_lng,
        json.dumps(new_list)))
        
        mycursor.execute("""insert into 
        categories(category) values(%s) on duplicate key update category=%s
        """,
        (item_category,
        item_category,))
      
        connection.commit()
  except:
    print("Unexpected Error")
  finally: 
    mycursor.close()
    connection.close()

mysql()