import pymysql
class conn_mysql():
    def __init__(self):
        self.conn = pymysql.connect(user='root',passwd='',db='blankspacex',host='127.0.0.1',charset='utf8')
        self.cur  = self.conn.cursor(cursor=pymysql.cursors.DictCursor)

    def close(self): 
        self.cur.close
        self.conn.close

    def exec(self,sql):
        self.cur.execute(sql)
        self.conn.commit()

    def query(self,sql):
        self.cur.execute(sql)
        results = self.cur.fetchall()
        self.conn.commit()
        return list(map(lambda i:i,results))

    def queryone(self,sql):
        self.cur.execute(sql)
        results = self.cur.fetchone()
        self.conn.commit()
        return results

    def lastid(self):
        return self.cur.lastrowid

if __name__ == '__main__':
    pass