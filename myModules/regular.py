import re

def name_regex():
  regex = re.compile(r"([a-zA-Z0-9_\s]+).{2,}$")
  return regex

def email_regex():
  regex = re.compile(r"[a-z0-9A-Z]+@[a-z]+.[a-z]{2,3}")
  return regex

def passwor_regex():
  regex = re.compile(r"([a-zA-Z0-9_\s]+).{2,}$")
  return regex


