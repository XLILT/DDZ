#!/usr/bin/env node

exports = module.exports = Game;

function Game(gate) {
	this.gate = gate;

	this.on_client_data = function(id, data) {
		console.log(data);
	};

	this.say_to_session = function(id, data) {
		this.gate.say_to_session(id, data);
	};
}

