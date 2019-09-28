/*
  Takes the fields of a class and creates a toString method

 */
var seltxt;
var loops;

function log(msg)
{
   UltraEdit.outputWindow.write(msg);
}

var fields = new Array();
var output = "";
var maxlen = 0;
var doc = UltraEdit.activeDocument;
doc.gotoLine(1,1);
doc.findReplace.selectText = true;
doc.perlReOn = true;
doc.findReplace.regExp = false;
loops = 0;

      output = output + "public String toString() {\n";
      output = output + "  StringBuilder sb = new StringBuilder();\n";
      output = output + "  sb.append(this.getClass().getName());\n"

do
{
  loops++;  // Just in case eof doesn't work because gotoLine always puts cursor at col 1
  doc.selectLine();
  var seltxt = doc.selection;
  var field;
  seltxt = seltxt.trim();
  if((seltxt.length > 0) && (seltxt.indexOf("@") != 0))
  {
     log("Processing: " + seltxt);
   
       // Allows for:
       //  [access] type name ;
       //  [access] type name = xxx ;
       // should also allow for
       //  [access] type name = xxx /* comment */ ;
      var regex = /(\S*\s+){0,1}(\S*\s+)(\S*?)\s*[=\/;]/
      var matches = regex.exec(seltxt);
      if(matches)
      {
         field = matches[3];
         log("Regex matched:" + seltxt + " Field name: " + field);
       }
       else
       {
         log("Regex DID NOT match:" + seltxt);
         // Must be a better way, but I haven't found it yet...
         // the regex usually works - but there are bound to be cases I didn't think of....
         seltxt = seltxt.replace(/;.*/, "");
         seltxt = seltxt.replace("public", "");
         seltxt = seltxt.replace("private", "");
         seltxt = seltxt.replace("protected", "");
         seltxt = seltxt.replace("String", "");
         seltxt = seltxt.replace("BigDecimal", "");
         seltxt = seltxt.replace("long", "");
         seltxt = seltxt.replace("int", "");
         seltxt = seltxt.replace("Date", "");
         seltxt = seltxt.replace("boolean", "");
         field = seltxt.trim();
       }
   
   
     log("Field name is: " + field);
     fields.push(field);
     if(seltxt.length > maxlen)
     {
       maxlen = seltxt.length;
     }
  }
  doc.gotoLine( doc.currentLineNum+1, 1);
  //log("EOF: " + doc.isEof() + " loops:" + loops);
}while((!doc.isEof()) && (loops <100));

var pad = new Array(maxlen + 2).join( ' ' ); // +1 because the separator string goes between the array elements
fields.forEach(function(item, index, array)
{
    //output = output + "  sb.append(\"\\n  " + item + ":" + pad.slice(0, (maxlen-item.length)) + "\").append(" + item + ");\n";
    output = output + "  sb.append(\" " + item + ":" + "\").append(" + item + ");\n";
});

    // sb.append("\n  identity:   ").append(identity);
    //output = output + "sb.append(\"\\n  " + seltxt + ": \").append(" + seltxt + ");\n";
output = output + "  return sb.toString();\n}\n"


doc.selectAll();
doc.write(output);
