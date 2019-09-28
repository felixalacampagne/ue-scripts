//Peter Gabriel - Secret World Live {1994} CD1.cue
//Peter Gabriel - Secret World Live {1994} CD2.cue
//Pink Floyd - The Wall (rm2011) [1979] CD1.cue
//Neil Young - Storytone (2014) CD1.cue

//REM GENRE "Rock"
//REM DATE 1994
//PERFORMER "Peter Gabriel"
//TITLE "Secret World Live CD2"
//REM COMPOSER "Peter Gabriel"

// TRACK 01 AUDIO
var pat = "TRACK\\s+(\\d{2,})\\s+AUDIO";

var counter;
var seltxt;
var donext;

function log(msg)
{
   UltraEdit.outputWindow.write(msg);
}

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

function getfilename()
{
var fullpath = UltraEdit.activeDocument.path;
var idx;
idx = Math.max(fullpath.lastIndexOf("\\"), fullpath.lastIndexOf("/"));
var file = fullpath.substr(idx+1);
return file;
}
var artist="";
var album="";
var release="";
var disknum="";
var cuefilename=getfilename();


fnpat = "^(.*) +- +(.*) +[{(\\[](\\d{4,4})[)}\\]](?: (CD\\d))?\\..*$";
var fnrgx = new RegExp(fnpat);
matches = fnrgx.exec(cuefilename);
if(matches)
{
  artist = matches[1];
  album = matches[2];
  release = matches[3];
  if(matches[4] != null)
    disknum = " " + matches[4];
}

var newtags=""
var newtagsoff=1;
UltraEdit.activeDocument.findReplace.selectText = false;
UltraEdit.perlReOn = true;
UltraEdit.activeDocument.findReplace.regExp = true;

UltraEdit.activeDocument.gotoLine(1,1);
UltraEdit.activeDocument.findReplace.find("^REM GENRE ");
if (! UltraEdit.activeDocument.isSel() )
{
  newtags += "REM GENRE \"\"\n";
}
else
{
  newtagsoff = UltraEdit.activeDocument.currentLineNum + 1;
}
UltraEdit.activeDocument.gotoLine(1,1);
UltraEdit.activeDocument.findReplace.find("^REM DATE ");
if (! UltraEdit.activeDocument.isSel() )
{
   newtags += "REM DATE \"" + release + "\"\n";
}
else
{
  newtagsoff = UltraEdit.activeDocument.currentLineNum + 1;
}

//PERFORMER "Peter Gabriel"
UltraEdit.activeDocument.gotoLine(1,1);
UltraEdit.activeDocument.findReplace.find("^PERFORMER ");
if (! UltraEdit.activeDocument.isSel() )
{
   newtags += "PERFORMER \"" + artist + "\"\n";
}
else
{
  newtagsoff = UltraEdit.activeDocument.currentLineNum + 1;
}

//TITLE "Secret World Live CD2"
UltraEdit.activeDocument.gotoLine(1,1);
UltraEdit.activeDocument.findReplace.find("^TITLE ");
if (! UltraEdit.activeDocument.isSel() )
{
   newtags += "TITLE \"" + album + disknum + "\"\n";
}
else
{
  newtagsoff = UltraEdit.activeDocument.currentLineNum + 1;
}

//REM COMPOSER "Peter Gabriel"
UltraEdit.activeDocument.gotoLine(1,1);
UltraEdit.activeDocument.findReplace.find("^REM COMPOSER ");
if (! UltraEdit.activeDocument.isSel() )
{
   newtags += "REM COMPOSER \"" + artist + "\"\n";
}
else
{
  newtagsoff = UltraEdit.activeDocument.currentLineNum + 1;
}

UltraEdit.activeDocument.gotoLine(newtagsoff,1);
UltraEdit.activeDocument.write(newtags);



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
      if (UltraEdit.activeDocument.isFound() && UltraEdit.activeDocument.isSel() )
      {
         counter++;
         seltxt = UltraEdit.activeDocument.selection;
         matches = regex.exec(seltxt);
         g1 = matches[1];
         var padded = pad(counter, 2);
         log("Replacing " + g1 + " with " + padded + " in " + seltxt);

         seltxt = seltxt.replace(g1, padded);

         // This overwrites the text selected by the .find() ??
         UltraEdit.activeDocument.write(seltxt);
         //UltraEdit.activeDocument.gotoPosSelect(UltraEdit.activeDocument.currentPos + 10);
         donext = true;
      }
   }while(donext);
   UltraEdit.activeDocument.gotoPos(1);
}
else
{
   log("Pattern failed to select anything: " + pat);
}
