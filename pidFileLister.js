var _ = require('underscore');
var fs = require('fs');

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
}, 5000);
