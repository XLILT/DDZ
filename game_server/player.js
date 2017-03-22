#!/usr/bin/env node

exports = module.exports = Player;

function Player() {
	this.index = 0;
	this.session_id = 0;
	this.uid = 0;
	this.name = '';
	this.sex = '';

	this.has_gamble_score = false;

	this.is_landlord = false;
	this.hand_pokers = [];
	this.last_ground_pokers = [];
}

