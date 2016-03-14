/**
 * Created by gaappr on 3/11/16.
 */

var socket = io('http://localhost:1337');
socket.on('connect', function(data){

});

socket.on(events.modeChange,
	function(){
		var endGame = createDiv();
		appendMessage('Excellent! Note that the document is now in CMYK and has four color channels.', endGame);
		document.getElementById('feedback').appendChild(endGame);
	});

socket.on(events.loginVerified, function (data) {
	drawStage();
	startPolling();
});

function startPolling(){
	socket.emit(events.beginPoll,{});
	lesson1();
}

function lesson1(){
	clearStage();
	var lesson = createDiv();
	appendTitle('Changing the Mode', lesson);
	appendImage("images/lesson1.png", lesson);
	appendMessage('Change the color mode of the document to CMYK using the menu item indicated in the image.', lesson);
	document.getElementById('stage').appendChild(lesson);
}

function createDiv(){
	var learningDiv = document.createElement('div');
	learningDiv.className="stepDiv";
	return learningDiv;
}

function clearStage(){
	document.getElementById('stage').innerHTML = "";
}

function appendTitle(title, divLocation){
	var titleLoc = document.createElement('h1');
	var titleText = document.createTextNode(title);
	titleLoc.appendChild(titleText);
	divLocation.appendChild(titleLoc);
}

function appendMessage( msg, divLocation ){
	var info = document.createElement('p');
	info.appendChild(document.createTextNode(msg));
	divLocation.appendChild(info);
}

function appendImage( imgPath, divLocation ){
	var imageEle = document.createElement('img');
	imageEle.src = imgPath;
	imageEle.alt = "PhotoShop Instructions";
	divLocation.appendChild(imageEle);
}

function drawStage(){
	var body = document.getElementsByTagName('body')[0];
	var wrapper = document.createElement('div');
	wrapper.id = 'wrapper';

	var stage = document.createElement('div');
	stage.id = 'stage';
	wrapper.appendChild(stage);

	var feedback = document.createElement('div');
	feedback.id = 'feedback';
	wrapper.appendChild(feedback);

	var login = document.getElementById('login');
	body.removeChild(login);
	body.appendChild(wrapper);
}

var loginButton = document.getElementById('loginBtn');
loginButton.onclick = function() {
	socket.emit(events.loginAttempt,
		{
			username: document.getElementById('un').value
		}
	)
}
