var setting = {
    edit: {
        enable: true,
        showRemoveBtn: false,
        showRenameBtn: false,
        editNameSelectAll: true,
        drag: {
            isCopy: true,
            isMove: true,
            prev: true,
            inner: true,
            next: true,
        }
    },
    view: {
        dblClickExpand: false
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        onRightClick: onRightClick,
        beforeDrag: beforeDrag,
        beforeDrop: beforeDrop,
        onDrop:saveTreeNodes,
        onRename:saveTreeNodes,
        onClick: zTreeOnClick,
        onCollapse:saveTreeNodes,
        onExpand:saveTreeNodes 
    }
};

// var zNodes = [
//     { id: 1, pId: 0, name: "节点 1", open: true },
//     { id: 11, pId: 1, name: "节点 1-1" },
//     { id: 12, pId: 1, name: "节点 1-2", open: true }
// ];

function beforeDrag(treeId, treeNodes) {
    for (var i = 0, l = treeNodes.length; i < l; i++) {
        if (treeNodes[i].drag === false) {
            return false;
        }
    }
    return true;
}

function beforeDrop(treeId, treeNodes, targetNode, moveType) {
    return targetNode ? targetNode.drop !== false : true;
}
function zTreeOnClick(event, treeId, treeNode) {
    var hash1=treeNode.hash;
    $.post(Hostapi,{'act':'gettextdata','hash':hash1},function(data){
        contenthash=hash1;
        editor.getDoc().setValue(decodeDES(data.toJson().content,encodeDES(hash1,userhash)));
        editor.refresh();
        // $(".autoarea").val(decodeDES(data.toJson().content,encodeDES(hash1,userhash)));
        // $(".autoarea").attr("hash",hash1);
        // $(".autoarea").autoHeightTextarea({
        //     minRows: ($(window).height()-30)/parseInt($(".autoarea").css('line-height'))
        // });
        //$(".autoarea").focus();
        // resetsidebar();
        layer.msg('读取成功', {icon: 1,time:618});
    });
};

function menulayer(type='node'){
    layer.close(lay);
    var y = event.clientX;
    var x = event.clientY;
    var content='<ul>';
    if(type=='root'){
        content += '<li id="m_add" onclick="addTreeNode(\'root\')"><i class="fa fa-file-text-o"></i><font>新建</font></li>';
    }
    if(type=='node'){
        content += '<li id="m_add" onclick="addTreeNode()"><i class="fa fa-file-text-o"></i><font>新建</font></li>';
    }
    if(type=='node'){
        // content += '<li id="m_adddate" onclick="addTreeNode(\'date\')"><i class="fa fa-file-o"></i><font>新建Date</font></li>';
        content += '<li id="m_rename" onclick="renameTreeNode()"><i class="fa fa-pencil"></i><font>重命名</font></li>';
        // content += '<li id="" onclick=""><i class="fa fa-floppy-o"></i><font>导出</font></li>';
        // content += '<li id="" onclick=""><i class="fa fa-share-alt"></i><font>分享</font></li>';
        // content += '<li id="" onclick=""><i class="fa fa-lock"></i><font>加密</font></li>';
        // content += '<li id="" onclick=""><i class="fa fa-search"></i><font>搜索</font></li>';
        // content += '<li id="" onclick=""><i class="fa fa-info-circle"></i><font>属性</font></li>';
        content += '<li id="m_del" onclick="removeTreeNode()"><i class="fa fa-trash-o"></i><font>删除</font></li>';
    }
    content += '</ul>';
    lay = layer.open({
      type: 1,
      shade: 0,
      title: false,
      anim: 5,
      // isOutAnim: false,
      // shadeClose:1,
      offset: [x + "px", y + "px"],
      closeBtn: 0, //不显示关闭按钮
      skin: 'box-shadow', //加上边框
      area: ['102px', 'auto'], //宽高
      content: content
    });

    $(".layui-layer").on("contextmenu", function(){
        return false;
    })

}


function onRightClick(event, treeId, treeNode) {
    // if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
    //         // zTree.cancelSelectedNode();
    //         // // showRMenu("root", event.clientX, event.clientY);
    //         // menulayer('root');
    // } else if (treeNode && !treeNode.noR) {
    //     zTree.selectNode(treeNode);
    //     // showRMenu("node", event.clientX, event.clientY);
    //     menulayer();
    // }
    if (treeNode) {
        zTree.selectNode(treeNode);
        menulayer();
    }
}

function hash() {
    var rand = new Date().getTime().toString()+randomNum(1000,9999).toString();
    return hex_md5(rand);
}
function getdatename() {
    return new Date().format("yyyy-MM-dd hhmmss");
}

