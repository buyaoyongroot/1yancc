(function() {
    $(function() {
        // marked
        var markedRender = new marked.Renderer();
        marked.setOptions({
            renderer: markedRender,
            gfm: true,
            tables: true,
            breaks: true, // '>' 换行，回车换成 <br>
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false
        });
        // codemirror editor
        editor = CodeMirror.fromTextArea($('#editor').get(0), {
            mode: 'markdown',
            lineNumbers: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            showCursorWhenSelecting: true,
            lineWrapping: true, // 长句子折行
            theme: "material",
            keyMap: 'sublime',
            extraKeys: {
                "Enter": "newlineAndIndentContinueMarkdownList"
            }
        });
        //      editor.getDoc().setValue('请开始你的写作');//修复无hash新建篡位
        // editor.refresh();
        // $('#editor').click();
        // editor.on('change', editorOnHandler);
        // $('#editor').focus();
    });
})();
//滚动条样式
(function() {
    'use strict';
    const scrollbarWidth = 8,
        thumbBorderWidth = 1,
        thumbBorderColor = "rgba(255, 255, 255, 0.4)",
        scrollbarMouseOverColor = 'rgba(128, 128, 128, 0.2)',
        thumbColor = 'rgba(0, 0, 0, 0.4)',
        thumbMouseOverColor = 'rgba(0, 0, 0, 0.8)';
    const cssText = `
    ::-webkit-scrollbar{
    width: ${scrollbarWidth}px !important;
    height: ${scrollbarWidth}px !important;
    background:transparent;
    filter: invert();
    }
    ::-webkit-scrollbar:hover {
    background: ${scrollbarMouseOverColor};
    }
    ::-webkit-scrollbar-thumb {
    border: ${thumbBorderWidth}px solid ${thumbBorderColor} !important;
    background-color: ${thumbColor} !important;
    z-index: 2147483647;
    -webkit-border-radius: 12px;
    background-clip: content-box;
    }
    ::-webkit-scrollbar-corner {
    background: rgba(255, 255, 255, 0.3);
    border: 1px solid transparent
    }
    ::-webkit-scrollbar-thumb:hover {
    background-color: ${thumbMouseOverColor} !important;
    }
    ::-webkit-scrollbar-thumb:active {
    background-color: rgba(0, 0, 0, 0.6) !important
    }
  `;

    function GMaddStyle(css) {
        let a = document.createElement('style'),
            doc;
        a.textContent = '<!--\n' + css + '\n-->';
        if (location.origin === "file://") {
            doc = document.head || document.documentElement;
        } else {
            doc = document.body || document.documentElement;
        }
        doc.appendChild(a);
    }
    GMaddStyle(cssText);
})();

function editorOnHandler(cm, co) {
    saveTextdata('silence');
    // marked(cm.getValue()).replaceAll('&lt;br&gt;','<br>')
    // marked(editor.getDoc().getValue()).replaceAll('&lt;br&gt;','<br>')
    $('.markdown-body').html(markend(marked(marketr(cm.getValue()))));
    // $('.markdown-body').html(marked(cm.getValue()));
    $('.markdown-body pre code').each(function(i, block) {
        Prism.highlightElement(block);
    });
    hookhreftarget();
}

function hookhreftarget() {
    // $('a[href^="http"]').each(function()
    $('a[href]').each(function() {
        if ($(this).attr('href').slice(0, 4) != 'http') {
            $(this).attr('href', 'http://' + $(this).attr('href'));
        }
        $(this).attr('target', '_blank');
    });
}
// var selectedNode;
var brower_width = document.body.clientWidth;

function init() {
    repeatbind();
    resetresiz2();
    // resetresiz();
    // resetsidebar();
}

function repeatbind() {
    $('.sidebar').mousedown(function(e) {
        if (3 == e.which) { //e123 左中右
            if ($(e.target).parents("a").length == 0) {
                //      if(zTree.getSelectedNodes().length>0){
                // selectedNode=zTree.getSelectedNodes()[0];
                //      }
                //      zTree.cancelSelectedNode();
                menulayer('root');
            }
        }　
        if (1 == e.which) {
            // $("#rMenu ul").hide();
            layer.close(lay);
            //zTree.selectNode(selectedNode);
        }　
        //return false; //阻止链接跳转 这个行为会是编辑失效
    });
    $('.content').mousedown(function(e) {　
        if (3 == e.which) { //e123 左中右
            //resetsidebar();
            $(".sidebar").toggle();
            if ($(".sidebar").css('display') == "none") {
                $(".sidebar").css('width', '0%');
            } else {
                $(".sidebar").css('width', '300px');
            }
        }
    });
    //阻止浏览器默认右键点击事件
    $(".sidebar").on("contextmenu", function() {
        return false;
    })
    // $(".layui-layer").on("contextmenu", function(){
    //     return false;
    // })
    $(".content").on("contextmenu", function() {
        return false;
    })
    $(".content").textarea_alt_s(saveTextdata);
}

