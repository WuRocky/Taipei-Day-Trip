
import os
from dotenv import load_dotenv
load_dotenv()


def JWT_SECRET():
  return  os.getenv("key")

def JWT_ALGORITHM():
  return  os.getenv("algorithm")
