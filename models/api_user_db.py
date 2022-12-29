from flask import *
from models.mysql_pool import *
import bcrypt

class Api_user_post:
  def __init__(self):
    self.connection = get_connection()
    self.mycursor  = self.connection.cursor(dictionary=True)

  def search_member_info(self, email):
    try:
      # select memebr database email
      self.mycursor.execute(
        """
        select email from 
        member where email = %s 
        LIMIT 1
        """,
        (email,)
      )
      api = self.mycursor.fetchone()
      return api
    except:
      return None

  def add_member_info(self, name, email, password):
    try:
      # used bcrypt store password
      bytes = password.encode('utf-8')
      salt = bcrypt.gensalt()
      bcrypt_hash = bcrypt.hashpw(bytes, salt)

      # select memebr database name, email and password
      self.mycursor.execute(
        """
        insert into member(name, email, password) 
        values(%s, %s, %s)
        """,
        (name, email, bcrypt_hash)
        )
      self.connection.commit()
      return True
    except:
      return None

  def close_connection(self):
    self.mycursor.close()
    self.connection.close()


class Api_user_auth_put:
  def __init__(self):
    self.connection = get_connection()
    self.mycursor  = self.connection.cursor(dictionary=True)
  
  def search_member(self, email):
    try:
      # use email select member data 
      self.mycursor.execute(
        """
        select id, 
        name, 
        email, 
        password 
        from member 
        where 
        email = %s 
        """
        ,(email,)
      )
      reuslt = self.mycursor.fetchone()
      return reuslt
    except:
      return None
  
  def close_connection(self):
    self.mycursor.close()
    self.connection.close()

class Api_user_auth_get:
  def __init__(self):
    self.connection = get_connection()
    self.mycursor  = self.connection.cursor(dictionary=True)

  def get_member(self, id, name, email):
    try:
      self.mycursor.execute(
        """
        select id, 
        name, 
        email 
        from member 
        where id = %s 
        and name = %s 
        and email = %s
        """,
        (id, name, email,)
      )
      reuslt = self.mycursor.fetchone()
      
      return reuslt
    except:
      return None

  def close_connection(self):
    self.mycursor.close()
    self.connection.close()
