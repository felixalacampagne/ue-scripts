// Script: UE_calgen
// Typical bloody Apple bullshit. From an eMail the events in an ics file can be listed but
// only one event per document open can be added to the calendar, ie. for some mind numbingly 
// idiotic reason there is no way "add all" the events.
//
// BUT there is a workaround which I discovered while trying to add the events to a Google Calendar
// to display on the phone. So this is the convoluted idiot Apple way to do what should be a simple one
// click operation:
// 1) Email the ics file to a gmail account
// 2) Open the email in Safari on the iPhone
// 3) Find the attachement icon.
// 4) Double tap the attachement.
// 5) With luck, ie. when I did it it did, the "normal" list of events will be displayed on the
//    phone except there will now be an "add all" option.
// It's almost enough to make you want to use an Android phone!


// Supported formats:
//   21/11              Tutti
//   02/01/2018         Tutti
// 7 31.12              On-Call
// 1 01.01.2018        Holiday: New Year's Day
//   10.02.2018         Concert 18u00
// 7  19/03/2018        On-Call
// '1' to '7' in the first column indicates the number of  consequtive all-day events
// Space in the first column indicates a 2hr event starting at 20:00 local time


function log(msg)
{
   UltraEdit.outputWindow.write(msg);
}

function doIt()
{
var ics = "";
var hed = "BEGIN:VCALENDAR\nPRODID:-//smallcatutilities/khsjcal//EN\nVERSION:2.0\nMETHOD:PUBLISH\n\n"
var fut = "END:VCALENDAR\n";

// UltraEdit.activeDocument.top();  This doesn't move the cursor!!
UltraEdit.activeDocument.gotoLine(1,1);

var reptext = "";
var date = new Date();
var timestr = "" + ("00" + date.getHours()).substr(-2) + ("00" + date.getMinutes()).substr(-2) + ("00" + date.getSeconds()).substr(-2);
var tstamp = "" + (date.getYear() + 1900) + ("00" + (date.getMonth()+1)).substr(-2) + ("00" + date.getDate()).substr(-2) + "T" + timestr;
var doloop = true;

   do
   {
      UltraEdit.activeDocument.selectLine();
      reptext = UltraEdit.activeDocument.selection;
      log("Selected text: '" + reptext + "'");
      if(reptext == "")
      {
         break;
      }
      
      var yr = date.getYear() + 1900;
      var event;
      
      //  21/11              Description
      //  02/01/2018         Description
      //  12/01/2018         Hout
      //  10/02/2018         Concert 18u00
      
      var mn="";
      var dy = ""
      var typ = "Tutti"
      var dur = "T2H";  // 2 hours
      var tstart = "T200000"; // starts 20:00 local time
      var transp = "OPAQUE";
      var locn = "Moorsel";
      var mode = "";
      
      //var regex = new RegExp("^.* (\\d{2,2})/(\\d{2,2}) +(\\w+)$");
      //var matches = regex.exec(reptext);
      var matches;
      

      if((matches = reptext.match(/^([1-7]{0,1})\s+(\d{2,2})[\/.](\d{2,2})\s+(\w+.*)$/m)) != null)
      {
         mode = matches[1];
        dy = matches[2];
         mn = matches[3];
         typ = matches[4];
      }
      // Could maybe adapt this to make the year match optional and then need to check it's content and use the current year if empty      
      else if ((matches = reptext.match(/^([1-7]{0,1})\s+(\d{2,2})[\/.](\d{2,2})[\/.](\d{4,4})\s+(\w+.*)$/m)) != null)
      {
         mode = matches[1];
         dy = matches[2];
         mn = matches[3];
         yr = matches[4];
         typ = matches[5];
      
      }
      else
      {
         log("Invalid event line: " + reptext);
         return;
      }
      
      if(mode != "")
      {
         tstart = "";
         dur = "" + mode + "D";
         transp = "TRANSPARENT";
         locn = "Belgium";
      }
      
      var datstr = yr + mn + dy;
      event = "BEGIN:VEVENT\n";
      event += "UID:" + datstr + "-" + timestr + "@ics.smallcatutilities\n";
      event += "DTSTAMP:" + tstamp + "\n";
      event += "DTSTART:" + datstr + tstart +"\n";
      event += "DURATION:P" + dur + "\n"
      
      event += "SUMMARY:" + typ + " " + dy + mn + "\n";
      event += "LOCATION:" + locn + "\n"
      // These show up in ics files created by Outlook, maybe needed for iPhone?
      event += "SEQUENCE:0\n";
      event += "TRANSP:" + transp + "\n";
      
      // This gives a reminder the day before
      if(mode == "")
      {      
         event += "BEGIN:VALARM\n";
         event += "TRIGGER:-P1D\n";
         event += "ACTION:DISPLAY\n";
         event += "DESCRIPTION:Reminder\n";
         event += "END:VALARM\n";
      }
      event += "END:VEVENT\n\n";
      
      ics += event;
      
      // UltraEdit.activeDocument.moveLineDown(); this does notmove the cursor to the line below, it swap the current line with the line below!
      UltraEdit.activeDocument.gotoLine(UltraEdit.activeDocument.currentLineNum + 1, 1);


   }while(doloop);

   if(ics != "")
   {
      ics = hed + ics + fut;
                                UltraEdit.clearClipboard;
                                UltraEdit.clipboardContent = ics;
                                UltraEdit.outputWindow.write("ics content written to clipboard");
   }

}

doIt();
