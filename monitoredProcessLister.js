var zmq = require('zmq');
var fs = require('fs');
var _ = require('underscore');
var argv = require('optimist')
.default({
	bind: 'tcp://*:5555',
	tmpFolder: '/tmp/process-manager/'
}).argv;


var publisher = zmq.socket('pub');
publisher.bind(argv.bind, function(error) {
	if(error) {
		console.log(error);
		process.exit(0);
	}
	else {
		console.log("Binding on " + argv.bind);
	}
});

var getMonitoredProcesses = function(sendList) {
	var mainDir = argv.tmpFolder;
	var apps = [];

	var readDir = function(done, folder) {
		if(folder == undefined) {
			folder = "";
		}
		fs.readdir(mainDir + folder, function(error, dirContent) {
			if (error) {
				console.log(error);
			}
			done(dirContent);
		});
	};

	var createTree = function(folders) {
		_.each(folders, function(folder) {
			readDir(function(fileNames) {
				apps.push({id: folder, pids: fileNames});								
			}, folder);
		});
	};
	
	readDir(function(folders) {
		createTree(folders);
	});

	setTimeout(function() {
		sendList(apps);
	}, 5000);
	
};

setInterval(function() {
	getMonitoredProcesses(function(monitoredList) {
		publisher.send(JSON.stringify(monitoredList));
	});
}, 60000);
