var secondsRemaining;
var intervalHandle;
var timerCount = 0;
var focusCount = 0;
var breakCount = 0;

function resetPage() {
	document.getElementById("focusArea").style.display = "none";
	document.getElementById("inputArea").style.display = "flex";

}

function tick() {
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

	// stop when time is down to zero
	// call focus or break timer when time is down to zero
	if (secondsRemaining == 0) {
		if (timerCount < 11) {
			if (timerCount % 2 == 0) {
				if (timerCount % 10 == 8) {
					timerCount++;
					console.log(timerCount);
					focusCount++;
					NowBreak();
					break15min();
				} else {
					timerCount++;
					console.log(timerCount);
					focusCount++;
					NowBreak();
					break5min();
				}
			} else {
				timerCount++;
				console.log(timerCount);
				breakCount++;
				NowFocus();
				focus25min();
			}
		} else {
			// stop timer
			alert("포모도로 5회 완료 🎉");
			clearInterval(intervalHandle);

			// Show Statistics
			AddFocusCount();
			AddBreakCount();
			document.title = "Pomodoro Timer";
			document.getElementById("time").style.color = "#41414e";
		}
	}

	//subtract from seconds remaining
	secondsRemaining--;
}

/*
Show current timer status
*/

function NowFocus() {
	var message = document.getElementById("CountArea");
	message.innerHTML = "🍅 집중 중";
	document.title = "🍅 집중 중";
}

function NowBreak() {
	var message = document.getElementById("CountArea");
	message.innerHTML = "🧘 휴식 중";
	document.title = "🧘 휴식 중";
}

/*
Add Focus Count, Break Count
*/

function AddFocusCount() {
	// clear CountArea
	var countArea = document.getElementById("CountArea");
	countArea.innerHTML = "";

	// create span with id
	var focusSpan = document.createElement("span");
	focusSpan.setAttribute("id", "focusCount");

	// add to the DOM
	document.getElementById("CountArea").appendChild(focusSpan);

	// change text
	var message = document.getElementById("focusCount");
	message.innerHTML = "🍅 집중 " + focusCount + "번";
}

function AddBreakCount() {
	// create span with id
	var breakSpan = document.createElement("span");
	breakSpan.setAttribute("id", "breakCount");

	// add to the DOM
	document.getElementById("CountArea").appendChild(breakSpan);

	// change text
	var message = document.getElementById("breakCount");
	message.innerHTML = "🧘 휴식 " + breakCount + "번";
}

/*
Button Actions
*/

function startCountdown() {
	// start pomodoro
	focus25min();

	// every second, call the "tick" function
	// have to make it into a variable so that you can stop the interval later!!!
	intervalHandle = setInterval(tick, 1000);

	// show focusTask, button area
	document.getElementById("focusArea").style.display = "";

	// hide input area
	document.getElementById("inputArea").style.display = "none";

	// set countArea message
	NowFocus();
}

function resetCountdown() {
	// alert("timer stopped");
	clearInterval(intervalHandle);
	timerCount = 0;
	resetPage();

	// grab the h1
	var timeDisplay = document.getElementById("time");

	// change value to 0:00
	timeDisplay.innerHTML = "25:00";
	document.getElementById("time").style.color = "#41414e";

	// Show Statistics
	AddFocusCount();
	AddBreakCount();

	// rest title
	document.title = "Pomodoro Timer";

	// reset Focus, Break Count
	focusCount = 0;
	breakCount = 0;
}

function pauseCountdown() {
	// stop timer
	clearInterval(intervalHandle);

	// style timer
	document.getElementById("time").style.textDecoration = "line-through";
	document.getElementById("time").style.opacity = "0.5";

	// remove pause, stop button
	document.getElementById("pauseButton").style.display = "none";
	document.getElementById("stopButton").style.display = "none";

	// show resume button
	document.getElementById("resumeButton").style.display = "";
}

function resumeCountdown() {
	// restart timer
	intervalHandle = setInterval(tick, 1000);

	// restyle timer
	document.getElementById("time").style.textDecoration = "";
	document.getElementById("time").style.opacity = "";

	// remove resume button
	document.getElementById("resumeButton").style.display = "none";

	// show pause, stop button
	document.getElementById("pauseButton").style.display = "";
	document.getElementById("stopButton").style.display = "";
}

function createFocusTask() {
	// get input value from inputTask input to focusTask div
	var x = document.getElementById("task").value;
	document.getElementById("focusTask").innerHTML = x;
}


/*
25 min focus, 5 min short break, 15 min long break
*/

function focus25min() {
	var minutes = 25;

	// how many seconds
	secondsRemaining = minutes * 60;

	// style timer
	document.getElementById("time").style.color = "#e86666"
}

function break5min() {
	var minutes = 5;

	// how many seconds
	secondsRemaining = minutes * 60;

	// style timer
	document.getElementById("time").style.color = "#00a469"
}

function break15min() {
	var minutes = 15;

	// how many seconds
	secondsRemaining = minutes * 60;

	// style timer
	document.getElementById("time").style.color = "#00a8a66"
}


/*
Add Inputs, Buttons to DOM
*/

window.onload = function () {

	// create input text box and give it an id of "task"
	var inputTask = document.createElement("input");
	inputTask.setAttribute("id", "task");
	inputTask.setAttribute("type", "text");
	inputTask.setAttribute("autocomplete", "off");
	inputTask.setAttribute("placeholder", "어떤 Task에 집중하나요?");

	//create a button
	var startButton = document.createElement("input");
	startButton.setAttribute("id", "startButton");
	startButton.setAttribute("class", "btn");
	startButton.setAttribute("type", "button");
	startButton.setAttribute("value", "시작");
	startButton.onclick = function () {
		startCountdown();
		createFocusTask();
	};

	// create stop button
	var stopButton = document.createElement("input");
	stopButton.setAttribute("id", "stopButton");
	stopButton.setAttribute("class", "btn");
	stopButton.setAttribute("type", "button");
	stopButton.setAttribute("value", "중지");
	stopButton.onclick = function () {
		resetCountdown();
	}

	// create pause button
	var pauseButton = document.createElement("input");
	pauseButton.setAttribute("id", "pauseButton");
	pauseButton.setAttribute("class", "btn");
	pauseButton.setAttribute("type", "button");
	pauseButton.setAttribute("value", "일시중지");
	pauseButton.onclick = function () {
		pauseCountdown();
	}

	// create resume button
	var resumeButton = document.createElement("input");
	resumeButton.setAttribute("id", "resumeButton");
	resumeButton.setAttribute("class", "btn");
	resumeButton.setAttribute("type", "button");
	resumeButton.setAttribute("value", "이어하기");
	resumeButton.onclick = function () {
		resumeCountdown();
	};

	//add to the DOM, to the div called "inputArea", "focusTask", "buttonArea"
	document.getElementById("inputArea").appendChild(inputTask);
	document.getElementById("inputArea").appendChild(startButton);
	document.getElementById("buttonArea").appendChild(pauseButton);
	document.getElementById("buttonArea").appendChild(resumeButton);
	document.getElementById("buttonArea").appendChild(stopButton);

	// hide pause button
	document.getElementById("resumeButton").style.display = "none";

	// hide button area
	resetPage();
}