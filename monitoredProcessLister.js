var zmq = require('zmq');
var fs = require('fs');
var _ = require('underscore');

var responder = zmq.socket('rep');

responder.on('message', function(request) {
	console.log('request from client: ' + request.toString());
	
	getMonitoredProcesses(function(monitoredList) {		
		responder.send(JSON.stringify(monitoredList));
	});
	
});

responder.bind('tcp://*:5555', function(error) {
	if(error) {
		console.log(error);
	}
	else {
		console.log("Listening port 5555...");
	}
});

var getMonitoredProcesses = function(sendList) {
	var mainDir = '/tmp/process-manager';
	var apps = [];

	fs.readdir(mainDir, function(error, folders) {
		if (error) {
			console.log(error);
		}
		createTree(folders);
	});

	var createTree = function(folders) {
		_.each(folders, function(folder) {
			readFileNames(folder,function(folderName, fileNames) {
				apps.push({id: folderName, pids: fileNames});								
			});
		});
	};

	var readFileNames = function(folderName, done) {
		fs.readdir(mainDir + '/' + folderName, function(error, fileNames) {
			if (error) {
				console.log(error);
			}
			done(folderName, fileNames);
		});
	};

	setTimeout(function() {
		console.log(apps);
		sendList(apps);
	}, 3000);
};
