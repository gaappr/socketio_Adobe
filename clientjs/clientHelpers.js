/**
 * Created by gaappr on 3/11/16.
 */

var socket = io('http://localhost:1337');
socket.on('connect', function(data){
	console.log('here!')
	console.log(data);
});

socket.on('pollForMode',
	function(){
		var endGame = createDiv();
		appendMessage('Excellent! Note that the document is now in CMYK and has four color channels.', endGame);
		document.getElementById('feedback').appendChild(endGame);
	});

socket.on('loginVerified', function (data) {
	theButton = document.createElement('button');
	theButton.appendChild(document.createTextNode('Begin Lesson 1') );
	theButton.onclick = function(){ startPolling() };
	document.getElementById('stage').appendChild(theButton);
});

function startPolling(){
	socket.emit('beginPoll',{});
	lesson1();
}

function lesson1(){
	clearStage();
	var lesson = createDiv();
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
