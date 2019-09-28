var scriptname="UE_insertFilename";
var fullpath = UltraEdit.activeDocument.path;

//UltraEdit.outputWindow.write(scriptname + ": Full file path: " + fullpath);
var idx;
idx = Math.max(fullpath.lastIndexOf("\\"), fullpath.lastIndexOf("/"));
var file = fullpath.substr(idx+1);
// UltraEdit.outputWindow.write(scriptname + ": Writing filename: " + file);
UltraEdit.activeDocument.write(file);
