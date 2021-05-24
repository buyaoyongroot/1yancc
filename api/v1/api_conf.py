import configparser

class api_conf():
    def __init__(self):
        cfg = configparser.ConfigParser()
        cname='conf.ini'
        cfg.read(cname) 
        conn=cfg.get('env','conn')
        conf=dict(cfg.items(conn))
        self.conf=conf

if __name__ == '__main__':
    pass