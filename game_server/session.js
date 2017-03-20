#!/usr/bin/env node

var Conf = require('./conf');

exports = module.exports = Session;

function Session(id, socket, server) {
	this.id = id;
	this.socket = socket;
	this.server = server;

	this.socket.on('error', (error) => {
		if(Conf.is_debug) {
			console.log(error);
		}
	});

	this.socket.on('end', () => {
		if(Conf.is_debug) {
			console.log(`end ${this.socket.remoteAddress}:${this.socket.remotePort}`);
		}
	});

	this.socket.on('close', (had_error) => {
		if(Conf.is_debug) {
			console.log(`close ${this.socket.remoteAddress}:${this.socket.remotePort} with had_error:${had_error}`);
		}

		this.server.remove_session(this.id);
	});

	this.socket.on('timeout', () => {
		this.server.remove_session(this.id);
	});

	this.socket.on('data', (data) => {
		this.on_data(data);
	});

	this.final = function() {
		this.socket.destroy();
	};

	this.on_data = function(data) {
		if(Conf.is_debug) {
			 console.log(`session on data ${data}`);
		}
	};
}

