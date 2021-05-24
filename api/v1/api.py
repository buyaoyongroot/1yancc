from flask import Blueprint,request,Response,session,g,current_app
# from functools import wraps
import json
from api.v1.utils import utils
# from api.v1.conn_mysql import conn_mysql
from api.v1.conn_sqlite import conn_sqlite

api = Blueprint('api',__name__) 

def Response_origin_headers(content):    
    resp = Response(content)    
    resp.headers['Access-Control-Allow-Origin'] = '*'    
    resp.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT, DELETE'    
    resp.headers['Allow'] = 'POST, GET, OPTIONS, PUT, DELETE'   
    return resp  

def call(content,i=0):
    if type(content)!=str and type(content)!=int:content=json.dumps(content)
    if i == 0 : return content
    if i == 1 : return Response_origin_headers(content)

@api.route('/index',methods=['GET','POST']) 
def index():
    if request.method =='GET':
        return call(hello())
    if request.method =='POST': 
        act = request.form.get('act')   
        if act == 'login': return call(login())
        # conn = conn_mysql()
        # conn = conn_sqlite()
        if not hasattr(g,'conn'):
            conf=current_app.config['api_conf'].conf
            if conf['db']=='sqlite':
                g.conn = conn_sqlite(conf['dbpath'])#读取一次连接池 加到flask g全局变量中
                inspect_sqlite(g.conn)
        conn=g.conn
        if act == 'getnodedata': result = getnodedata(conn)
        if act == 'setnodedata': result = setnodedata(conn)
        if act == 'gettextdata': result = gettextdata(conn)
        if act == 'settextdata': result = settextdata(conn)
        if act == 'deltextdata': result = deltextdata(conn)
        if act == 'getuserinfo': result = getuserinfo(conn)
        # conn.close()#连接池不需要关闭
        return call(result)

def hello():
    return 'hey bot~'

def login():
    re={}
    if 'uid' in session:
        re['state']=True
        re['hash']=session['hash']
    else:
        re['state']=False
    return re

def inspect_sqlite(conn):
    if int(conn.queryone('select count(1) from sqlite_master')['count(1)'])==0:
        conn.exec('''CREATE TABLE "bs_category" (
            "id"  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            "uid"  TEXT,
            "hash"  TEXT,
            "treenode"  TEXT
            );''')
        conn.exec('''
            CREATE TABLE "bs_record" (
            "id"  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            "uid"  INTEGER,
            "hash"  TEXT,
            "content"  TEXT,
            "alias"  TEXT,
            "delete"  INTEGER
            );''')
        conn.exec('''
            CREATE TABLE "bs_user" (
            "id"  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            "email"  TEXT,
            "password"  TEXT,
            "hash"  TEXT,
            "ip"  TEXT,
            "createdate"  TEXT,
            "username"  TEXT,
            "phone"  TEXT
            );''')
 
def getnodedata(conn):
    uid=session['uid']
    rs = conn.queryone("SELECT hash,treenode FROM `bs_category` WHERE `uid`='%s'"%(uid))
    re={}
    if rs!=None:
        re['state']=True
        re['hash']=rs['hash']+rs['treenode']
    else:
        re['state']=False;
        re['hash']=utils.hash()
    return re

def setnodedata(conn):
    uid=session['uid']
    hash=request.form.get('hash')
    rs = conn.queryone("SELECT treenode FROM `bs_category` WHERE `uid`='%s' AND `hash`='%s'"%(uid,hash[:32]))
    if rs!=None:
        conn.exec("UPDATE `bs_category` SET `treenode`='%s' WHERE uid='%s' AND `hash` = '%s'"%(hash[32:],uid,hash[:32]))
    else:
        conn.exec("INSERT INTO `bs_category` (`uid`, `hash`, `treenode`) VALUES ('%s', '%s', '%s')"%(uid,hash[:32],hash[32:])) 
    return {"state":True}

def gettextdata(conn):
    uid=session['uid']
    hash=request.form.get('hash')
    rs = conn.queryone("SELECT content FROM `bs_record` WHERE `uid`='%s' AND `hash`='%s'"%(uid,hash))
    re={}
    if rs!=None:
        re['state']=True
        re['content']=rs['content']
    else:
        re['state']=False;
        re['content']=''
    return re

def settextdata(conn):
    uid=session['uid']
    hash=request.form.get('hash')
    rs = conn.queryone("SELECT content FROM `bs_record` WHERE `uid`='%s' AND `hash`='%s'"%(uid,hash[:32]))
    if rs!=None:
        conn.exec("UPDATE `bs_record` SET `content`='%s' WHERE uid='%s' AND `hash` = '%s'"%(hash[32:],uid,hash[:32]))
    else:
        conn.exec("INSERT INTO `bs_record` (`uid`, `hash`, `content`) VALUES ('%s', '%s', '%s')"%(uid,hash[:32],hash[32:])) 
    return {"state":True}

def deltextdata(conn):
    uid=session['uid']
    hasharr=request.form.get('hasharr')
    conn.exec("UPDATE `bs_record` SET `delete`='1' WHERE uid='%s' AND `hash` IN (%s)"%(uid,hasharr))
    return {"state":True}

def getuserinfo(conn):
    email=request.form.get('email').lower()
    password=request.form.get('password')
    rs = conn.queryone("SELECT hash FROM `bs_user` WHERE `email`='%s'"%(email))
    re={}
    if rs!=None:
        rs = conn.queryone("SELECT id,hash FROM `bs_user` WHERE `email`='%s' AND `password`='%s'"%(email,password))
        if rs!=None:
            re['state']=True
            re['hash']=rs['hash']
            session['uid']=rs['id']
            session['hash']=re['hash']
        else:
            re['state']=False;
            re['msg']='password error';
    else:
        hash=utils.hash()
        createdate=utils.time();       
        conn.exec("INSERT INTO `bs_user` (`email`, `password`, `hash`, `ip`, `createdate`) VALUES ('%s', '%s', '%s', '%s', '%s')"%(email,password,hash,'',createdate))
        uid=conn.lastid()
        re['state']=True
        re['hash']=hash
        session["uid"]=uid
        session["hash"]=hash
    return re