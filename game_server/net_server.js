#!/usr/bin/env node

var net = require('net');
var Session = require('./session')
var Conf = require('./conf')

exports = module.exports = NetServer;

function NetServer(host, port) {
	this.host = host;
	this.port = port;
	this.server = net.createServer();
	this.session_id = 1;
	this.session_map = {};

	this.server.on('connection', (socket) => {
		this.add_session(socket);
	});

	this.init = function() {
		this.server.listen(this.port, this.host, () => {
			console.log(`Server listening on ${this.server.address().address}:${this.server.address().port}`);
		});
	};

	this.final = function() {
		for(i in this.session_map) {
			this.session_map[i].final();
		}
		
		this.server.close(() => {
			console.log("Server closed.");
		});
	};

	this.create_session = function(id, socket) {
		return new Session(id, socket, this);
	}

	this.add_session = function(socket) {
		if(Conf.is_debug) {
			console.log(`${socket.remoteAddress}:${socket.remotePort} is connected.`);
		}

		this.session_map[this.session_id] = this.create_session(this.session_id, socket);
		this.session_id++;
	};

	this.remove_session = function(id) {
		this.session_map[id].final();
		delete this.session_map[id];
	};
}

