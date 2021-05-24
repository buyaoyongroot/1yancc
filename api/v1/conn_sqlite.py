import sqlite3
class conn_sqlite():
    def __init__(self,dbpath='data.db'):
        self.conn = sqlite3.connect(dbpath)
        self.conn.row_factory = sqlite3.Row
        self.cur = self.conn.cursor()

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
        return list(map(lambda i:dict(i),results))

    def queryone(self,sql):
        self.cur.execute(sql)
        results = self.cur.fetchone()
        self.conn.commit()
        if results!=None:results = dict(results)
        return results

    def lastid(self):
        return self.queryone('select last_insert_rowid()')['last_insert_rowid()']

if __name__ == '__main__':
    pass
