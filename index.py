from flask import Flask, redirect, render_template, Blueprint, request

from api.v1.api import api
from api.v1.api_conf import api_conf
from api.v1.utils import utils
from api.v1.request import get_url


utils.init(__file__)
app = Flask(__name__)
app.config['SECRET_KEY'] = 'session need'
app.config['api_conf'] = api_conf()

app.register_blueprint(Blueprint('main', __name__, template_folder='static'))
app.register_blueprint(api, url_prefix='/api')


@app.route('/')
def index():
    # return redirect('./static/index.html', code=301)
    return render_template('index.html')

@app.route('/get',methods=['GET','POST'])
def get():
    
    url = request.args.get('url')
    doc_html = get_url(url)

    return doc_html


if __name__ == '__main__':
    conf = app.config['api_conf'].conf
    app.run(host=conf['ip'], port=int(conf['port']), threaded=utils.bool(conf['threaded']), debug=utils.bool(conf['debug']), ssl_context=(r"./pem/server.crt", r"./pem/server.key"))
    # app.run(host='0.0.0.0',port=5000,threaded=True,debug=True)
