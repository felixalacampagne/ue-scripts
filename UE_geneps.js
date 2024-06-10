// Script: UE_geneps.js
// Format of clipboard must be:
// Film DxDD Title of film[.cc][.ext]
// eg. Film 1x90 Star Wars: The Phantom Menace
//     Film 1x90 Star Wars: The Phantom Menace.be
//     Film 1x90 Star Wars: The Phantom Menace.en.m4v
//     Film 1x90 Star Wars: The Phantom Menace.m4v


var debug=false;  // Set to true to run in test mode

function log(msg)
{
   UltraEdit.outputWindow.write(msg);
}

function genep(clip)
{
//var pat = /(.* \dx(\d{1,2}) +(.*?))(\..+)*/
// Above form didn't work, for some reaon filename only has upto the id, the title group is empty and the extension group is undefined
// yet the pattern is a match. 
// Aaahhhaaa: it works as expected when '$' is added at the end
//var pat = /(.* \dx(\d{1,2}) +(.*?))(\..+)*$/
var pat = /(.* \d{1,2}x(\d{2,4})(?: +(.*?)){0,1})(\..+)*$/

// This also works, but the above seems more reasonable...
//var pat = /(.* \dx(\d{1,2}) +([^.]*))(\..+)*/

var result = clip.match(pat);
if(result == null)
{
   UltraEdit.outputWindow.write("Clipboard does not have required format 'Programe Name SxEE Episode Name'; " + clip);
}
else
{
   var filename = result[1]
   var id = result[2];
   var ep = result[3];
   var ext= result[4];
   var episode = "Episode " + id;
   // Checking result length does not work as an entry for the title group exists
   // when the title part is missing but the match was successful. Checking it for
   // null seems to work though.
   if(ep != null)
   {
      episode = ep;
   }
   var eprec;
   eprec = "<episode>" + 
              "<id>" + id + "</id>" +
              "<filename>" + filename + "</filename>" + 
              "<name>" + episode + "</name>" + 
              "<description></description>" + 
           "</episode>\n";
   if(debug)
   {
      eprec += "   " + ext;
   }
   return eprec;
}
}

function test()
{
var ep;
var name;
   name = "Film 1x44 I Give It a Year.be.m4v";
   ep = genep(name);
   log("Name: " + name + " Ep: " + ep);

   name = "Film 1x44   I Give It a Year.be";
   ep = genep(name);
   log("Name: " + name + " Ep: " + ep);

   name = "Film 1x44 I Give It a Year.m4v";
   ep = genep(name);
   log("Name: " + name + " Ep: " + ep);

   name = "Film 1x44 I Give It a Year";
   ep = genep(name);
   log("Name: " + name + " Ep: " + ep);

// These formats are not supported (they don't make much sense)
//   name = "Film 1x44.be.m4v";
//   ep = genep(name);
//   log("Name: " + name + " Ep: " + ep);
//
//   name = "Film 1x44.m4v";
//   ep = genep(name);
//   log("Name: " + name + " Ep: " + ep);
//
//   name = "Film 1x44";
//   ep = genep(name);
//   log("Name: " + name + " Ep: " + ep);

}

// NB. No goto in Javascript, and no exit and return only in a function.
if(debug)
{
   test();
}
else
{
   var content = UltraEdit.clipboardContent;
   var eprec = genep(content);
   UltraEdit.activeDocument.write(eprec);
}
