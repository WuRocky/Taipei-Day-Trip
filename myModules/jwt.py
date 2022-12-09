import jwt
from datetime import *
from password import *

# jwt encode function
def jwt_token(user_id, name, email): 
  payload = {
  "data": {
    "id": user_id,
    "name": name,
    "email": email
  },
  "exp": datetime.utcnow() + timedelta(days=7),
  "iat": datetime.utcnow(),
  }
  jwt_token = jwt.encode(payload, JWT_SECRET(), JWT_ALGORITHM())
  return jwt_token

# jwt decod function
def jwt_decod(token):
  jwt_decod = jwt.decode(token, JWT_SECRET(), JWT_ALGORITHM())
  return jwt_decod
