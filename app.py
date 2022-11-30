from flask import *

from api.attractions_api import attractions_api
from api.attractions_id_api import attractions_id_api
from api.categories_api import categories_api


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

app.register_blueprint(attractions_api)
app.register_blueprint(attractions_id_api)
app.register_blueprint(categories_api)




if __name__ == "__main__": 
  # app.run(port=3000,debug=True)
  # app.run(port=3001)
  # app.run(host = "0.0.0.0", port=3000,debug=True)
  app.run(host = "0.0.0.0", port=3000)