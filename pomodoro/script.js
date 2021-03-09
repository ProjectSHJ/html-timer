var secondsRemaining;
var intervalHandle;

function resetPage(){
	document.getElementById("focusArea").style.display = "none";
	document.getElementById("inputArea").style.display = "flex";

}

function tick(){
	// grab the h1
	var timeDisplay = document.getElementById("time");

	// turn the seconds into mm:ss
	var min = Math.floor(secondsRemaining / 60);
	var sec = secondsRemaining - (min * 60);

	//add a leading zero (as a string value) if seconds less than 10
	if (sec < 10) {
		sec = "0" + sec;
	}

	// concatenate with colon
	var message = min.toString() + ":" + sec;

	// now change the display
	timeDisplay.innerHTML = message;

	// stop is down to zero
	if (secondsRemaining === 0){
		// alert("Done!");
		clearInterval(intervalHandle);
		resetPage();
	}

	//subtract from seconds remaining
	secondsRemaining--;

}

function startCountdown(){

	// [[EDIT HERE]] get countents of the "minutes" text box
	// var minutes = document.getElementById("minutes").value;
	var minutes = 1;

	// how many seconds
	secondsRemaining = minutes * 60;
	
	// every second, call the "tick" function
	// have to make it into a variable so that you can stop the interval later!!!
	intervalHandle = setInterval(tick, 1000);
	
	// show focusTask, button area
	document.getElementById("focusArea").style.display = "flex";
	
	// hide input area
	document.getElementById("inputArea").style.display = "none";
}

function resetCountdown() {
	// alert("timer stopped");
	clearInterval(intervalHandle);
	resetPage();

	// grab the h1
	var timeDisplay = document.getElementById("time");
	
	// change value to 0:00
	timeDisplay.innerHTML = "0:00";
}

function pauseCountdown() {

}

function createFocusTask() {
	// get input value from inputTask input to focusTask div
	var x = document.getElementById("task").value;
	document.getElementById("focusTask").innerHTML = x;
}

window.onload = function(){

	// create input text box and give it an id of "min"
	var inputTask = document.createElement("input");
	inputTask.setAttribute("id", "task");
	inputTask.setAttribute("type", "text");
   	inputTask.setAttribute("autocomplete", "off");
	inputTask.setAttribute("placeholder", "What do you about to focus about?");
	
	//create a button
	var startButton = document.createElement("input");
	startButton.setAttribute("id", "startButton");
	startButton.setAttribute("class", "btn");
	startButton.setAttribute("type","button");
	startButton.setAttribute("value","시작");
	startButton.onclick = function(){
		startCountdown();
		createFocusTask();
	};
	
	// create stop button
	var stopButton = document.createElement("input");
	stopButton.setAttribute("id", "stop");
	stopButton.setAttribute("class", "btn");
	stopButton.setAttribute("type", "button");
	stopButton.setAttribute("value", "중지");
	stopButton.onclick = function() {
		resetCountdown();
	}

	// create pause button
	var pauseButton = document.createElement("input");
	pauseButton.setAttribute("id", "pause");
	pauseButton.setAttribute("class", "btn");
	pauseButton.setAttribute("type", "button");
	pauseButton.setAttribute("value", "일시중지");
	pauseButton.onclick = function() {
		pauseCountdown();
	}
	
	//add to the DOM, to the div called "inputArea", "focusTask", "buttonArea"
	document.getElementById("inputArea").appendChild(inputTask);
	document.getElementById("inputArea").appendChild(startButton);	
	document.getElementById("buttonArea").appendChild(pauseButton);
	document.getElementById("buttonArea").appendChild(stopButton);

	// hide stop button area
	resetPage();
}
