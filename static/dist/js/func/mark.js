var mkr1,mkr,mkd1,mkd;
function marketr(arg){
    mkr1=arg;
    arg=arg.replaceAll('<sg>','&#124;');
    mkr=arg;
    return arg;
}
function markend(arg){
    mkd1=arg;
    arg=arg.replaceAll('&lt;br&gt;','<br>');
    arg=arg.replaceAll('&lt;','<');
    arg=arg.replaceAll('&gt;','>');
    arg=arg.replaceAll('&quot;','"');
    arg=arg.replaceAll('&#39;',"'");
    mkd=arg;
    return arg;
}