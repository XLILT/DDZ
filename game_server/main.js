#!/usr/bin/env node

var readline = require('readline');
var GateServer = require('./gate');

const rl = readline.createInterface({
	input:process.stdin,
	output: process.stdout
});

var gate = new GateServer('0.0.0.0', 8888);
gate.init();

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

