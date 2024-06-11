
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
log(lyric + "\n")
   ;
// Unicode punctuation characters - there are far too many to trap them all!
// These are the more common annoyances
lyric = lyric.replace(/[\u2000-\u200B]/gm, " ");
lyric = lyric.replace(/[\u2010-\u2015]/gm, "-");
lyric = lyric.replace(/[\u2018-\u201B\u2032-\u2037]/gm, "'");
lyric = lyric.replace(/[\u201C-\u201F]/gm, "\"");
lyric = lyric.replace(/[\u2028-\u2029]/gm, "\n");


log(lyric + "\n");
lyric = lyric.replace(/[\x01-\x09\x0B\x0C\x0E-\x1F\x7F-\xFF]/gm, ""); // Printable 7bit ASCII
log(lyric + "\n");
//lyric = lyric.replace(/[\u0100-\uFFFF]/gm, "")
//log(lyric + "\n");
lyric = lyric.replace(re, "\n\n");
doc.write("\n" + lyric + "\n");
}

pasteLyricFromClip(UltraEdit.activeDocument );
