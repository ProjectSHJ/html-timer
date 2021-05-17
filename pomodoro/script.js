var totalSeconds;
var secondsRemaining;
var intervalHandle;
var timerCount = 1;
var focusCount = 0;
var breakCount = 0;
var taskCount = localStorage.getItem("taskCount");
var phaseCount = 1;
var faviconClock = 'https://projectshj.github.io/html-timer/pomodoro/icons/clock.png'
var faviconPomodoro = 'https://projectshj.github.io/html-timer/pomodoro/icons/pomodoro.png'
var faviconBath = 'https://projectshj.github.io/html-timer/pomodoro/icons/bath.png'

/*
=================== Common functoins ===================
*/
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
};
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
};

function getFocusTask() {
	// get input value from inputTask input to focusTask div
	var x = document.getElementById("task").value;

	// if input value is empty, set to placeholder string
	if (taskCount != null) {
		if (x == "") {
			x = "할일 " + taskCount;
		}
		else {
		}
		return x;
	}
	else {
		taskCount = 1;
		if (x == "") {
			x = "할일 " + taskCount;
		}
		else {
		}
		return x;
	}
}

function setTaskInfo(x, y) {
	var taskNo = localStorage.getItem("taskCount");
	var t = "task" + taskNo + "p" + phaseCount;
	
	var a = {}
	var count1 = localStorage.getObj(t).taskCount;
	var count2 = localStorage.getObj(t).timerCount;
	var count3 = localStorage.getObj(t).focusCount;
	var count4 = localStorage.getObj(t).breakCount;
	var count5 = localStorage.getObj(t).phaseCount;
	var taskValue = localStorage.getObj(t).taskValue;

	if (x == "taskCount") { count1 = y; }
	else if (x == "timerCount") { count2 = y; }
	else if (x == "focusCount") { count3 = y; }
	else if (x == "breakCount") { count4 = y; }
	else if (x == "phaseCount") { count5 = y; }
	else if (x == "taskValue") { taskValue = y; }
	else {console.log("x 가 지정된 변수를 호출하지 않았습니다 (setTaskInfo(x, y)")}
	a = {
		taskCount: count1,
		timerCount: count2,
		focusCount: count3,
		breakCount: count4,
		phaseCount: count5,
		taskValue: taskValue
	}
	localStorage.setObj(t, a);
}


/*
=================== Notification ===================
*/

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

/*
=================== Check if timer was working before freeze ===================
*/

function checkTaskList() {
	if (localStorage.getItem("task1") != null) {
		// taskCount 만큼 #HistoryUl 안에 #task{taskCount}, {taskCount}의 value를 가진 li를 붙여넣기
		var i;
		var x = localStorage.getItem("taskCount");
		for (i = 1; i <= x; i++) {
			var taskNo = "task" + i;
			for (i = 1; i <= 99; i ++) {
				var phaseCount = "p" + i;
				var taskNoPh = taskNo + phaseCount;
				var continueNo = "continueButton" + i;
				var taskValue = localStorage.getObj(taskNoPh).taskValue;
				var stats = " (🍅 " + localStorage.getObj(taskNoPh).focusCount + " 🛀 " + localStorage.getObj(taskNoPh).breakCount + ")";
				// create continue button
				var continueButton = document.createElement("button");
				continueButton.setAttribute("id", continueNo);
				continueButton.setAttribute("class", "btn icon_btn");
				continueButton.setAttribute("type", "button");
				continueButton.setAttribute("data-tooltip", "이어하기");
				continueButton.onclick = function () {
					continueCountdown(this.id);
				}
				continueButton.innerHTML = "➡️";
				// create li and append continue button
				var ul = document.getElementById("historyUl");
				var li = document.createElement("li");
				li.appendChild(document.createTextNode(taskValue + stats));
				li.setAttribute("id", taskNoPh);
				ul.appendChild(li);
				li.appendChild(continueButton);
			}
		}
		
		// show Task History
		document.getElementById("focusHistory").style.display = "";
		document.getElementById("focusHistory").style.opacity = 1;
	}
	else {
		// do sth
	}
}


