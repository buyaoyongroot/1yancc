### 一言

>Python3实现的优质安全的私有云笔记，在这里，安全是第一位的。





#### 在线演示

直接邮箱密码登陆，第一次登陆直接注册

> https://1yan.cc





#### 安装

默认使用sqlite数据库存储。

> pip3 install -r requirements.txt
>
> python3 index.py





#### 访问

> https://127.0.0.1:8011





#### PS

##### 快速后台启动

> nohup python3 index.py &





##### supervisor启动

```
yum install -y supervisor
mkdir -p /var/log/1yan/supervisor


vi /etc/supervisord.d/1yan.ini

[program:1yan]
command=/usr/bin/python3 index.py
#command=/usr/local/bin/gunicorn -w 3 -b 0.0.0.0:8011 index:app --timeout 600
directory=/home/wwwroot/www.1yan.cc/

numprocs=1
stdout_logfile=/var/log/1yan/supervisor/1yan.log
stderr_logfile=/var/log/1yan/supervisor/1yan.log
autostart=true
autorestart=true
startsecs=5
stopwaitsecs = 600
priority=1

supervisorctl update
supervisorctl status
```



#### Nginx80反向代理8011

支持lnmp多域名指向80

````
cd /usr/local/nginx/conf/vhost

server {
listen 80;
server_name 1yan.cc;
return 301 https://1yan.cc;
}



server {
    listen       443 ssl;
    server_name  1yan.cc www.1yan.cc;

    ssl_certificate      /home/wwwroot/www.1yan.cc/pem/server.crt;
    ssl_certificate_key  /home/wwwroot/www.1yan.cc/pem/server.key;

    ssl_session_timeout  5m;

    location / {
        proxy_pass https://localhost:8011;
    }

}

lnmp nginx restart
````



