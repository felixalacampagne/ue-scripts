// WARNING. This should only be run after removing
// cases where the Title (or some other field!) is merged into the first line of the lyric
var debug=false;  // Set to true to run in test mode

function log(msg)
{
   UltraEdit.outputWindow.write(msg);
}

function clean(doc)
{
// These are Perl regexps used by the UE search engine and are not compatible
// with the Javascript RegExp object, so the /regex/ syntax can'tbe used.
var repat;
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

var repata = [
   "(?s)Music by:.*?(?=[<]\\/)",
   "(?s)Written by:.*?(?=[<]\\/)",
   "(?s)External links.*?(?=[<]\\/)",
   "(?s)Credits.*?(?=[<]\\/)",
   "(?s)^ID: .*?(?=[<]\\/)",
   "^ ++(?=[^<])", // ++ is to avoid matching all space upto the first space before a tag
   "eng\\|\\|",
   "^Artist *:.*$",
   "^Title *:.*$",
   "^Album *:.*$",
   "^Length *:.*$",
   "^encoding:.*$",
   "[\\[(].*[Cc]horus.*[\\])][\\r\\n][\\r\\n]*",
   "\\[Verse.*\\][\\r\\n][\\r\\n]*",
   "\\[x\\d+\\]",
   "\\[.*?\\]",
   "[\\x01-\\x08\\x0E-\\x19]"  \\ remove any remaining control codes - keep CRLF and tab!
   ];
// Written by: - <\lyric
// 
// External links: <\lyric

// Split the title merged to first lyric line so it can be deleted by the
// normal Title match
   doc.gotoLine(1,1);
   doc.findReplace.replace("(Title *:.*[a-z!?])([A-Z])", "\\1\\n\\2");
   doc.findReplace.replace("\\bi([ ,';:.]|\\b)", "I\\1");
   doc.findReplace.replace("&#8217;", "'");
   doc.findReplace.replace("&#8216;", "'");
   doc.findReplace.replace(" \\.mp3", ".mp3");
   doc.findReplace.replace("  *\\.flac", ".flac");
   doc.findReplace.replace("\\x19", "'");
   doc.findReplace.replace(" \\x13", ","); // seems to be a hyphen, but I prefer to use commas
   

var i=0;
for(i=0; i<repata.length;i++)
{
   doc.gotoLine(1,1);
   doc.findReplace.replace(repata[i], "");
}

doc.gotoLine(actline,actcol);
}

clean( UltraEdit.activeDocument );
