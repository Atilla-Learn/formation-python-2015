// This is the server-side file of our mobile remote controller app.
// It initializes socket.io and a new express instance.
// Start it by running 'node app.js' from your terminal.


// Creating an express server

var express = require('express'),
app = express();

// This is needed if the app is run on heroku and other cloud providers:

var port = process.env.PORT || 8080;

// Initialize a new socket.io object. It is bound to
// the express app, which allows them to coexist.

var io = require('socket.io').listen(app.listen(port));


// App Configuration

// Make the files in the public folder available to the world
app.use(express.static(__dirname + '/public'));


// This is a secret key that prevents others from opening your presentation
// and controlling it. Change it to something that only you know.

var secret = 'kittens';

var presentation = io.on('connection', function (socket) {
	socket.on('load', function(data){
		socket.emit('access', {
			access: (data.key === secret ? "granted" : "denied")
		});
	});

	socket.on('navigate-change', function(data) {
		if (data.key === secret) {
			presentation.emit('navigate', {
				next: data.next,
				click: true
			});
		}
	})

	socket.on('hash-change', function(data){
		if (data.key === secret) {
			presentation.emit('navigate', {
				hash: data.hash,
				click: false
			});
		}
	});
});

console.log('Your presentation is running on http://localhost:' + port);
