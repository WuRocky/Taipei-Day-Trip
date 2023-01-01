from flask import *
from models.mysql_pool import *


def database_data(id, name, category, description, address, transport, mrt, lat, lng, images):
  return {
    "id":id,
    "name":name,
    "category":category,
    "description":description,
    "address":address,
    "transport":transport,
    "mrt":mrt,
    "lat":lat,
    "lng":lng,
    "images":json.loads(images)
  } 


class Attractions_api:
  def __init__(self):
    self.connection = get_connection()
    self.mycursor  = self.connection.cursor(dictionary=True)
  
  def get_attractions_api(self, next_page, row_num, input_keyword, fixd_num):
    try:
      # start to the data
      start = (next_page-1)*row_num

      # if start not plus
      if start < 0:
        start = 0

      # determine whether the input contains keywords
      if input_keyword:
        # search keywords from database
        self.mycursor.execute(
          """
          select * from data 
          where category = %s 
          or name like %s 
          limit %s,%s
          """,
          (
            input_keyword,
            "%"+input_keyword+"%",
            start,
            fixd_num,
          )
        )
      else:
        # search for 12 records from the database
        self.mycursor.execute(
          """
          select * from data 
          limit %s,%s
          """,
          (
            start,
            fixd_num,
          )
        )
      
      sql_data = self.mycursor.fetchall()
      return sql_data
    except: 
      return None
  
  def close_connection(self):
    self.mycursor.close()
    self.connection.close()


class Attractions_id_api:
  def __init__(self):
    self.connection = get_connection()
    self.mycursor  = self.connection.cursor(dictionary=True)

  def get_attractions_id_api(self, attraction_id):
    try:
      # find the corresponding id data in the database
      self.mycursor.execute(
        """
        select * from data 
        where id = %s
        """,
        (attraction_id,)
      )
      api = self.mycursor.fetchone()
      return api
    except: 
      return None

  def close_connection(self):
    self.mycursor.close()
    self.connection.close()

class Categories_api:
  def __init__(self):
    self.connection = get_connection()
    self.mycursor  = self.connection.cursor(dictionary=True)

  def categories_api(self):
    try:
      # search for category to database categories teble
      self.mycursor.execute("""
        select category from categories
        """
        )
      categories = self.mycursor.fetchall()
      # separate the content of the relative category
      api = [api['category'] for api in categories]
      return api
    except: 
      return None

  def close_connection(self):
    self.mycursor.close()
    self.connection.close()