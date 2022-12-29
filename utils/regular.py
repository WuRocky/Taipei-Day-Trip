import re
import datetime

def name_regex():
  regex = re.compile(r"([a-zA-Z0-9_\s]+).{2,}$")
  return regex

def email_regex():
  regex = re.compile(r"[a-z0-9A-Z]+@[a-z]+.[a-z]{2,3}")
  return regex

def passwor_regex():
  regex = re.compile(r"([a-zA-Z0-9_\s]+).{2,}$")
  return regex

def numbers_regex():
  numbers = re.compile('\d+')
  return numbers

# def max_order_number():
#   max_order = f"{max_order_number[:8]}-{str(int(max_order_number[9:]) + 1).zfill(3)}"
#   return max_order

# def order_number():
#   order = f"{datetime.datetime.now().strftime('%Y%m%d')}-001"
#   return order

# def phone_regex():
#   phone = re.compile("^09\d{2}-?\d{3}-?\d{3}$")
#   return phone