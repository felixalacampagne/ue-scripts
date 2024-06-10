
function log(msg)
{
   UltraEdit.outputWindow.write(msg);
}

function pasteLyricFromClip(doc)
{
var lyric = UltraEdit.clipboardContent;

var re = new RegExp("\\n\\n\\n+", "mg");
lyric = lyric.replace(/^\t\t*/gm, "");
lyric = lyric.replace(/^  */gm, "");
lyric = lyric.replace(/\r/gm, "");
log(lyric + "\n");
lyric = lyric.replace(/\u2019/gm, "'");
log(lyric + "\n");
lyric = lyric.replace(/[\x01-\x09\x0B\x0C\x0E-\x1F\x80-\xFF]/gm, ""); // ascii 19 - 
log(lyric + "\n");
//lyric = lyric.replace(/[\u0100-\uFFFF]/gm, "")
//log(lyric + "\n");
lyric = lyric.replace(re, "\n\n");
doc.write("\n" + lyric + "\n");
}

pasteLyricFromClip(UltraEdit.activeDocument );
