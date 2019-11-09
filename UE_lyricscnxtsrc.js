
// Find the NEXT lyric and
// copy the search query to the clipboard.
// 
var debug=false;  // Set to true to run in test mode

function log(msg)
{
   UltraEdit.outputWindow.write(msg);
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


var doc = UltraEdit.activeDocument;
doc.findReplace.regExp = false;
doc.findReplace.searchDown = true;
doc.findReplace.selectText = false;

doc.findReplace.find("<lyric>");
//doc.cancelSelect(); 
doc.gotoLine(doc.currentLineNum +1, 1);
getlyricssearchstr( UltraEdit.activeDocument );