/*function showCalendars(calendars) {
    for (var i = 0; i < calendars.length; i++) {
        Ti.API.info(calendars[i].name);
        Ti.API.info(calendars[i].id);
    }
}

Ti.API.info('ALL CALENDARS:');
showCalendars(Ti.Android.Calendar.allCalendars);
Ti.API.info('SELECTABLE CALENDARS:');
showCalendars(Ti.Android.Calendar.selectableCalendars);

var calendars = [];
var selectedCalendarName;
var selectedCalendarId;
var pickerData = [];

var calWin = Ti.UI.createWindow({
  backgroundColor: 'white',
  exitOnClose: true,
  fullscreen: false,
  layout: 'vertical',
  title: 'Calendar Demo'
});

var scrollView = Ti.UI.createScrollView({
  backgroundColor: '#eee',
  height: 500,
  top: 20
});

var label = Ti.UI.createLabel({
  backgroundColor: 'white',
  text: 'Click on the button to display the events for the selected calendar',
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  top: 20
});
scrollView.add(label);

var selectableCalendars = Ti.Android.Calendar.selectableCalendars;
for (var i = 0, ilen = selectableCalendars.length; i < ilen; i++) {
  calendars.push({ name: selectableCalendars[i].name, id: selectableCalendars[i].id });
  pickerData.push( Ti.UI.createPickerRow({ title: calendars[i].name }) );
  if(i === 0){
    selectedCalendarName = selectableCalendars[i].name;
    selectedCalendarId = selectableCalendars[i].id;
  }
}
var selectableCalendars = null;

if(!calendars.length){
  label.text = 'No calendars available. Select at least one in the native calendar before using this app';
} else {
  label.text = 'Click button to view calendar events';
  
  var picker = Ti.UI.createPicker({
    top:20
  });
  
  picker.add(pickerData);
  calWin.add(picker);
  
  picker.addEventListener('change', function(e){
    for (var i = 0, ilen = calendars.length; i < ilen; i++) {
      if(calendars[i].name === e.row.title){
        selectedCalendarName = calendars[i].name;
        selectedCalendarId = calendars[i].id;
      }
    }
  });
  
  var button = Ti.UI.createButton({
    title: 'View events',
    top: 20
  });
  calWin.add(button);
  
  button.addEventListener('click', function(e){
    label.text = 'Generating...';
    
    var currentYear = new Date().getFullYear();
    
    var consoleString = '';
    
    function print(s) {
      if (consoleString.length) {
        consoleString = consoleString + '\n';
      }
      consoleString = consoleString + s;
    }
    
    var calendar = Ti.Android.Calendar.getCalendarById(selectedCalendarId);
    
    function printReminder(r) {
      var typetext = '[method unknown]';
      if (r.method == Ti.Android.Calendar.METHOD_EMAIL) {
        typetext = 'Email';
      } else if (r.method == Ti.Android.Calendar.METHOD_SMS) {
        typetext = 'SMS';
      } else if (r.method == Ti.Android.Calendar.METHOD_ALERT) {
        typetext = 'Alert';
      } else if (r.method == Ti.Android.Calendar.METHOD_DEFAULT) {
        typetext = '[default reminder method]';
      }
      print(typetext + ' reminder to be sent ' + r.minutes + ' minutes before the event');
    }
    
    function printAlert(a) {
      print('Alert id ' + a.id + ' begin ' + a.begin + '; end ' + a.end + '; alarmTime ' + a.alarmTime + '; minutes ' + a.minutes);
    }
    
    function printEvent(event) {
      if (event.allDay) {
        print('Event: ' + event.title + '; ' + event.begin.toLocaleDateString() + ' (all day)');
      } else {
        print('Event: ' + event.title + '; ' + event.begin.toLocaleDateString() + ' ' + event.begin.toLocaleTimeString()+ '-' + event.end.toLocaleTimeString());
      }
      
      var reminders = event.reminders;
      if (reminders && reminders.length) {
        print('There is/are ' + reminders.length + ' reminder(s)');
        for (var i = 0; i < reminders.length; i++) {
          printReminder(reminders[i]);
        }
      }
      
      print('hasAlarm? ' + event.hasAlarm);
      var alerts = event.alerts;
      if (alerts && alerts.length) {
        for (var i = 0; i < alerts.length; i++) {
          printAlert(alerts[i]);
        }
      }
      
      var status = event.status;
      if (status == Ti.Android.Calendar.STATUS_TENTATIVE) {
        print('This event is tentative');
      }
      if (status == Ti.Android.Calendar.STATUS_CONFIRMED) {
        print('This event is confirmed');
      }
      if (status == Ti.Android.Calendar.STATUS_CANCELED) {
        print('This event was canceled');
      }
    }
    
    var events = calendar.getEventsInYear(currentYear);
    if (events && events.length) {
      print(events.length + ' event(s) in ' + currentYear);
      print('');
      for (var i = 0; i < events.length; i++) {
        printEvent(events[i]);
        print('');
      }
    } else {
      print('No events');
    }
    
    label.text = consoleString;
  });
}

calWin.add(scrollView);

calWin.open();*/
//SAVE TO CALENDAR

function addToCalendar(start, end, title, description){
	//var cal = Ti.Calendar.defaultCalendar;IPHONE
	var CALENDAR_TO_USE = 1;
	var cal = Ti.Android.Calendar.getCalendarById(CALENDAR_TO_USE);
	//var d = new Date(year, month, day, hours, minutes, seconds, milliseconds); 
	var start_date = new Date(start);
	var end_date = new Date(end);
	
	var event = cal.createEvent({
	    title: title,
	    description: description,
	    begin: start_date,
	    end: end_date
	});
	
	var reminderDetails = {
	    minutes: 60,
	    method: Ti.Android.Calendar.METHOD_ALERT
	};
	event.createReminder(reminderDetails);
}
