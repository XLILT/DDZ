#!/usr/bin/env node

//var NetServer = require('./net_server');
var SockIONetServer = require('./net_server_with_socket_io');
var GateSession = require('./gate_session');

exports = module.exports = GateServer;

function GateServer(host, port) {
	SockIONetServer.call(this, host,  port);
	this.game = null;

	this.create_session = function(id, socket) {
		return new GateSession(id, socket, this);
	};

	this.on_client_data = function(id, data) {
		this.game.on_client_data(id, data);
	};

	this.say_to_session = function(id, data) {
		this.session_map[id].say_to_client(data);
	};

	this.bind_game = function(game) {
		this.game = game;	
	};
}

