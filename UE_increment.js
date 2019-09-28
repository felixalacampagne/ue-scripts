var pat = "SEME//\\d\\d\\d\\d\\w*";
var patdate = ":(\\d\\d\\d\\d)\\.";
var pattime = "\\.(\\d\\d\\d\\d)-";
var datestr;

var selpat;
var pfxchr="SEME//";
var padstr = "0000";
var padlen = 4;
var incstr;
var idx;
var docidx;
var mdate = new Date();
var i;

function updateTime(docidx)
{
var timestr = "" + ("00" + mdate.getHours()).substr(-2) + ("00" + mdate.getMinutes()).substr(-2);
	UltraEdit.document[docidx].gotoLine(1,1);
	UltraEdit.document[docidx].findReplace.selectText = true;
	UltraEdit.perlReOn = true;
	UltraEdit.document[docidx].findReplace.regExp = true;
	UltraEdit.document[docidx].findReplace.find(pattime);
	if (UltraEdit.document[docidx].isSel() )
	{
		var reptext = UltraEdit.document[docidx].selection;
		reptext = reptext.replace(new RegExp(pattime), "$1");
		UltraEdit.document[docidx].gotoLine(1,1);
		UltraEdit.document[docidx].findReplace.mode = 0;
		UltraEdit.document[docidx].findReplace.replaceAll = true
		UltraEdit.document[docidx].findReplace.regExp = false;
		UltraEdit.document[docidx].findReplace.selectText = false;
		UltraEdit.outputWindow.write("Replacing " + reptext + " with " + timestr);
		UltraEdit.document[docidx].findReplace.replace(reptext, timestr);
	}
	else
	{
		throw "No time found.";
	}
	
}


if (UltraEdit.activeDocument.isSel() )
{
	selpat = UltraEdit.activeDocument.selection;
	if(!selpat.substr(0,1).match(/\d/))
	{
		pfxchr = selpat.substr(0,1);
		pat = "\\" + pfxchr;
		padlen = 0;
		for(i=1; i<selpat.length;i++)
		{
			pat += "\\d";
			padstr += "0";
			padlen++;
		}
		pat += "\\w*";
	}
}

UltraEdit.outputWindow.showWindow(true);
//try
//{
//	updateTime(UltraEdit.activeDocumentIdx);
//}
//catch(e)
//{
//	UltraEdit.outputWindow.write("Exception: " + e);
//}


UltraEdit.perlReOn = true;
UltraEdit.activeDocument.findReplace.selectText = true;
UltraEdit.activeDocument.findReplace.regExp = true;

UltraEdit.activeDocument.gotoLine(1,1);
UltraEdit.outputWindow.write("Search pattern: " + pat);
idx = 0;
UltraEdit.activeDocument.findReplace.find(pat);
if (UltraEdit.activeDocument.isSel() )
{
	idx = UltraEdit.activeDocument.selection.substr(-padlen);
}

UltraEdit.outputWindow.write("Starting increment value: " + idx);
docidx=0;
UltraEdit.outputWindow.write("Documents to update: " + UltraEdit.document.length);

do 
{
	UltraEdit.outputWindow.write("Updating docidx " + docidx + ": " + UltraEdit.document[docidx].path);
	UltraEdit.document[docidx].gotoLine(1,1);
	UltraEdit.perlReOn = true;
	UltraEdit.document[docidx].findReplace.selectText = true;
	UltraEdit.document[docidx].findReplace.regExp = true;	
	do
	{
		UltraEdit.document[docidx].findReplace.find(pat);
		if (UltraEdit.document[docidx].isSel() )
		{
			incstr = padstr + idx;
			incstr = pfxchr + incstr.substr(-padlen);
			UltraEdit.outputWindow.write("Writing increment value: " + incstr);
			UltraEdit.document[docidx].write(incstr);
			idx++;
		}	
		
	}while(UltraEdit.document[docidx].isFound());
	docidx++;
}while(docidx < UltraEdit.document.length);