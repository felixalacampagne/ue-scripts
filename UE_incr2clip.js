// <id>1473694568061</id>
var pat = "(.*?)(\\d{1,})(.*)";

var counter;
var seltxt;
var cwidth;

function log(msg)
{
   UltraEdit.outputWindow.write(msg);
}

var regex = new RegExp(pat);
var g1 = "";
var matches;

UltraEdit.activeDocument.selectLine();

   seltxt = UltraEdit.activeDocument.selection;
   log("Inital selected text: " + seltxt);
   
   matches = regex.exec(seltxt);
   if(matches)
   {
   counter = matches[2];
   cwidth = counter.length;
   
   log("counter: " + counter + ", left: " + matches[1] + ", right: " + matches[3]);

   var numtxt = "";
   counter++;
   numtxt = "" + counter;
   
   // Pad the result. Goign to assume that if the incremented number as a string is shorter than the original
   // number string then it must be zero padded (can't be space padded as only numbers are allowed in the
   // second match group.
   if(numtxt.length < cwidth)
   {
      // Fancy trick to generate a string of "0"s x characters long
      var pad = new Array(cwidth+1).join("0");
      numtxt = (pad + numtxt).substr(-cwidth);
   }
   
   
   numtxt = matches[1] + numtxt + matches[3];

   UltraEdit.activeDocument.selectLine();
   //UltraEdit.activeDocument.deleteText();
   UltraEdit.activeDocument.write(numtxt);
   UltraEdit.clipboardContent = "" + numtxt;
   }
   else
   {
      log("Could not find a numeric part to increment")
   }