function resetresiz2() {
    $('.sidebar').resizable({
        handles: 'e',
        delay: 50,
        resize: function(event, ui) {}
    });
}

function saveTextdata(state) {
    // var hash1 = $(".autoarea").attr("hash");
    var hash1 = contenthash;
    if (typeof(hash1) == "undefined") {
        hash1 = hash();
        var newNode = {
            name: getdatename(),
            id: getMaxNodesId(),
            hash: hash1
        };
        zTree.addNodes(null, newNode);
        saveTreeNodes();
        // $(".autoarea").attr("hash",hash1);
        contenthash = hash1;
    }
    // var hashbash=hash1+encodeDES($(".autoarea").val(), encodeDES(hash1,userhash));
    var hashbash = hash1 + encodeDES(editor.getDoc().getValue(), encodeDES(hash1, userhash));
    $.post(Hostapi, {
        'act': 'settextdata',
        'hash': hashbash
    }, function(data) {
        if (state != 'silence') {
            layer.msg('已保存', {
                icon: 1,
                time: 618
            });
        }
    });
}

function welcome() {
    $(".editor").toggle();
    $(".content").toggle();
    editor.getDoc().setValue('To write sth.'); //修复无hash新建篡位
    editor.refresh();
    editor.on('change', editorOnHandler);
    //placeholder="请先填写笔记内容"
    // $(".autoarea").toggle();
    // $(".autoarea").attr('placeholder','请先填写笔记内容');
}

function layerlogin() {
    layer.open({
        type: 1,
        // skin: 'layui-layer-demo', //样式类名
        closeBtn: 0, //不显示关闭按钮
        anim: 0,
        title: false,
        offset: '100px',
        //shade : [0.7, '#000'],
        shade: [1, '#f8f8f8'],
        skin: 'login-body',
        area: ['500px', '250px'], //宽高
        // shadeClose: true, //开启遮罩关闭
        //content: ['login.html','no'],
        content: '<div class="login"><p style="text-align: center;margin-left: 70px;"><img src="./static/dist/img/logo.png" height="50" width="50"/></p><p><label for="login">Email:</label><input type="text" id="email" placeholder="name@example.com" autocomplete="off"></p><p><label for="password">Password:</label><input type="password" id="password" placeholder="over 5 bits without space"></p><p class="login-submit" style="margin-top: 60px;"><button type="submit" class="login-button">Login</button></p> <!--<p class="forgot-password"><a href="index.html">Forgot your password?</a></p> --></div>',
        success: function(layero, index) {
            var index = index;
            $("#email").focus();
            $(".login-button").click(function() {
                loginclick(index);
            });
            $(document).bind('keyup', function(e) {
                if (e.keyCode == 13) {
                    loginclick(index);
                }
            });
        },
        end: function() {
            welcome();
            treemain();
        }
    });
}

function islogin() {
    $.post(Hostapi, {
        'act': 'login'
    }, function(data) {
        var rs = data.toJson();
        $(".loading").remove();
        layerlogin();
    });
}
$(document).ready(function() {
    init();
    islogin();
});
//---------------------------------------
function loginclick(index) {
    var email = $("#email").val();
    var password = trimPassword($("#password").val());
    if (isEmail(email)) {
        if (password.length > 4) {
            login(email.toLowerCase(), password, index);
        } else {
            // log("password not over 5 bits");
            layer.msg('password not over 5 bits', {
                icon: 0,
                time: 618
            });
        }
    } else {
        // log("email error");
        layer.msg('email error', {
            icon: 0,
            time: 618
        });
    }
}

function hex_md5_256(password) {
    for(var i=0; i<256; i++)
    { 
        password = hex_md5(password);
    }
    return password;
}

function login(email, password, index) {
    // $.post(Hostapi,{'act':'getuserinfo','email':email,'password':password},function(data){
    $.post(Hostapi, {
        'act': 'getuserinfo',
        'email': email,
        'password': hex_md5_256(hex_md5(password))
    }, function(data) {
        var rs = data.toJson();
        if (rs.state) {
            //userhash=rs.hash+encodeDES(email,password);
            userhash = hex_md5(password);
            // userhash=rs.hash;
            layer.close(index);
            $(document).unbind('keyup'); //清除绑定事件
        } else {
            // log(data);
            layer.msg('password error', {
                icon: 0,
                time: 618
            });
        }
    });
}

function isEmail(strEmail) {
    var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (myreg.test(strEmail)) {
        return true;
    }
    return false;
}

function trimPassword(strPassword) {
    return strPassword.replace(/ /g, '');
}