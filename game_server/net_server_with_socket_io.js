#!/usr/bin/env node

var Http = require('http');
var SocketIO = require('socket.io');
var Conf = require('./conf');

exports = module.exports = SockIONetServer;

function SockIONetServer(host, port) {
	this.host = host;
	this.port = port;
	this.http_server = Http.createServer();
	this.io = SocketIO(this.http_server);
	this.session_id = 1;
	this.session_map = {};
	
	this.io.on('connection', (socket)  => {
		this.add_session(this.create_session(this.session_id++, socket));
	});

	this.init = function() {
		//this.io.listen(this.port);
		//console.log(`Server now listenning on ${this.port}`);

		this.http_server.listen(this.port, this.host, () => {
		//this.http_server.listen(this.port, () => {
			console.log(`Server now listenning on ${this.http_server.address().address}:${this.http_server.address().port}`);
		});
	};

	this.final = function() {
		for(i in this.session_map) {
			this.remove_session(this.session_map[i].id);
		}
		
		this.io.close(() => {
			console.log(`io server closed`);
		});
	};

	this.create_session = function(id, socket) {
		return new Session(id, socket, this);
	};

	this.add_session = function(session) {
		if(Conf.is_debug) {
			console.log(`${session.host()} is connected.`);
		}

		this.session_map[session.id] = session;
	};

	this.remove_session = function(id) {
		this.session_map[id].final();
		delete this.session_map[id];
	};
}

