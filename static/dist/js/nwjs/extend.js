// window.parent.postMessage({"name":"测试"},'*');  
var isShowWindow = true;  
  
var gui = require('nw.gui');  
gui.App.clearCache();
//console.log(gui.App.argv);
var win = gui.Window.get();  
var tray = new gui.Tray({  
    title:'留白',  
    icon:'logo.png'  
});  
tray.tooltip = "留白";  
  
win.on('close',function(){  
    this.hide();  
    isShowWindow = false;  
})  
  
//添加菜单  
var menu = new gui.Menu();  
  
menu.append(new gui.MenuItem({  
    type:'normal',  
    label:'显示/隐藏',  
    click:function(){  
        if(isShowWindow){  
            win.hide();  
            isShowWindow = false;  
        }else{  
            win.show();  
            isShowWindow = true;  
        }  
    }  
}));  
  
menu.append(new gui.MenuItem({  
    type:'normal',  
    label:'退出',  
    click:function(){  
        win.close(true);
    }  
}));  
  
tray.menu = menu;  
  
tray.on('click',function(){  
    if(isShowWindow){  
        win.hide();  
        isShowWindow = false;  
    }else{  
        win.show();  
        isShowWindow = true;  
    }  
}); 



// var http = require('http');

// http.createServer(function (request, response) {

//     // 发送 HTTP 头部 
//     // HTTP 状态值: 200 : OK
//     // 内容类型: text/plain
//     response.writeHead(200, {'Content-Type': 'text/plain'});
//     win.show();  
//     // 发送响应数据 "Hello World"
//     response.end('Hello World\n');
// }).listen(8888);

// Listen to `open` event  
gui.App.on('open', function(cmdline) {  
    console.log('command line: ' + cmdline);  
    var gui = require('nw.gui');  
    // gui.App.clearCache();
    var win = gui.Window.get();  
    win.show();  
});  

