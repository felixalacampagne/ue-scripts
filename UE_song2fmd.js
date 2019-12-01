// UE_song2fmd.js

// Takes the multi song lyric clipboard output from an "azlyricgrabber" and applies
// the lyrics to the current "filemetadata" document. Various translations are
// applied to the lyrics to clean them - really the same manipulations used for
// lyricbrepl should be applied.


function log(msg)
{
   UltraEdit.outputWindow.write(msg);
}

function getLyricFromClip()
{
var lyric = UltraEdit.clipboardContent;

var re = new RegExp("\\n\\n\\n+", "mg");
lyric = lyric.replace(/^\t\t*/gm, "");
lyric = lyric.replace(/^  */gm, "");
//lyric = lyric.replace(/\r/gm, "");
lyric = lyric.replace(/\x19/gm, "'"); // ascii 19 -
lyric = lyric.replace(/^.*[Cc]horus.*\n+/gm, "");
lyric = lyric.replace(re, "\n\n");
return lyric
}

function normalise(s)
{
  s.trim();
  s = s.replace(/[/'?& ]/gm, "");
  s = s.toLowerCase();
  return s;
}

var songs = getLyricFromClip();
UltraEdit.activeDocument.selectAll();
var fmd = UltraEdit.activeDocument.selection;

// Grrr can't use '.' to match newlines (the s flag is not supported)
var songre = /<song>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<lyric>([\s\S]*?)<\/lyric>[\s\S]*?<\/song>/g;
//log("Songs from clipboard:\n" + songs);
   	var matches;
   	while(matches = songre.exec(songs))
   	{
   	  var origtitle = matches[1];
      var title = normalise(origtitle);
      var lyric = matches[2];

      // Better chance of matching against the title, which is now present in the flactagger file
      var fmdre = new RegExp(/<title>(.*?)<\/title>/gi);
      var fmdmatches;
      var titidx = -1;
      //log("Searching FDM for " + title);
      while (fmdmatches = fmdre.exec(fmd))
      {
        var fmdtitle = normalise(fmdmatches[1]);
        if(fmdtitle === title)
        {
          titidx = fmdmatches.index;
          //log("Found match in FMD: " + title + " idx: " + titidx);
          break;
        }
      }
      
      // Old way: try to match against the filename
      if(titidx == -1)
      {
         //<name>01 Packt Like Sardines in a Crushd Tin Box.mp3</name>
         fmdre = new RegExp(/<name>\d{2,2} (.*?)\..*?<\/name>/gi);
         while (fmdmatches = fmdre.exec(fmd))
         {
           var fmdtitle = normalise(fmdmatches[1]);
           //if(titidx > -1)
           if(fmdtitle === title)
           {
             titidx = fmdmatches.index;
             //log("Found match in FMD: " + title + " idx: " + titidx);
             break;
           }
         }
      }
      
      
      
      
      if(titidx > -1)
      {
        //log("Found match in FMD: " + title + " idx: " + titidx);

        // find the following <lyric>...</lyric> and replace it with the one from songs
        var lyrst = fmd.indexOf("<lyric>", titidx) + 8; // 8 = length of tag
        var lyren = fmd.indexOf("</lyric>", lyrst);

        s = fmd.substring(0, lyrst) + lyric + fmd.substring(lyren);
        fmd = s;

      }
      else
      {
         // title on newline as UE output window only allow selection of entire line
         // which messes up searching for the title
        log("NO Match:\n" + origtitle);
      }
    }


//log("Updated FMD:\n" + fmd);
    UltraEdit.activeDocument.write(fmd);
    UltraEdit.activeDocument.cancelSelect();
