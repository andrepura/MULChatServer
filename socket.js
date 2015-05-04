var io = require('socket.io')(http);
var validator = require('validator');

var history = [];

// event when new client connects - until he doesn't ask for data - server does nothing
io.sockets.on('connection',	function(socket) {
	console.log('client connected ' + socket.id );
	
	socket.on('disconnect', function() {
		console.log('client disconnected ' + socket.id);

	});
	socket.on('chat', function(data) {
		console.log('client ' + socket.id + ' chat '+JSON.stringify(data));
		
		if(!data){	
			console.log('client ' + socket.id + ' ERROR: '+"no data object available or null");
			socket.emit("chaterror",{"msg":"no data object available or null"});
			return;
		}
		if(!data.sender){
			console.log('client ' + socket.id + ' ERROR: '+"no sender object available or null");
			socket.emit("chaterror",{"msg":"no sender object available or null"});
			return;
		}
		if(!data.sender.sid || !validator.isUUID(data.sender.sid)){
			console.log('client ' + socket.id + ' ERROR: '+"uuid in sid is not valid: "+data.sender.sid);
			socket.emit("chaterror",{"msg":"uuid in sid is not valid: "+data.sender.sid});
			return;
		}
		if(!data.sender.name){
			console.log('client ' + socket.id + ' ERROR: '+"sender name not set");
			socket.emit("chaterror",{"msg":"sender name not set"});
			return;
		}
		if(!validator.isLength(data.sender.name,1,64)){
			console.log('client ' + socket.id + ' ERROR: '+"sender name is not between 1 and 64 characters: "+data.sender.name.length);
			socket.emit("chaterror",{"msg":"sender name is not between 1 and 64 characters: "+data.sender.name.length});
			return;
		}
		if(data.sender.color){
			
			if(data.sender.color[0] !== "#" || !validator.isHexColor(data.sender.color)){
				console.log('client ' + socket.id + ' ERROR: '+"sender color is not in hex, format: #RRGGBB");
				socket.emit("chaterror",{"msg":"sender color is not in hex"});
				return;	
			}
		}
		
		if(data.msg){
			if(!validator.isLength(data.msg,1,164)){
				console.log('client ' + socket.id + ' ERROR: '+"msg is not between 1 and 164 characters: "+data.msg.length);
				socket.emit("chaterror",{"msg":"msg is not between 1 and 164 characters: "+data.msg.length});
				return;
			}
		}
		
		if(data.location){
			if(!data.location.lat){
				console.log('client ' + socket.id + ' ERROR: '+"location lat not set");
				socket.emit("chaterror",{"msg":"location lat not set"});
				return;
			}
			if(!data.location.lon){
				console.log('client ' + socket.id + ' ERROR: '+"location lon not set");
				socket.emit("chaterror",{"msg":"location lon not set"});
				return;
			}
			if(!validator.isNumeric(data.location.lat)){
				console.log('client ' + socket.id + ' ERROR: '+"location lat is not numeric");
				socket.emit("chaterror",{"msg":"location lat is not numeric"});
				return;
			}
			if(!validator.isNumeric(data.location.lon)){
				console.log('client ' + socket.id + ' ERROR: '+"location lon is not numeric");
				socket.emit("chaterror",{"msg":"location lon is not numeric"});
				return;
			}
		}
		
		//generate MID & timestamp
		data.mid = guid();
		data.timestamp = parseInt(new Date().getTime()/1000.0);
		
		history = [data].concat(history);
		while(history.length > 100){
			history.splice(-1,1);
		}
		io.sockets.emit("chat",data);
	});
	
	console.log("send cached history ("+history.length+") to "+socket.id);
	history.forEach(function(data, i) {
		
		socket.emit("chat",data);
	});
});

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16)
				.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4()
			+ s4() + s4();
}