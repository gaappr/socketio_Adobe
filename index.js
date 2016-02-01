//Dealing with messages from Photoshop
var appAdobe = require('express')();
var serverAdobe = require('http').Server(appAdobe);
var ioAdobe = require('socket.io')(serverAdobe);

//Dealing with messages to and from the browser
var appBrowser = require('express')();
var serverBrowser = require('http').Server(appBrowser);
var ioBrowser = require('socket.io')(serverBrowser);

var fs = require('fs');

serverAdobe.listen(45063)
serverBrowser.listen(1337);

var browserSocket, adobeSocket;

/***********
* Setting up the necessary routing
************/
appBrowser.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html'); 
});

appBrowser.get('/socket.io.js', function(req,res){
    res.sendFile(__dirname + '/node_modules/socket.io/node_modules/socket.io-client/socket.io.js');
});

appBrowser.get('/style.css', function(req,res){
   res.sendFile(__dirname + '/style.css'); 
});

appBrowser.get('/images/lesson1.png', function(req, res){
    res.sendFile(__dirname + '/images/lesson1.png');
});

/***********
* Working with the events to/from Adobe
************/
ioAdobe.on('connection', function (socket) {
    adobeSocket = socket;
    socket.emit('connect', { connection: 'adobe' });
    socket.on('clicked', function (data) {
        console.log("A button was clicked.");
        browserSocket.emit('Bclick', {msg:'hello!'});
    });
    
    socket.on('modeChanged',
        function(){
            browserSocket.emit('pollForMode',{});
        });
});

/***********
* Working with the events to/from the browser
************/
ioBrowser.on('connection',function(socket){
    browserSocket = socket;
    socket.emit('connect',{connection:'browser'});
    socket.on('beginPoll',
        function(){
            ioAdobe.emit('beginPoll',{});
    });
});