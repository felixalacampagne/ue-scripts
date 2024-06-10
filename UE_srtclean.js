

// WARNING. This should only be run after removing
// cases where the Title (or some other field!) is merged into the first
line of the lyric
var debug=false;  // Set to true to run in test mode

function log(msg)
{
   UltraEdit.outputWindow.write(msg);
}

function clean(doc)
{
// These are Perl regexps used by the UE search engine and are not
compatible
// with the Javascript RegExp object, so the /regex/ syntax can'tbe used.
var repat;

doc.unicodeToASCII();

UltraEdit.perlReOn = true;
doc.findReplace.selectText = false;

doc.findReplace.regExp = true;
doc.findReplace.replaceAll = true;
doc.findReplace.mode = 0;
doc.findReplace.preserveCase = true;
doc.findReplace.matchCase = true;

// No equivalent to the "replace all is from the top" and the goto top must
// be done before every replace
var actline = doc.currentLineNum;
var actcol = doc.currentColumnNum;
//    "(?s)Written by:.*?(?=[<]\\/)",
//   "[\\x01-\\x08\\x0E-\\x19]"  // remove any remaining control codes -
keep CRLF and tab!

var repata = [
   "?.*(?)*",
   "(?s)\\[ .*? \\]"
   ];

var i=0;
for(i=0; i<repata.length;i++)
{
   doc.gotoLine(1,1);
   doc.findReplace.replace(repata[i], " ");
}


doc.gotoLine(1,1);
doc.findReplace.replace("(\\d)\\n^ (\\n[A-Za-z])", "\\1\\2");
   
doc.gotoLine(actline,actcol);
}

clean( UltraEdit.activeDocument );

