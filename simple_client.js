var zmq = require('zmq');
var requester = zmq.socket('req');

requester.on('message', function(reply) {
	console.log('monitored process list ' + reply.toString());
	requester.close();
});

requester.connect('tcp://localhost:5555');

requester.send("get process list");
