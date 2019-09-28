// <id>1473694568061</id>
var pat = "<id>(\\d{1,})</id>";

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
   counter = matches[1];
   log("Initial counter: " + counter);

   // Loop through other matches, incrementing the value by 1
   do
   {
      donext=false;
      UltraEdit.activeDocument.findReplace.find(pat);
      if (UltraEdit.activeDocument.isSel() )
      {
         counter++;
         seltxt = UltraEdit.activeDocument.selection;
         matches = regex.exec(seltxt);
         g1 = matches[1];
         log("Replacing " + g1 + " with " + counter + " in " + seltxt);
   
         UltraEdit.activeDocument.findReplace.replace(g1, "" + counter);
         donext = true;
      }
   }while(donext);
}
else
{
   log("Pattern failed to select anything: " + pat);
}
