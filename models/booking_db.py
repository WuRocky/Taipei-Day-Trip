from flask import *
from models.mysql_pool import *


def reuslt_booking_api(attraction_id, attractions_name, attractions_adrress, img, date, time, price):
  return  {
    "data":{
      "attraction": {
        "id": attraction_id,
        "name": attractions_name,
        "address": attractions_adrress,
        "image": img
      },
      "date": date,
      "time": time,
      "price": price
    }
  }


class Booking_api_get:
  def __init__(self):
    self.connection = get_connection()
    self.mycursor  = self.connection.cursor(dictionary=True)

  def check_booking_user(self, user_id):
    # use user_id select booking
    self.mycursor.execute(
      """
      select * from 
      booking 
      where member_id = %s 
      """,
      (user_id,)
    )
    reuslt_check_booking=self.mycursor.fetchall()
    return reuslt_check_booking

  def search_data_database(self, id):
    # use id select data 
    self.mycursor.execute(
      """
      select name, 
      address 
      from data 
      where id = %s
      """,
      (id,)
    )
    reuslt_data=self.mycursor.fetchone()
    return reuslt_data

  def close_connection(self):
    self.mycursor.close()
    self.connection.close()

class Booking_api_post:
  def __init__(self):
    self.connection = get_connection()
    self.mycursor  = self.connection.cursor(dictionary=True)

  def check_booking(self, user_id, attraction_id, date, price_numbers, time):
    # use member_id select booking
    self.mycursor.execute(
      """
      select * from 
      booking where 
      member_id = %s and
      attractionId = %s and
      booking_date = %s and
      booking_price = %s and
      booking_time = %s
      """,
      (user_id, attraction_id, date, price_numbers, time)
    )
    reuslt=self.mycursor.fetchone()
    return reuslt

  def add_booking(self, user_id, attraction_id, date, time, price_numbers, price_text, img):
    # add booking
    self.mycursor.execute(
      """
      insert into booking(
      member_id,
      attractionId, 
      booking_date,
      booking_time,
      booking_price,
      booking_price_text,
      booking_img) 
      values(%s, %s, %s, %s, %s, %s, %s)
      """
      ,(user_id, 
      attraction_id, 
      date, 
      time, 
      price_numbers, 
      price_text, 
      img)
    )
    self.connection.commit()
    return True

  def update_booking(self, attraction_id, date, time, price_numbers, price_text, img, user_id):
    # update booking
    self.mycursor.execute(
      """
      UPDATE booking SET attractionId=%s,
      booking_date=%s,
      booking_time=%s,
      booking_price=%s,
      booking_price_text=%s,
      booking_img = %s
      where member_id =%s
      """, (
      attraction_id, 
      date, time, 
      price_numbers, 
      price_text, 
      img,
      user_id)
    )
    self.connection.commit()
    return True
    
  def close_connection(self):
    self.mycursor.close()
    self.connection.close()


class Booking_api_delete:
  def __init__(self):
    self.connection = get_connection()
    self.mycursor  = self.connection.cursor(dictionary=True)

  # check user member
  def check_member(self, id):
    self.mycursor.execute(
      """
      select id from member 
      where id = %s
      """,
      (id,)
    )
    reuslt=self.mycursor.fetchone()
    return reuslt

  def check_attractions_name(self, name):
    self.mycursor.execute(
      """
      select id from data
      where name = %s
      """,
      (name,)
    )
    reuslt = self.mycursor.fetchone()
    return reuslt

  # delete booking
  def delete_booking(self, user_id, attraction_id, date, time, pay):
    self.mycursor.execute(
      """
      DELETE FROM booking 
      WHERE 
      member_id = %s and
      attractionId = %s and
      booking_date =%s and
      booking_time =%s and
      booking_price =%s;
      """,
      (user_id, attraction_id, date, time, pay)
    )
    self.connection.commit()
    return True

  def close_connection(self):
    self.mycursor.close()
    self.connection.close()
