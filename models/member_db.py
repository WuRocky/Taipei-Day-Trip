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