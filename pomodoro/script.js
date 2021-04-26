var totalSeconds;
var secondsRemaining;
var intervalHandle;
var timerCount = 1;
var focusCount = 0;
var breakCount = 0;
var taskCount = 1;

// request notification permission on page load
document.addEventListener('DOMContentLoaded', function() {
	if (!Notification) {
	 alert('Desktop notifications not available in your browser. Try Chromium.');
	 return;
	}
   
	if (Notification.permission !== 'granted')
	 Notification.requestPermission();
   });

// notifications fuction
function noti_focus() {
	if (Notification.permission !== 'granted')
		Notification.requestPermission();
	else {
		var notification = new Notification('집중 타이머 시작', {
		icon: "pomodoro/icons/pomodoro.png",
		body: "휴식 끝, 집중 시작",
		});
		
		// close notification when click
		notification.onclick = function () {
			notification.close();
		};
		
		// close notification after 2 seconds
		setTimeout(() => {
			notification.close();
		}, 4 * 1000);
	}
}

function noti_break() {
	if (Notification.permission !== 'granted')
		Notification.requestPermission();
	else {
		var notification = new Notification('휴식 타이머 시작', {
		icon: "pomodoro/icons/bath.png",
		body: "집중 끝, 5분 휴식 시작",
		});

		// close notification when click
		notification.onclick = function () {
			notification.close();
		};
		
		// close notification after 2 seconds
		setTimeout(() => {
			notification.close();
		}, 4 * 1000);
	}
}

function noti_longbreak() {
	if (Notification.permission !== 'granted')
		Notification.requestPermission();
	else {
		var notification = new Notification('휴식 타이머 시작', {
		icon: "pomodoro/icons/bath.png",
		body: "집중 끝, 15분 휴식 시작",
		});

		// close notification when click
		notification.onclick = function () {
			notification.close();
		};
		
		// close notification after 2 seconds
		setTimeout(() => {
			notification.close();
		}, 4 * 1000);
	}
}

// Timer

function resetPage() {
	document.getElementById("focusArea").style.display = "none";
	document.getElementById("inputArea").style.display = "flex";
}

function tick() {
	// 	seconds remainig
	var currentTime = new Date();
	currentTime = currentTime.getTime();
	var timerStartTime = localStorage.getItem("timerStartTime");
	var tickOffset = currentTime - timerStartTime;
	tickOffset = Math.floor(tickOffset/1000)

	// grab the h1
	var timeDisplay = document.getElementById("time");

	//subtract tickOffset from totalSeconds
	secondsRemaining = totalSeconds - tickOffset;
	// console.log("Total Seconds: ", totalSeconds);
	// console.log("Tick offset: ", tickOffset);
	// console.log("Seconds Remaining: ", secondsRemaining);

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
	var currentStatus = localStorage.getItem("currentStatus");
	document.title = currentStatus + " [" + message + "]"


	// stop when time is down to zero
	// call focus or break timer when time is down to zero
	if (secondsRemaining <= 0) {
		if (timerCount < 8) {
			if (timerCount % 2 == 0) {
				noti_focus();
				// console.log("집중");
				NowFocus();
				focus25min();
				timerCount++;
				breakCount++;
			} else {
				if (breakCount == 3) {
					noti_break();
					// console.log("긴휴식");
					Now15Break();
					break15min();
					timerCount++;
					focusCount++;
				} else {
					noti_longbreak();
					// console.log("휴식");
					NowBreak();
					break5min();
					timerCount++;
					focusCount++;
				}
			}
		} else {
			timerCount++;
			breakCount++;
			// Reset Timer, & Show Statistics
			resetCountdown();
			alert("🎉 포모도로 1사이클(130분)을 완료했어요!") 
		}
	}
}

/*
Show current timer status
*/

function NowFocus() {
	var message = document.getElementById("CountArea");
	message.innerHTML = "🍅 집중 중";
	var currentStatus = "🍅";
	localStorage.setItem("currentStatus", currentStatus);
}

function NowBreak() {
	var message = document.getElementById("CountArea");
	message.innerHTML = "🧘 휴식 중";
	var currentStatus = "🧘";
	localStorage.setItem("currentStatus", currentStatus);
}

function Now15Break() {
	var message = document.getElementById("CountArea");
	message.innerHTML = "🧘 긴 휴식 중";
	var currentStatus = "🧘🧘";
	localStorage.setItem("currentStatus", currentStatus);
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

	// grab taskHistory li with taskCount
	var taskLi = document.getElementById("task"+taskCount);
	
	// create span with class, add to DOM, Change text
	taskLi.appendChild(document.createTextNode(" (🍅 " + focusCount));

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
	
	// grab taskHistory li with taskCount
	var taskLi = document.getElementById("task"+taskCount);
	
	// create span with class, add to DOM, Change text
	taskLi.appendChild(document.createTextNode(" 🧘 " + breakCount + ")"));
}

/*
Button Actions
*/

