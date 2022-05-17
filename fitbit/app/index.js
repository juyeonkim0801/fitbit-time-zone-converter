import * as messaging from 'messaging';
import * as document from "document";

//Get the clock element defined in resources/index.view and set its text
const clock = document.getElementById("clock");

const locationElement = document.getElementById("location");
locationElement.text = "Local Time";

messaging.peerSocket.addEventListener("open", (evt) => {
  console.log("Ready to send or receive messages");

  //Get the current local time and some arbitrary times in different time zones
  //You can send a dictionary with any primitives (strings, numbers, booleans) and have the companion return it in the response message
  getCurrentLocalTime();
  // convertTimeZone(new Date().toString(), 'London');
  // convertTimeZone("2:42pm", 'Hawaii', {'sentCustomTime':true});
});

// Send a command to the companion
function sendMessage(message) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(message);
  }
}

//Helper function to get the current local time from the companion
function getCurrentLocalTime(dataToSend = {}) {
	dataToSend.command = "currentLocalTime";
	sendMessage(dataToSend);
}

//Helper function to ask the companion to convert a time string and a time zone string
function convertTimeZone(time, timeZoneString, dataToSend={}) {
	dataToSend.command = "convertTime";
	dataToSend.time = time;
	dataToSend.timeZoneString = timeZoneString;
	sendMessage(dataToSend);
}

//Process the local time response
function processLocalTime(localTime) {
	console.log('It is currently ' + localTime.response + ' locally');
	//TODO: display the local time. You may want to do so in a different part of the code, or may be able to modify this method
  clock.text = localTime.response;
}

function processConvertedTime(convertedTime) {
	
	if(convertedTime.sentCustomTime) {
		console.log(convertedTime.time + ' in local time is ' + convertedTime.response + ' in ' + convertedTime.timeZoneString);
	} else {
		console.log('It is currently ' + convertedTime.response + ' in ' + convertedTime.timeZoneString);
	}
	//TODO: display the converted times. You may want to do so in a different part of the code, or may be able to modify this method
  clock.text = convertedTime.response;
}

//Listener for responses from the companion
messaging.peerSocket.addEventListener("message", (evt) => {
  if (evt.data.command === "currentLocalTime" && evt.data.response) {
    processLocalTime(evt.data);
  } else if(evt.data.command === "convertTime" && evt.data.response) {
  	processConvertedTime(evt.data);
  }
});

//Print error messages
messaging.peerSocket.addEventListener("error", (err) => {
  console.error(`Connection error: ${err.code} - ${err.message}`);
});

// tile list
let myList = document.getElementById("myList");
let items = myList.getElementsByClassName("list-item");
//let timezonelist = document.getElementById("timezone-list");
// let myHeader = timezonelist.getElementsByClassName("list-item header");
let button = document.getElementById("button-1");
let clockElement = document.getElementById("clock");
let timezoneList = document.getElementById("timezone-list");

// convert button
button.onactivate = function(evt) {
  button.style.display = "none";
  clockElement.style.display = "none";
  locationElement.style.display = "none";
  timezoneList.style.display = "inline";
  myList.style.display = "inline";
  // myHeader.style.display = "inline";
}
  
// timezone buttons
items.forEach((element, index) => {
  let touch = element.getElementById("touch");
  touch.onclick = function(evt) {
    console.log(`touched: ${index}`);
    // update the location span
    if (index === 0) {locationElement.text = "Local Time";}
    else if (index === 1) {locationElement.text = "Seoul";}
    else if (index === 2) {locationElement.text = "Mexico City";}
    else if (index === 3) {locationElement.text = "Madrid";}

    // update the time (clock) span
    if (index === 0) {
      getCurrentLocalTime();
      //processLocalTime();
    }
    else if (index === 1) {
      convertTimeZone(new Date().toString(), 'Seoul');
    }
    else if (index === 2) {
      convertTimeZone(new Date().toString(), 'Mexico City');
    }
    else if (index === 3) {
      convertTimeZone(new Date().toString(), 'Madrid');
    }

    // show the main view, hide the timezone list
    button.style.display = "inline";
    clockElement.style.display = "inline";
    locationElement.style.display = "inline";
    timezoneList.style.display = "none";
    myList.style.display = "none";
  };
});