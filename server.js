
//load express, needed for node
var express = require('express');

var app = express();

(function(){

    var originallog = console.log;

    console.log = function(txt) {
        if(io && io.sockets)
        {
        	io.sockets.emit('console', txt);
        }
        originallog.apply(console, arguments);
    }

})();



var fs= require('fs');

//load webserver
eval(fs.readFileSync('http.js')+'');
//load websockets
eval(fs.readFileSync('socket.js')+'');
	
	


//CLEAN UP ON EXIT OR ERROR!
process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
	if (options.exception) console.log('server exception');
    if (options.cleanup) console.log('server stopped');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true, exception: true}));