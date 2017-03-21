#!/usr/bin/env node

var readline = require('readline');
var GateServer = require('./gate');
var Game = require('./game');

const rl = readline.createInterface({
	input:process.stdin,
	output: process.stdout
});

var gate = new GateServer('0.0.0.0', 8888);
gate.init();

var game = new Game(gate);

gate.bind_game(game);

rl.on('line', (input) => {
	switch(input)
	{
	case 'stop':
		gate.final();
		rl.close();
		break;
	default:
	}
});

