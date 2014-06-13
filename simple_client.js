var zmq = require('zmq');
var subscriber = zmq.socket('sub');

subscriber.on('message', function(msg) {
	console.log('process list ' + msg.toString());
});

subscriber.connect('tcp://localhost:5555');
subscriber.subscribe('');
console.log('listening port 5555');
