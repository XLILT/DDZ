#!/usr/bin/env node

var NetServer = require('./net_server');
var GateSession = require('./gate_session');

exports = module.exports = GateServer;

function GateServer(host, port) {
	NetServer.call(this, host,  port);

	this.create_session = function(id, socket) {
		return new GateSession(id, socket, this);
	};
}

