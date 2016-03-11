//Dealing with messages from Photoshop
var loginWranger = require('./js/loginwrangler.js');
var events = require('./js/events.js');
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


/***********
* Working with the events to/from Adobe
************/
ioAdobe.on('connection', function (socket) {
    console.log('Adobe Connection');
    adobeSocket = socket;
    adobeSocket.emit(events.connect, { connection: 'adobe' });
    
    adobeSocket.on('modeChanged',
        function(data){
            browserSocket.emit(events.pollForMode,{});
        });

    adobeSocket.on('loginAttempt',
        function(data) {
            if(loginWranger.checkLogin(data.username)){
                console.log('username verified');
                adobeSocket.emit(events.loginVerified);
                browserSocket.emit(events.loginVerified);
            }
            else{
                console.log('login failed!');
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
    browserSocket.on('beginPoll',
        function(){
            ioAdobe.emit(events.beginPoll,{});
    });
});