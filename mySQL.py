import os
from dotenv import load_dotenv
load_dotenv()


password =  os.getenv("mysql_password")
def MySQLPassword():
  return password