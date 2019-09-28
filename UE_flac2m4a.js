
var debug=false;  // Set to true to run in test mode

function log(msg)
{
   UltraEdit.outputWindow.write(msg);
}

UltraEdit.frInFiles.directoryStart = "D:\\alac\\01 pop-rock\\";

UltraEdit.frInFiles.searchInFilesTypes = "folderaudio.md5";
UltraEdit.frInFiles.searchSubs = true;
UltraEdit.frInFiles.regExp = false;
UltraEdit.frInFiles.useOutputWindow = true;

UltraEdit.frInFiles.replace(".flac", ".m4a");
