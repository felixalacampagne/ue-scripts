

//20501231-

var inc = Number(1);
var maxidx = Number(8200);
var outpath = "C:\\Program Files\\SWIFT\\Alliance Lite\\files\\tempH\\";

var idx = Number(2011);
var pfxpat = "//";
var numpat = "\\d\\d\\d\\d";
var sfxpat = "1";
var numoff;
var numlen;
var fulpat;
var incstr;



// Useful for debugging
UltraEdit.outputWindow.showWindow(true);

UltraEdit.perlReOn = true;

UltraEdit.activeDocument.findReplace.selectText = true;
UltraEdit.activeDocument.findReplace.regExp = true;

UltraEdit.activeDocument.gotoLine(1,1);

	numoff = pfxpat.length;
	numlen = numpat.length / 2;
	fulpat = pfxpat + numpat + sfxpat;
	UltraEdit.activeDocument.findReplace.find(fulpat);
	if (UltraEdit.activeDocument.isSel() )
	{
		idx = Number(UltraEdit.activeDocument.selection.substr(numoff, numlen).valueOf());
		UltraEdit.outputWindow.write("Starting increment value: " + idx);
	}

do
{
	idx = idx + inc;
	UltraEdit.outputWindow.write("Incremented value: " + idx + " Number offset: " + numoff + "  Number length: " + numlen);
	UltraEdit.activeDocument.gotoLine(1,1);
	do
	{
		UltraEdit.activeDocument.findReplace.find(fulpat);
		if (UltraEdit.activeDocument.isSel() )
		{
			incstr = "0000000000000000000000000000" + idx;
			incstr = pfxpat + incstr.substr(numlen * -1) + sfxpat;
			UltraEdit.outputWindow.write("Writing increment value: " + incstr);
			UltraEdit.activeDocument.write(incstr);
	
		}	
		
	}while(UltraEdit.activeDocument.isFound());
	
	UltraEdit.saveAs(outpath + "MT542_" + idx + ".fin");
}while(idx < maxidx);