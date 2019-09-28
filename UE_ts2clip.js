var date = new Date();
var datestr = "" + ("00" + (date.getMonth()+1)).substr(-2) + ("00" + date.getDate()).substr(-2);
var timestr = "" + ("00" + date.getHours()).substr(-2) + ("00" + date.getMinutes()).substr(-2) + ("00" + date.getSeconds()).substr(-2);

var ts = datestr + timestr;

UltraEdit.clipboardContent = "" + ts;
