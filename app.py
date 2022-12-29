
from flask import *

from api.attractions import attractions_api
from api.api_user import user_api
from api.booking import booking_api
from api.order import order_api

app=Flask(
  __name__,
  static_folder="static", 
  static_url_path="/"
  ) 

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")
@app.route("/member")
def member():
	return render_template("member.html")
@app.errorhandler(404)
def error_date(error):
  return render_template("404.html"),404

app.register_blueprint(attractions_api)
app.register_blueprint(user_api)
app.register_blueprint(booking_api)
app.register_blueprint(order_api)

if __name__ == "__main__": 
  # app.run(port=3000,debug=True)
  app.run(port=3000)
  # app.run(host = "0.0.0.0", port=3000,debug=True)
  # app.run(host = "0.0.0.0", port=3000)