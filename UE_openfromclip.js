var clip = UltraEdit.clipboardContent;
UltraEdit.outputWindow.write("Attempting to open " + clip);
UltraEdit.open(clip);