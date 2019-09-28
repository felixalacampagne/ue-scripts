var clip = UltraEdit.clipboardContent;

var pat = "(\\d{1,})(.*)";
function log(msg)
{
   UltraEdit.outputWindow.write(msg);
}

clip = clip.replace(/\+/g, "");
clip = clip.replace(/\//g, "");
clip = clip.replace(/ /g, "");

UltraEdit.activeDocument.write(clip);
UltraEdit.clipboardContent = clip;