function startCountdown() {
	// start pomodoro
	focus25min();

	// every second, call the "tick" function
	// have to make it into a variable so that you can stop the interval later!!!
	intervalHandle = setInterval(tick, 500);

	// show focusTask, button area
	document.getElementById("focusArea").style.display = "";

	// hide input area
	document.getElementById("inputArea").style.display = "none";

	// set Task History Area opacity to 0
	// show Task History
	document.getElementById("focusHistory").style.opacity = "";

	// set countArea message
	NowFocus();

	var startTimeStamp = new Date();
	// console.log(startTimeStamp);
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
	document.getElementById("time").style.color = "var(--color_normal)";

	// Show Statistics
	AddFocusCount();
	AddBreakCount();

	// show Task History
	document.getElementById("focusHistory").style.opacity = "1";

	// rest title
	document.title = "Pomodoro Timer";

	// reset Focus, Break Count
	focusCount = 0;
	breakCount = 0;

	// add taskCount
	taskCount++;

	// Session Starage timestamp of StartCountdown
	var timerResetTime = Date.now();
	localStorage.setItem("timerResetTime", timerResetTime);
	localStorage.clear("timerStartTime");
}

function pauseCountdown() {
	// 일시정지 duration 만큼 timerStartTime에 더해주는 작업
	var timerPauseTime = Date.now();
	localStorage.setItem("timerPauseTime", timerPauseTime);
	// console.log("Paused at: ", timerPauseTime);

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
	// 일시정지 duration 만큼 timerStartTime에 더해주는 작업
	var timerResumeTime = Date.now();
	timerPauseTime = localStorage.getItem("timerPauseTime")
	var pauseDuration = timerResumeTime - timerPauseTime;
	// console.log("Resume at: ", timerResumeTime)
	// console.log("paused for: ", pauseDuration);
	var timerStartTime = JSON.parse(localStorage.getItem("timerStartTime"));
	// console.log("기존 Start Time: ", timerStartTime)
	timerStartTime = timerStartTime + pauseDuration;
	// console.log("변경 Start Time: ", timerStartTime);
	localStorage.setItem("timerStartTime", timerStartTime);

	// restart timer
	intervalHandle = setInterval(tick, 500);

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
	// show focusHistory area if focusHistory is display none
	if (document.getElementById("focusHistory").style.display = "none") {
		document.getElementById("focusHistory").style.display = ""
	}

	// get input value from inputTask input to focusTask div
	var x = document.getElementById("task").value;
	// if input value is empty, set to placeholder string
	if (x == "") {
		x = "할일 " + taskCount;
	}
	else {
	}
	document.getElementById("focusTask").innerHTML = x;

	// add to Task History
	var ul = document.getElementById("historyUl");
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(x));
	li.setAttribute("id", "task"+taskCount);
	ul.appendChild(li);
}


/*
25 min focus, 5 min short break, 15 min long break
*/

function focus25min() {
	var minutes = 25;

	// how many seconds
	totalSeconds = minutes * 60;
	secondsRemaining = totalSeconds;
	
	// Session Starage timestamp of StartCountdown
	var timerStartTime = Date.now();
	localStorage.setItem("timerStartTime", timerStartTime);
	
	// style timer
	document.getElementById("time").style.color = "var(--color_focus)";
}

function break5min() {
	var minutes = 5;
	
	// how many seconds
	totalSeconds = minutes * 60;
	secondsRemaining = totalSeconds;

	// Session Starage timestamp of StartCountdown
	var timerStartTime = Date.now();
	localStorage.setItem("timerStartTime", timerStartTime);

	// style timer
	document.getElementById("time").style.color = "var(--color_break)";
}

function break15min() {
	var minutes = 15;
	
	// how many seconds
	totalSeconds = minutes * 60;
	secondsRemaining = totalSeconds;

	// Session Starage timestamp of StartCountdown
	var timerStartTime = Date.now();
	localStorage.setItem("timerStartTime", timerStartTime);
	
	// style timer
	document.getElementById("time").style.color = "var(--color_longBreak)";
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
	function hideFocusHistory() {
		document.getElementById("focusHistory").style.display = "none";
	}
	hideFocusHistory();
	resetPage();


	// Theme
	var lightTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

	if(lightTheme == true) {
		document.getElementById("toggleTheme").setAttribute("class", "btn");
		document.getElementById("toggleTheme").innerHTML = "🌘 Dark Theme";
	}
	else {
		document.getElementById("toggleTheme").setAttribute("class", "btn dark");
		document.getElementById("toggleTheme").innerHTML = "🌞 Light Theme";
		document.body.setAttribute("class", "dark");
	}
}

function toggleTheme() {
	if (document.getElementById("toggleTheme").classList == "btn" ) {
		document.getElementById("toggleTheme").setAttribute("class", "btn dark");
		document.getElementById("toggleTheme").innerHTML = "🌞 Light Theme";
		document.body.setAttribute("class", "dark");
	}
	else {
		document.getElementById("toggleTheme").setAttribute("class", "btn");
		document.getElementById("toggleTheme").innerHTML = "🌘 Dark Theme";
		document.body.setAttribute("class", "");
	}
}