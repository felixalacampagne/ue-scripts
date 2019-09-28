// UltraEdit script to extract the episode numbers/names from a TV.com listing.
// Wouldn't have bothered if only it was possible to select and copy the episode title
// from the list page but unfortunately the episode title is a link which always loads 
// a new page and all the ads take forever to display.
//
// Seems that getting the source with the correct season in it can be a bit tricky. The
// most reliable way is to right click the season selection list on left and open in new tab.
// If the tab title contains the season number then "View source..." should give the desired 
// details.
//
// TODO This could eventually be used as metadata input to iTunesAddNew, probably 
// as a per folder episodes list equivalent to the artwork file.
//
// TODO normalize the XML.
// So I can simply append season details to existing details I decided not to bother
// using real XML for now. The XML for a season looks like the following;
//  <season>
//      <id>N</id>
//      <show>X Xxxx Xxxx</show>
//      <episode><id>N</id><filename>xxxxx</filename><name>Yyy yyy</name><description>Zzz zzz zzz zzz zz z z z z z</description></episode>
//      <episode><id>N+1</id><filename>xxxxx</filename><name>Yyy yyy</name><description>Zzz zzz zzz zzz zz z z z z z</description></episode>
//  </season>
// which should be easy enough to parse using regex's and is still easy enough to read.

// TODO HTML decode, XML encode description.

var shwregex = /<title>(.*?) - Season (\d+) - TV.com<\/title>/

// Episode number and title regex
var epregex=/<a class=\"title\".*?>(.*?)<\/a>[^]*?<div class=\"ep_info\">[^]*?Episode (\d+)/;
var descregex=/<div class=\"description\">([^]*?)<\/div>/

// This is to use if title contains "Episode Guide" instead of "Season N", in whch case only the latest season will be extracted
var altshwregex = /<title>(.*?) - Episode Guide - TV.com<\/title>/
var seasregex=/<a class=\"season_name toggle\"[^]*?Season (\d*)/

function makeFSSafe(filename)
{
var safe;
   // \?\/\$&@:\*\"<>\|\'\`
   safe = filename.replace(/[?$\\\/:@&<>'"`]/g, "");
   safe = safe.replace(/[\._,]/g, " ");
   return safe;
}


UltraEdit.activeDocument.findReplace.selectText = false;
UltraEdit.perlReOn = true;
UltraEdit.activeDocument.findReplace.regExp = true;
UltraEdit.activeDocument.findReplace.replaceAll = false;
UltraEdit.activeDocument.findReplace.preserveCase = true;

UltraEdit.activeDocument.gotoLine(1,1);
UltraEdit.activeDocument.selectAll(); 
var content = UltraEdit.activeDocument.selection;
var idxstart = 0;
var matcharr;
var showname="Unknown";
var seasonnum="0";


var episodes_long=new Array();
matcharr = content.match(shwregex);
if(matcharr != null)
{
   showname = matcharr[1];
   seasonnum = matcharr[2];
}
else
{
   // Check for default "Episode Guide" page
   matcharr = content.match(altshwregex);
   if(matcharr != null)
   {
      showname = matcharr[1];
      // If that works then the season number should be givenby seasregex
      matcharr = content.match(seasregex);
      if(matcharr != null)
      {
         seasonnum = matcharr[1];
      }         
   }
   else
   {
      showname = "Unknown Page Format";
   }
}

while((matcharr = content.substr(idxstart).match(epregex)) != null)
{
   //UltraEdit.outputWindow.write("regex matched something!");
   //UltraEdit.outputWindow.write("matcharr length = " + matcharr.length);
   //UltraEdit.outputWindow.write("Matched at: " + matcharr.index);
   //UltraEdit.outputWindow.write("Episode " + matcharr[2] + " " + matcharr[1]);
   var epnum = matcharr[2];
   var padep = ("00" + epnum).substr(-2);
   var epname = matcharr[1];
   var title = makeFSSafe(showname + " " + seasonnum + "x" + padep + " " + epname);
   var xmldesc;
   xmldesc = "<episode>";
      
   // Using padep so sorting works, could change to sue custom comparatory if it creates problems when used
   xmldesc += "<id>" + padep + "</id>"; 
   xmldesc += "<filename>" + title + "</filename>";
   xmldesc += "<name>" + epname + "</name>";

   idxstart += matcharr.index + 1;
   
   matcharr = content.substr(idxstart).match(descregex);
   if(matcharr != null)
   {
      var desc = matcharr[1];
      // Remove any HTML formatting from the description
      // TODO expand HTML entities
      // TODO XML encode any reserved XML characters
      // TODO remove this "<span class="_more">more</span><span class="_less">less</span>"
      desc = desc.replace(/<span class="_more.*<\/span>/,"");
      desc = desc.replace(/<.*?>/g,"");
      desc = desc.replace(/[\n\r]/g,"");
      desc = desc.replace("&nbsp;"," ");
      
      
      xmldesc += "<description>" + desc + "</description>";
   }
   else
   {
      // Easier to parse if there is an empty value, and this is easier to parse than a single null tag
      xmldesc += "<description></description>";
   }
   xmldesc += "</episode>";
   episodes_long.push(xmldesc);
}

episodes_long.sort();
var idx;
var toclip="";

toclip += "<season>\n";
toclip += "<id>" + seasonnum + "</id>\n";
toclip += "<show>" + showname + "</show>\n";

//for(idx=0; idx<episodes.length; idx++)
//{
//   UltraEdit.outputWindow.write(episodes[idx]);
//   toclip += "<filename>" + episodes[idx] + "</filename>\n";
//}


// The long data could be added to a single file containing all the episodes/descriptions
// or to an episodes file in each folder.
// iTunesAddNew could then get all info from the file instead of rely on the filename, the
// filename would only need to contain the season and episode number if file is per folder 
// as the show name would come from the episode file. Show name will be needed in the filename
// if a single file is used for all episodes.

for(idx=0; idx<episodes_long.length; idx++)
{
   UltraEdit.outputWindow.write(episodes_long[idx]);
   toclip += episodes_long[idx];
   toclip += "\n";
}   
toclip+="</season>\n";
UltraEdit.clipboardContent = toclip;   
   
   