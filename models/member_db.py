from flask import *
from models.mysql_pool import *

class Member_api_get:
  def __init__(self):
    self.connection = get_connection()
    self.mycursor  = self.connection.cursor(dictionary=True)

  def check_member_user(self, user_id, user_name):
    self.mycursor.execute(
      """
      select id, name, email from
      member where
      id = %s and
      name = %s
      """,
      (
        user_id,
        user_name
      )
    )
    reuslt = self.mycursor.fetchone()
    return reuslt

  def close_connection(self):
    self.mycursor.close()
    self.connection.close()

class Member_api_post:
  def __init__(self):
    self.connection = get_connection()
    self.mycursor  = self.connection.cursor(dictionary=True)

  def check_member_user(self, user_id):
    self.mycursor.execute(
      """
      select id, name, email from
      member where
      id = %s
      """,
      (
        user_id,
      )
    )
    reuslt = self.mycursor.fetchone()
    return reuslt

  def update_member(self, user_id,  update_user_name , update_user_email):
    self.mycursor.execute(
      """
      update member 
      set name = %s, 
      email = %s
      where id = %s
      """,(
        update_user_name,
        update_user_email,
        user_id
      )
    )
    self.connection.commit()
    return True


  def close_connection(self):
    self.mycursor.close()
    self.connection.close()
