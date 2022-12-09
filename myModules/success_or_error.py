from flask import *
def error(mes):
  data_api_error={
    "error": True,
    "message": mes
  }
  return data_api_error

def success():
  data_api_success= {
  "ok":True
  }
  return data_api_success

def data_api_success(value1,value2):
  data_api={
  "nextPage":value1,
  "data":value2
  }
  return data_api

def datebase_data(value_1, value_2, value_3, value_4, value_5, value_6, value_7, value_8, value_9, value_10):
  change_data = {
  "id":value_1,
  "name":value_2,
  "category":value_3,
  "description":value_4,
  "address":value_5,
  "transport":value_6,
  "mrt":value_7,
  "lat":value_8,
  "lng":value_9,
  "images":json.loads(value_10)
  } 
  return change_data

def data_id_api(value_1):
  data_id= {
    "data":value_1
  }
  return data_id

def data_id_api_error(value):
  data_id_error={
    "error": True,
    "message": value
  }
  return data_id_error