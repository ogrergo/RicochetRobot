from flask import Flask, Blueprint

bp = Blueprint('ricochet-robot', __name__,)
@bp.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

app = Flask(__name__)
app.register_blueprint(bp, url_prefix='/api')

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8000)

