from flask import *
from models.mysql_pool import *

class Order_api_post:
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


  # get Info on booking attractions from the database
  def attractions_info(self,user_id):
    self.mycursor.execute(
      """
      select 
      a.attractionId, 
      a.booking_date, 
      a.booking_time, 
      a.booking_price, 
      a.booking_img, 
      b.name, 
      b.address
      from booking as a 
      inner join data as b on a.attractionId = b.id 
      where a.member_id = %s; 
      """,
      (user_id,)
    )
    reuslt=self.mycursor.fetchall()
    return reuslt

  # check whether the order number is repeated and generate a serial number
  def check_booking_number(self):
    self.mycursor.execute("""
    SELECT MAX(order_number) FROM orders
    """)
    check_reuslt = self.mycursor.fetchone()
    reuslt = check_reuslt["MAX(order_number)"]
    return reuslt

  # add order info to database
  def add_order(self, order_number, user_id, prime, price, id, attraction_name, address, image, date, time, name, email, phone):
    
    data = list(zip(price, id, attraction_name, address, image, date, time))
    for item in data:
      self.mycursor.execute(
        """
        insert into orders (
        order_number,
        order_member_id,
        prime, 
        price, 
        id,
        attraction_name,
        address,
        image,
        date,
        time,
        name,
        email,
        phone) 
        VALUES 
        (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """,(
        order_number,
        user_id,
        prime, 
        item[0], 
        item[1],
        item[2],
        item[3],
        item[4],
        item[5],
        item[6],
        name,
        email,
        phone
        )
      )
    self.connection.commit()
    return True

  # add completed order_done database
  def orders_done(self, user_id, order_number, price, id, attraction_name, address, image, date, time, name, email, phone):
    
    data = list(zip(price, id, attraction_name, address, image, date, time))
    for item in data:
      self.mycursor.execute(
        """
        insert into orders_done (
        order_member_id,
        order_number,
        price, 
        id,
        attraction_name,
        address,
        image,
        date,
        time,
        name,
        email,
        phone) 
        VALUES 
        (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """,(
        user_id,
        order_number,
        item[0],
        item[1],
        item[2],
        item[3],
        item[4],
        item[5],
        item[6],
        name,
        email,
        phone
        )
      )
    self.connection.commit()
    return True


  def close_connection(self):
    self.mycursor.close()
    self.connection.close()


class Order_api_get:
  def __init__(self):
    self.connection = get_connection()
    self.mycursor  = self.connection.cursor(dictionary=True)
  
  # check orders done data
  def check_orders_done(self, order_number):
    self.mycursor.execute(
      """
      select 
      order_member_id,
      order_number,
      price,
      id,
      attraction_name,
      address,
      image,
      date,
      time,
      name,
      email,
      phone,
      status
      from orders_done where 
      order_number= %s
      """,
      (order_number,)
    )
    reuslt=self.mycursor.fetchall()
    return reuslt

  # serach orders table
  def search_orders(self, orders_done_number):
    self.mycursor.execute(
      """
      select 
      order_number 
      from 
      orders 
      where 
      order_number= %s
      """,
      (orders_done_number,)
    )
    reuslt = self.mycursor.fetchall()
    return reuslt

  # update orders table
  def update_orders(self, orders_done_number):
    self.mycursor.execute(
      """
      UPDATE orders 
      set status=%s 
      where order_number=%s
      """,
      ("done" ,orders_done_number)
    )
    self.connection.commit()
    return True
  
  # delete booking
  def delete_booking(self, order_member):
    self.mycursor.execute(
      """
      delete 
      from 
      booking 
      where 
      member_id = %s;
      """,
      (order_member,)
    )
    self.connection.commit()
    return True

  def order_member_id(self, order_memner_id):
    self.mycursor.execute(
      """
      select * from 
      orders_done
      where
      order_member_id = %s
      """,
      (order_memner_id,)
    )
    reuslt = self.mycursor.fetchall()
    return reuslt

  def close_connection(self):
    self.mycursor.close()
    self.connection.close()