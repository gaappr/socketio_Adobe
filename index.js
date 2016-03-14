var loginWrangler = require('./js/loginwrangler.js');
var events = require('lpevents');
var appAdobe = require('express')();
var serverAdobe = require('http').Server(appAdobe);
var ioAdobe = require('socket.io')(serverAdobe);
var bodyParser = require('body-parser');
appAdobe.use( bodyParser.urlencoded( {extended:true} ) );

//Dealing with messages to and from the browser
var appBrowser = require('express')();
var serverBrowser = require('http').Server(appBrowser);
var ioBrowser = require('socket.io')(serverBrowser);

serverAdobe.listen(45063);
serverBrowser.listen(1337);

var fs = require('fs');


var browserSocket, adobeSocket;

/***********
* Setting up the necessary routing for the browser
************/
appBrowser.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html'); 
});

appBrowser.get('/socket.io.js', function(req,res){
    res.sendFile(__dirname + '/node_modules/socket.io/node_modules/socket.io-client/socket.io.js');
});

appBrowser.get('/style.css', function(req,res){
   res.sendFile(__dirname + '/css/style.css'); 
});

appBrowser.get('/images/lesson1.png', function(req, res){
    res.sendFile(__dirname + '/images/lesson1.png');
});

appBrowser.get('/clientHelpers.js', function(req,res){
	res.sendFile(__dirname + '/clientjs/clientHelpers.js');
});

appBrowser.get('/events.js', function(req,res){
	res.sendFile(__dirname + '/node_modules/lpevents/events.js');
});


/***********
* Working with the events to/from Adobe
************/
ioAdobe.on('connection', function (socket) {
    console.log('Adobe Connection');
    adobeSocket = socket;
    adobeSocket.emit(events.connect, { connection: 'adobe' });
    
    adobeSocket.on(events.modeChange,
        function(data){
            browserSocket.emit(events.modeChange,{});
        });

    adobeSocket.on(events.loginAttempt,
        function(data) {
            if(loginWrangler.checkLogin(data.username)){
                console.log('Adobe username verified: ' + data.username);
                adobeSocket.emit(events.loginVerified);
            }
            else{
                console.log('Adobe login failed!');
	            adobeSocket.emit(events.loginFailure);
            }
        });
});

/***********
* Working with the events to/from the browser
************/
ioBrowser.on('connection',function(socket){
    console.log('Browser Connection')
    browserSocket = socket;
    browserSocket.emit(events.connect,{connection:'browser'});

	browserSocket.on(events.beginPoll,
        function(){
            ioAdobe.emit(events.beginPoll,{});
    });

	browserSocket.on(events.loginAttempt, function(data){
		if(loginWrangler.checkLogin(data.username)){
			console.log('Browser username verified: ' + data.username);
			browserSocket.emit(events.loginVerified);
		}
		else{
			browserSocket.emit(events.loginFailure);
		}
	});
});