function addTreeNode(type='') {
    // hideRMenu();
    layer.close(lay);
    //var name="新建文档";
    var name=getdatename();
    // if(type=='date'){
    //     name=getdatename();
    // }
    var newNode = { name: name ,id:getMaxNodesId(),hash:hash()};
    if (type=='root') {
        zTree.addNodes(null, newNode);
    } else if(zTree.getSelectedNodes()[0]){
        //newNode.checked = zTree.getSelectedNodes()[0].checked;
        zTree.addNodes(zTree.getSelectedNodes()[0], newNode);
    }
    saveTreeNodes();
    zTree.editName(zTree.getNodeByParam("id", newNode.id, null));
    //Toast('新建成功',200);
    //layer.msg('新建成功', {icon: 1,time:618});
}


function removeTreeNode() {
    // hideRMenu();
    layer.close(lay);
    var nodes = zTree.getSelectedNodes();
    if (nodes && nodes.length > 0) {
        var word='确认删除';
        if (nodes[0].children && nodes[0].children.length > 0) {
            word='此节点的子节点会被删除';
        }
        layer.confirm(word, {
              btn: ['确认','取消'],icon: 0,offset: '250px',title: '提示'
            }, function(){
                var nodes = zTree.getSelectedNodes();
                zTree.removeNode(nodes[0]);
                deltext(nodes[0]);
                saveTreeNodes();
            });
    }



    
}

function deltext(nodes){
    var hasharr=[];
    var hash1 = $(".autoarea").attr("hash");
    var nodes_arr = zTree.transformToArray(nodes);
    $(nodes_arr).each(function(index,node){    
        hasharr.push(node.hash);
        if (typeof(hash1) != "undefined"){
            if(hash1==node.hash){
                $(".autoarea").removeAttr("hash");
            }
        }
    });
    deltexthasharr("'"+hasharr.join("','")+"'");
}

function deltexthasharr(hasharr){
    $.post(Hostapi,{'act':'deltextdata','hasharr':hasharr},function(data){
        layer.msg('已删除', {icon: 1,time:618});
    });
}

function renameTreeNode() {
    //hideRMenu();
    layer.close(lay);
    var nodes = zTree.getSelectedNodes();
    if (nodes && nodes.length > 0) {
        zTree.editName(nodes[0]);
    }
}

function saveTreeNodes(){
    $.post(Hostapi,{'act':'setnodedata','hash':nodehash+encodeDES(getSimpleNodes(),encodeDES(nodehash,userhash))},function(data){      
    });
}
function getSimpleNodes() {
    var zTree = $.fn.zTree.getZTreeObj("tree");
    var nodes = zTree.getNodes();
    var nodesSimple= zTree.transformToArray(nodes);  
    var arr=[];
    $(nodesSimple).each(function(index,node){
        var tmp_arr={};
        //console.log(node);
        tmp_arr.id=node.id;  
        tmp_arr.pId=isNull(node.pId)?0:node.pId;  
        tmp_arr.name=node.name;  
        tmp_arr.open=node.open;    
        tmp_arr.hash=node.hash;    
        arr.push(tmp_arr);
    }); 
    return arr.toJson();
}
function getMaxNodesId() {
    var zTree = $.fn.zTree.getZTreeObj("tree");
    var nodes = zTree.getNodes();
    if(typeof(nodes) == 'undefined'){return 1;}
    if(nodes.length==0){return 1;}
    var nodesSimple = zTree.transformToArray(nodes);  
    var max=0;
    $(nodesSimple).each(function(index,node){
        if( max<node.id){
            max=node.id;
        }
    }); 
    return max+1;
}
// var zTree, rMenu,lay;
// var zTree,lay;
// $(document).ready(function() {
//     $.post("./api/v1/index.php",{'act':'getnodedata'},function(data){
//         var zNodes=data.toJson().treenode.toJson();
//         //var zNodes=eval(data);
//         $.fn.zTree.init($("#tree"), setting, zNodes);
//         zTree = $.fn.zTree.getZTreeObj("tree");
//         //rMenu = $("#rMenu"); 
//     });

// });
var editor,contenthash;
var zTree,lay;
var userhash,nodehash;
var Hostapi='../api/index';
function treemain(){
    $.post(Hostapi,{'act':'getnodedata'},function(data){
        var rs=data.toJson();
        nodehash=rs.hash.substr(0,32);
        if(rs.state){
            var zNodes=decodeDES(rs.hash.substr(32),encodeDES(nodehash,userhash)).toJson();
        }else{
            var zNodes='[]'.toJson();
        }
        $.fn.zTree.init($("#tree"), setting, zNodes);
        zTree = $.fn.zTree.getZTreeObj("tree");
        // log(userhash);
    });

}