/*
=================== favicon change ===================
*/

function setFavicon(url) {
	var link = document.querySelector("link[rel~='icon']");
	if (!link) {
		link = document.createElement('link');
		link.rel = 'icon';
		document.getElementsByTagName('head')[0].appendChild(link);
	}
	link.href = url;
}


/*
=================== Timer functions ===================
*/

function resetPage() {
	document.getElementById("focusArea").style.display = "none";
	document.getElementById("inputArea").style.display = "flex";
}

function clearTimer() {
	document.getElementById("resumeButton").style.display = "none";
	document.getElementById("pauseButton").style.display = "";
	document.getElementById("stopButton").style.display = "";
	document.getElementById("time").style.textDecoration = "";
	document.getElementById("time").style.opacity = "";
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
	var taskName = getFocusTask();
	document.title = "[" + message + "] | " + taskName;


	// stop when time is down to zero
	// call focus or break timer when time is down to zero
	if (secondsRemaining <= 0) {
		if (timerCount < 8) {
			if (timerCount % 2 == 0) {
				timerCount++;
				breakCount++;
				setTaskInfo("timerCount", timerCount);
				setTaskInfo("breakCount", breakCount);
				console.log("timerCount: " + timerCount + ", focusCount: " + focusCount +", breakCount: " + breakCount);
				console.log("집중 시작");
				noti_focus();
				NowFocus();
				focus25min();
			} else {
				if (breakCount == 3) {
					timerCount++;
					focusCount++;
					setTaskInfo("timerCount", timerCount);
					setTaskInfo("focusCount", focusCount);
					console.log("timerCount: " + timerCount + ", focusCount: " + focusCount +", breakCount: " + breakCount);
					console.log("긴휴식 시작");
					noti_break();
					Now15Break();
					break15min();
				} else {
					timerCount++;
					focusCount++;
					setTaskInfo("timerCount", timerCount);
					setTaskInfo("focusCount", focusCount);
					console.log("timerCount: " + timerCount + ", focusCount: " + focusCount +", breakCount: " + breakCount);
					console.log("휴식 시작");
					noti_longbreak();
					NowBreak();
					break5min();
				}
			}
		} else {
			timerCount++;
			breakCount++;
			setTaskInfo("timerCount", timerCount);
			setTaskInfo("breakCount", breakCount);
			
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
	setFavicon(faviconPomodoro);
}

function NowBreak() {
	var message = document.getElementById("CountArea");
	message.innerHTML = "🛀 휴식 중";
	setFavicon(faviconBath);
}

function Now15Break() {
	var message = document.getElementById("CountArea");
	message.innerHTML = "🛀 긴 휴식 중";
	setFavicon(faviconBath);
}

/*
Add Focus Count, Break Count, Continue Button
*/

function AddGlobalStat() {
	// clear CountArea
	var countArea = document.getElementById("CountArea");
	countArea.innerHTML = "";

	// create span with id
	var focusSpan = document.createElement("span");
	focusSpan.setAttribute("id", "focusCount");
	var breakSpan = document.createElement("span");
	breakSpan.setAttribute("id", "breakCount");

	// add to the DOM
	document.getElementById("CountArea").appendChild(focusSpan);
	document.getElementById("CountArea").appendChild(breakSpan);

	// change text
	var message1 = document.getElementById("focusCount");
	message1.innerHTML = "🍅 집중 " + focusCount + "번";
	var message2 = document.getElementById("breakCount");
	message2.innerHTML = "🛀 휴식 " + breakCount + "번";
}

function AddTaskStat() {
	var taskNoPh = "task" + taskCount + "p" + phaseCount;
	
	// grab taskHistory li with taskCount
	var taskLi = document.getElementById(taskNoPh);

	// grab task information
	var taskInfo = localStorage.getObj(taskNoPh);
	taskValue = taskInfo.taskValue;
	focusCount = taskInfo.focusCount;
	breakCount = taskInfo.breakCount;
	phaseCont = taskInfo.phaseCount;

	// Change text of li
	taskLi.innerHTML = taskValue + " (🍅 " + focusCount + " 🛀 " + breakCount + ")";
}

function AddContinueButton() {
	var continueNo = "continueButton" + taskCount;
	var continueButton = document.createElement("button");
	continueButton.setAttribute("id", continueNo);
	continueButton.setAttribute("class", "btn icon_btn");
	continueButton.setAttribute("type", "button");
	continueButton.setAttribute("data-tooltip", "이어하기");
	continueButton.onclick = function () {
		continueCountdown(this.id);
	}
	continueButton.innerHTML = "➡️";

	// grab current task li
	var taskNo = "continueButton" + taskCount;
	var t = "task" + taskCount + "p" + phaseCount;

	// check if there is button
	var c = "continueButton" + taskNo;
	c = document.getElementById(c)
	if (c == null) {
		var li = document.getElementById(t)
		li.appendChild(continueButton);
	}
	else {}
}

/*
=================== Button Actions ===================
*/

function startCountdown() {
	// add taskCount to localStorage
	// check if taskCount is null, then start taskCount from 1
	// check if there is previousTaskCount, then replace it to current askCount
	if (taskCount != null) {
		if (localStorage.getItem("previousTaskCount") != null) {
			// current TaskCount is Previous Task Count + 1, and clear
			taskCount = parseInt(localStorage.getItem("previousTaskCount")) + 1;
			localStorage.removeItem("previousTaskCount");

			localStorage.setItem("taskCount", taskCount);
			var x = "task" + taskCount + "p" + phaseCount;
			var taskValue = getFocusTask();
			var a = {
				taskCount: taskCount,
				timerCount: 0,
				focusCount: 0,
				breakCount: 0,
				phaseCount: 1,
				taskValue: taskValue
			}
			localStorage.setObj(x, a);
		}
		else {
			taskCount++;
			localStorage.setItem("taskCount", taskCount);
			var x = "task" + taskCount + "p" + phaseCount;
			var taskValue = getFocusTask();
			var a = {
				taskCount: taskCount,
				timerCount: 0,
				focusCount: 0,
				breakCount: 0,
				phaseCount: 1,
				taskValue: taskValue
			}
			localStorage.setObj(x, a);
		}
	}
	else {
		taskCount = 1;
		localStorage.setItem("taskCount", "1");
		var taskValue = getFocusTask();
		var a = {
			taskCount: 1,
			timerCount: 0,
			focusCount: 0,
			breakCount: 0,
			phaseCount: 1,
			taskValue: taskValue
		}
		localStorage.setObj("task1p1", a);
	};

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
	// document.getElementById("focusHistory").style.opacity = "";

	// set countArea message
	NowFocus();

	// hide all continueCountdown throughout li
	var i;
	var x = document.getElementById("historyUl").querySelectorAll(".icon_btn");
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
}

function resetCountdown() {
	// alert("timer stopped");
	clearInterval(intervalHandle);
	resetPage();
	
	// remove highlight
	var taskNo = "task" + taskCount + "p" + phaseCount;
	document.getElementById(taskNo).style.backgroundColor = "";
	
	// grab the h1
	var timeDisplay = document.getElementById("time");
	
	// change value to 0:00
	timeDisplay.innerHTML = "25:00";
	document.getElementById("time").style.color = "var(--color_normal)";
	
	// Show Statistics
	AddGlobalStat();
	AddTaskStat();

	// add Continue button
	AddContinueButton();
	
	// rest title, Timer Focus, Break Count
	document.title = "Pomodoro Timer";
	timerCount = 1;
	focusCount = 0;
	breakCount = 0;

	// local Storage timestamp of StartCountdown
	localStorage.removeItem("timerStartTime");

	// set Favicon to original
	setFavicon(faviconClock);

	// show all continueCountdown throughout li
	var i;
	var x = document.getElementById("historyUl").querySelectorAll(".icon_btn");
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "";
	}
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

function continueCountdown(this_id) {
	// grab taskCount of the button
	var buttonNoPh = this_id;
	buttonNoPh = buttonNoPh.split("continueButton")[1];

	// grab task information
	var taskNo = "task" + buttonNoPh;
	var taskInfo = localStorage.getObj(taskNo);
	console.log(taskNo);
	console.log(localStorage.getObj(taskNo));
	
	// send taskValue to #focusTask
	var taskName = taskInfo.taskValue;
	document.getElementById("focusTask").innerHTML = taskName;
	
	// save last Task Count as previous Task Count
	var previousTaskCount = localStorage.getItem("taskCount");
	localStorage.setItem("previousTaskCount", previousTaskCount);

	// highlight task
	document.getElementById(taskNo).style.backgroundColor = "var(--background_color_z100)";
	
	// send timerCount, focusCount, breakCount then start Countdown
	taskCount = taskInfo.taskCount;
	timerCount = taskInfo.timerCount;
	focusCount = taskInfo.focusCount;
	breakCount = taskInfo.breakCount;
	phaseCount = taskInfo.phaseCount;


	// clear timer
	clearTimer();

	// start pomodoro
	focus25min();

	// every second, call the "tick" function
	intervalHandle = setInterval(tick, 500);

	// show focusTask, button area
	document.getElementById("focusArea").style.display = "";

	// hide input area
	document.getElementById("inputArea").style.display = "none";

	// set countArea message
	NowFocus();

	// hide all continueCountdown throughout li
	var i;
	var x = document.getElementById("historyUl").querySelectorAll(".icon_btn");
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
}

function createFocusTask() {
	// show focusHistory area if focusHistory is display none
	if (document.getElementById("focusHistory").style.display = "none") {
		document.getElementById("focusHistory").style.display = ""
	} else {}

	// get input value from inputTask input to focusTask div
	var taskName = getFocusTask();
	document.getElementById("focusTask").innerHTML = taskName;

	// add to Task History
	var ul = document.getElementById("historyUl");
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(taskName));
	li.setAttribute("id", "task"+taskCount+"p"+phaseCount);
	li.setAttribute("style", "background-color: var(--background_color_z100)")
	ul.appendChild(li);

	// add to Local Storage
	localStorage.setItem("taskCount", taskCount);
	setTaskInfo("taskValue", taskName);
}

function resetAllTasks() {
	clearInterval(intervalHandle);
	
	// clear all
	localStorage.clear();
	taskCount = "";
	clearTimer();
	var timeDisplay = document.getElementById("time");
	timeDisplay.innerHTML = "25:00";
	document.getElementById("time").style.color = "var(--color_normal)";
	
	// Get the ul and remove all child nodes
	var ul = document.getElementById("historyUl");
	while (ul.hasChildNodes()) {  
		ul.removeChild(ul.firstChild);
	}
	resetPage();
	
	// hide Task History
	// document.getElementById("focusHistory").style.opacity = 0;
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
=================== Theme ===================
*/

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


/*
=================== window.onload. Add Inputs, Buttons to DOM ===================
*/

window.onload = function () {

	// create input text box and give it an id of "task"
	var inputTask = document.createElement("input");
	inputTask.setAttribute("id", "task");
	inputTask.setAttribute("type", "text");
	inputTask.setAttribute("autocomplete", "off");
	inputTask.setAttribute("placeholder", "어떤 Task에 집중하나요?");

	//create start button
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

	// set favicion
	setFavicon(faviconClock);

	// Restore status before browser inactivity
	checkTaskList();
}