// WARNING. This should only be run after removing
// cases where the Title (or some other field!) is merged into the first line of the lyric
var debug=false;  // Set to true to run in test mode

function log(msg)
{
   UltraEdit.outputWindow.write(msg);
}

function getlyricssearchstr(doc)
{
// These are Perl regexps used by the UE search engine and are not compatible
// with the Javascript RegExp object, so the /regex/ syntax can'tbe used.
var repat;
UltraEdit.perlReOn = true;
doc.findReplace.selectText = true;

doc.findReplace.regExp = true;
doc.findReplace.replaceAll = true;
doc.findReplace.mode = 0;
doc.findReplace.preserveCase = true;
doc.findReplace.matchCase = true;

// No equivalent to the "replace all is from the top" and the goto top must
// be done before every replace
var actline = doc.currentLineNum;
var actcol = doc.currentColumnNum;
var trackname;
var artist;
var matcharr;
var seltxt;
// Reverse find <filemetadata>
doc.findReplace.searchDown = false;
doc.findReplace.find("<filemetadata>");

// Find <name>01 Gonna Send You Back.flac</name>
doc.findReplace.searchDown = true;
var nameregex = "<name>\\d{2,2} (.*)\\.(flac|mp3)</name>"
doc.findReplace.find(nameregex);
seltxt = doc.selection
matcharr = seltxt.match(nameregex);
if(matcharr != null)
{
   trackname = matcharr[1];
   log("Found trackname: " + trackname);
}
else
{
   log("Track name not found");
   return;
}


// Find <artist>Van Morrison</artist>
var artistregex = "<artist>(.*)</artist>";
doc.findReplace.find(artistregex);
seltxt = doc.selection;
matcharr = seltxt.match(artistregex);
if(matcharr != null)
{
   artist = matcharr[1];
   log("Found artist: " + artist);
}
else
{
   log("Artist not found");
   return;
}


// copy artist name lyrics to clipboard
var searchstr = artist + " " + trackname + " lyrics";
//searchstr = searchstr.replace(/ /gi, "+");
//searchstr = searchstr.replace(/&amp;/gi, "%26");
//searchstr = "www.google.be/search?q=" + searchstr + "&lr=lang_en";
// http://www.google.be/search?q=Artist+-+Album+lyrics&safe=active&lr=lang_en
UltraEdit.clipboardContent = searchstr;
log("Search string copied to clipboard: " + searchstr);
doc.gotoLine(actline,actcol);
}

getlyricssearchstr( UltraEdit.activeDocument );
