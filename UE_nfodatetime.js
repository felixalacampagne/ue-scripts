function pad(val, ln)
{
	var s = "" + val;  // Must ensure this is a string!
	
	if(s.length < ln)
	{
	  var pad = new Array(1 + ln).join("0");
	  s = (pad + s).slice(-ln);
	}
	
	return s;
}

var rightnow = new Date(); //Date.now();

var ts = rightnow.getYear()+1900 + "-" 
       + pad(rightnow.getMonth()+1, 2) + "-" 
       + pad(rightnow.getDate(), 2) + " "
       + pad(rightnow.getHours(), 2) + ":"
       + pad(rightnow.getMinutes(),2) + ":"
       + pad(rightnow.getSeconds(), 2) ;

//UltraEdit.outputWindow.write(ts);
UltraEdit.activeDocument.write(ts);
