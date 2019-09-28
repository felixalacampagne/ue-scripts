// <id>1473694568061</id>
var pat = "(.*?)(\\d{1,})(.*?)";

var counter;
var seltxt;
var donext;

function log(msg)
{
   UltraEdit.outputWindow.write(msg);
}

var regex = new RegExp(pat);
var g1 = "";
var matches;
// First occurrence gives the start offset, obtained from the first group
// No way to get at the group from UE so need to read the selected text
// then use JS regex to extract the group.
UltraEdit.activeDocument.gotoLine(1,1);
UltraEdit.activeDocument.findReplace.selectText = false;
UltraEdit.perlReOn = true;
UltraEdit.activeDocument.findReplace.regExp = true;
UltraEdit.activeDocument.findReplace.find(pat);
if (UltraEdit.activeDocument.isSel() )
{
   seltxt = UltraEdit.activeDocument.selection;
   log("Inital selected text: " + seltxt);
   
   matches = regex.exec(seltxt);
   counter = matches[2];
   log("Initial counter: " + counter);

   var numtxt = "";
   for(i=0; i<100;i++)
   {
      numtxt = numtxt + matches[1] + counter + matches[3] + "\n";
      counter++;
   }
   UltraEdit.activeDocument.selectAll ;
   UltraEdit.activeDocument.deleteText;
   UltraEdit.activeDocument.write(numtxt);
}
else
{
   log("Pattern failed to select anything: " + pat);
}
