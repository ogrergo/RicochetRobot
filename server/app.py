from flask import Flask, Blueprint
from flask_socketio import SocketIO

# HTTP API
# bp = Blueprint('ricochet-robot', __name__,)
# @bp.route("/")
# def hello_world():
#     return "<p>Hello, World!</p>"

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
# app.register_blueprint(bp, url_prefix='/api')

# socketio0
socketio = SocketIO(app) #, logger=True, engineio_logger=True)

@socketio.on('message')
def handle_message(data):
    print('received message: ' + data)

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
