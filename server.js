//import all the modules
var express = require('express');
var app = express();
var server = require('http').Server(app);
var jade = require('jade');
var io = require('socket.io')(server);

//port and network ip of server
var networkIp = require('my-local-ip')();
var port = 3000;

//serve static files from 'public' folder
app.use(express.static('public'));

//start listening on port 3000 @ localhost
server.listen(port, function(){
	console.log('Server running on port: 3000');
});

//base route
app.get('/', function (req, res, next) {
	
	//generate "random" id for the socket.io room
	var id = require('./libs/randomstring')(10);

	//socket.io room
	var room = io.of('/' + id);

	//add event listeners to sockets
	room.on('connection', function(socket){
		
		//ready flag
		var ready = false;
		
		//tilt event
		socket.on('tilt', function (data) {
			if(!ready){
				room.emit('connected');
				ready = true;
				console.log('user connected!');
			}
			room.emit('moveStar', data);
		});

		//disconnection event handler
		socket.on('disconnect', function(){
			if(ready) {
				room.emit('disconnected');
				ready = false;
			}
			console.log('user disconnected!');
		});
	
	});
		
	//render game view
	res.send(jade.compileFile(__dirname + '/views/game.jade')({
		id: id,
		title: 'Newtonian-paintbrush',
		host: networkIp,
		port: port
	}));

});

//game's route
app.get('/:id', function(req, res, next){
	
	//render controller's view
	res.send(jade.compileFile(__dirname + '/views/controller.jade')({
		id: req.params.id,
		title: 'Controller',
		host: networkIp,
		port: port
	}));

});