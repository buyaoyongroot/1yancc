class utils():
    #===============加密类=========================================       
    @staticmethod
    def md5(str):
        import hashlib   
        hl = hashlib.md5()
        hl.update(str.encode(encoding='utf-8'))    
        return hl.hexdigest()

    #===============随机类=========================================   

    @staticmethod
    def _wc(list, weight):
        import random
        new_list = []
        for i, val in enumerate(list):
            for i in range(weight[i]):
                new_list.append(val) 
        return random.choice(new_list)

    @staticmethod
    def rs(cc):
        import random
        return ''.join(random.sample('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', int(cc)))

    @staticmethod
    def hash():
        import time,random
        time12 = int(time.time()*1000)
        rand04 = random.randint(1000,9999)
        return utils.md5(str(time12)+str(rand04))
    #===============时间类=========================================   
    @staticmethod
    def time():
        import time
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) 

    @staticmethod
    def bool(arg):
        arg=arg.lower()
        if arg=='true':
            return True
        return False
    #===============初始化类========================================= 
    @staticmethod
    def init(fp):
        import os,sys
        ext=os.path.splitext(sys.argv[0])[1] 
        if ext=='.py':path=os.path.dirname(os.path.realpath(fp))
        if ext=='.exe':path=os.path.dirname(os.path.realpath(sys.argv[0]))
        path=path.replace('\\','/')+'/'
        os.chdir(path)#修改工作目录


if __name__ == '__main__':
    print(utils.time())