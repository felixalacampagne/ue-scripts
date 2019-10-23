// ue_scripts\UE_lyricscbrepl.js
// WARNING. This should only be run after removing
// cases where the Title (or some other field!) is merged into the first line of the lyric

// Write the clipboard content into the current lyric, move to the next lyric and
// copy the next search query to the clipboard.
// 
var debug=false;  // Set to true to run in test mode

function log(msg)
{
   UltraEdit.outputWindow.write(msg);
}

function selcurlyric(doc)
{
// These are Perl regexps used by the UE search engine and are not compatible
// with the Javascript RegExp object, so the /regex/ syntax can'tbe used.
var repat;
UltraEdit.perlReOn = true;

doc.findReplace.regExp = false;
doc.findReplace.replaceAll = false;
doc.findReplace.mode = 0;
doc.findReplace.preserveCase = true;
doc.findReplace.matchCase = true;

// No equivalent to the "replace all is from the top" and the goto top must
// be done before every replace
var actline = doc.currentLineNum;
var actcol = doc.currentColumnNum;

// Reverse find <filemetadata>
doc.findReplace.searchDown = false;
doc.findReplace.selectText = false;

doc.findReplace.find("<lyric>");
if(!doc.isSel())
{
   return;
}
// GGGrrrr! No way to easily move to the end of the selection
var sel=doc.selection;
doc.cancelSelect();   // Cursor is at start of found text, need it to be at the end
doc.gotoPos(doc.currentPos + sel.length);


//// Forking ridiculous, can gotoendofnext word but no gotoNextWord
////doc.gotoEndOfNextWord();
//doc.findReplace.searchDown = true;
//doc.findReplace.regExp = true;
//doc.findReplace.find("\\w");
//doc.cancelSelect();
// Screwit, easier jsut to prefix the lyric with a linebreak, extra ones are stripped out by
// the import process anyway.
var lyrstart=doc.currentPos;

doc.findReplace.regExp = false;
doc.findReplace.searchDown = true;
doc.findReplace.find("</lyric>");
if(!doc.isSel())
{
   return;
}
doc.cancelSelect();
doc.gotoPosSelect(lyrstart);
}

function pasteLyricFromClip(doc)
{
var lyric = UltraEdit.clipboardContent;

var re = new RegExp("\\n\\n\\n+", "mg");
lyric = lyric.replace(/^\t\t*/gm, "");
lyric = lyric.replace(/^  */gm, "");
lyric = lyric.replace(/\r/gm, "");
lyric = lyric.replace(/\x19/gm, "'"); // ascii 19 - 
lyric = lyric.replace(re, "\n\n");
doc.write("\n" + lyric + "\n");
}

// NB This is a copy of UE_lyricsearch.js, since I don't see a way to call 
// a JS from another JS... updates to one should be include in the other...
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
//   searchstr = searchstr.replace(" ", "+");
//   searchstr = "www.google.be/search?q=" + searchstr + "&lr=lang_en";

   UltraEdit.clipboardContent = searchstr;
   log("Search string copied to clipboard: " + searchstr);
   doc.gotoLine(actline,actcol);
}

selcurlyric( UltraEdit.activeDocument );

pasteLyricFromClip(UltraEdit.activeDocument );

var doc = UltraEdit.activeDocument;
doc.findReplace.regExp = false;
doc.findReplace.searchDown = true;
doc.findReplace.selectText = false;

doc.findReplace.find("<lyric>");
//doc.cancelSelect(); 
doc.gotoLine(doc.currentLineNum +1, 1);
getlyricssearchstr( UltraEdit.activeDocument );