#!/usr/bin/env node

var Conf = require('./conf');
var Dao = require('./dao');
var Poker = require('./poker');
var Player = require('./player');

exports = module.exports = Game;

function Game(gate) {
	const MAX_PLAYER_COUNT = 3;

	this.gate = gate;
	this.player_count = 0;
	this.remain_index = [0, 1 ,2];
	this.session_index_map = {};
	this.uid_index_map = {};
	this.index_player_map = {};
	this.last_play_player_index = -1;
	this.base_score = 0;
	this.rate = 1;
	this.landlord_index = -1;
	this.timer_gamble_score = 0;
	this.gamble_score_player_index = -1;

	this.dao = new Dao(Conf.user_db.host, Conf.user_db.port, Conf.user_db.user, Conf.user_db.passwd);
	this.landlord_pokers = [];
	
	this.on_client_data = function(id, data) {
		switch(data['event'])
		{
		case 'login':
			this.on_login(id, data);
			break;
		case 'gamble_score':
			this.on_gamble_score(id, data);
			break;
		default:
		}
	};

	this.on_login = function(id, data) {
		if(this.palyer_count >= MAX_PLAYER_COUNT) {
			if(!this.uid_index_map.hasOwnProperty(data.uid)) {
				return;
			}
		}

		this.dao.get_user_by_id(data.uid, (err, rows) => {
			if(err) {
				this.say_to_session(id, {error: 'db error'});
			}
			else {
				if(rows.length === 1) {
					if(rows[0].passwd === data.passwd)	{
						
						this.add_player(100, {'uid': 100, 'name': 'player100'});
						this.add_player(200, {'uid': 200, 'name': 'player200'});

						var user_data = {};
						user_data.name = rows[0].name;
						user_data.uid = rows[0].id;

						this.add_player(id, user_data);
					}
					else {
						this.say_to_session(id, {error: 'passwd not incorrect'});
					}
				}
				else {
					this.say_to_session(id, {error: 'db error'});
				}
			}
		});
	};

	this.on_gamble_socre = function(id, data) {
		if(this.gamble_score_player_index === -2) {
			return;
		}	

		if(this.session_index_map.hasOwnProperty(id) && this.session_index_map[id] === this.gamble_score_player_index) {
			if(data.score === 3) {
				this.base_score = 3;
				this.landlord_index = this.session_index_map[id];
				this.index_player_map[this.session_index_map[id]].is_landlord = true;

				clearTimeout(this.timer_gamble_score);
				this.gamble_socre_over();
			}
			else if(data.score >= 0 && data.score < 3) {
				if(this.base_score < data.score) {
					this.base_score = data.score;
					this.landlord_index = this.session_index_map[id];
				}
			}
		}
	};

	this.add_player = function(session_id, user_data) {
		var player_index = 0;
		var start_game = false;
		if(this.uid_index_map.hasOwnProperty(user_data.uid)) {
			player_index = this.uid_index_map[user_data.uid];
			this.index_player_map[player_index].session_id = session_id;
		}
		else {
			var player = new Player();
			player.index = this.remain_index.shift();
			player_index = player.index;
			player.session_id = session_id;
			player.uid = user_data.uid;
			player.name = user_data.name;
			player.sex = user_data.sex ? user_data.sex : 'male';

			this.index_player_map[player.index] = player;
			this.session_index_map[player.session_id] = player.index;
			this.uid_index_map[player.uid] = player.index;
			this.player_count++;

			if(this.player_count === MAX_PLAYER_COUNT) {
				start_game = true;
			}
		}

		this.say_to_session(session_id, {event: 'login_success', index: player_index});
		this.sync_players_portrait_to_all();

		
	
		if(start_game) {
			this.start_game();
		}
		else {
			if(this.player_count >= MAX_PLAYER_COUNT) {
				this.sync_players_poker_to_all();
			}
			
			if(this.gamble_score_player_index === -2) {
				this.sync_landlord_pokers_to_all();
				this.sync_base_score_to_all();
			}			
		}

			};

	this.start_game = function() {
		this.init_pokers();
		this.sync_players_poker_to_all();

		this.ready_to_gamble_score();
	};

	this.sync_players_portrait_to_all = function() {
		var users_data = [];
		for(var i in this.index_player_map) {
			var user_data = {};
			user_data.index = this.index_player_map[i].index;
			user_data.name = this.index_player_map[i].name;
			user_data.sex = this.index_player_map[i].sex;

			users_data.push(user_data);
		}

		this.say_to_all_session({event: 'players_portrait', users_data: users_data});
	};

	this.init_pokers = function() {
		const EACH_PLAYER_POKER_COUNT = 17;

		var pokers_deck = Poker.shuffle();
		for(var i in this.index_player_map)	{
			this.index_player_map[i].hand_pokers = 	pokers_deck.splice(0, EACH_PLAYER_POKER_COUNT);
		}

		this.landlord_pokers = pokers_deck.slice();
		//this.landlord_pokers = pokers_deck;
	};

	this.sync_players_poker_to_all = function() {
		var players_poker_count = {};
		for(var i in this.index_player_map) {
			players_poker_count[i] = this.index_player_map[i].hand_pokers.length;
		}

		for(var i in this.index_player_map) {
			this.say_to_session(this.index_player_map[i].session_id, {event: 'hand_pokers', pokers: this.index_player_map[i].hand_pokers,
				players_poker_count: players_poker_count});
		}
	};

	this.ready_to_gamble_score = function() {
		if(this.landlord_index >= 0 && this.landlord_index <= 2) {
			this.gamble_score_player_index = this.landlord_index;
		}
		else {
			this.gamble_score_player_index = parseInt(Math.random() * 3);
		}
		
		this.gamble_score_with_current_player();
	};

	this.gamble_score = function(score) {
		if(this.gamble_score_player_index < 0 || this.gamble_score_player_index > 2) {
			return;
		}

		if(this.base_score < score) {
			this.base_score = score;
			this.landlord_index = this.gamble_score_player_index;
		}

		this.index_player_map[this.gamble_score_player_index].has_gamble_score = true;

		var next_gamble_index = this.gamble_score_player_index + 1 >= 3 ? 0 : this.gamble_score_player_index + 1;
		if(this.index_player_map[next_gamble_index].has_gamble_score || score === 3) {
			this.begin_to_play_poker();
		}
		else {
			this.gamble_score_player_index = next_gamble_index;
			this.gamble_score_with_current_player();
		}
	};

	this.gamble_score_with_current_player = function() {
		var timeout = 5000;
		this.say_to_session(this.index_player_map[this.gamble_score_player_index].session_id, {event: 'gamble_score', index: this.gamble_score_player_index, time: timeout});

		this.timer_gamble_score = setTimeout(() => {
			this.gamble_score(0);
			this.timer_gamble_score = 0;
		}, timeout);
	};

	this.begin_to_play_poker = function() {
		if(this.base_score <= 0) {
			this.game_over();
			return;
		}

		this.gamble_score_player_index = -2;

		this.index_player_map[this.landlord_index].is_landlord = true;
		this.index_player_map[this.landlord_index].sex = 'landlord';
		this.index_player_map[this.landlord_index].hand_pokers = this.index_player_map[this.landlord_index].hand_pokers.concat(this.landlord_pokers);

		this.sync_players_portrait_to_all();
		this.sync_players_poker_to_all();
		this.sync_base_score_to_all();
		this.sync_landlord_pokers_to_all();
		
		this.ready_to_play_poker(this.landlord_index);
	};

	this.on_gamble_score = function(id, data) {
		if(this.gamble_score_player_index !== this.session_index_map[id]) {
			return;
		}

		this.gamble_score(data.score);
		clearTimeout(this.timer_gamble_score);
	};

	this.ready_to_play_poker = function(index) {
	};

	this.sync_rate_to_all = function() {
		this.say_to_all_session({event: 'rate', rate: this.rate});
	};

	this.sync_base_score_to_all = function() {
		this.say_to_all_session({event: 'base_score', base_score: this.base_score});
	};

	this.sync_landlord_pokers_to_all = function() {
		this.say_to_all_session({event: 'landlord_pokers', pokers: this.landlord_pokers});
	};

	this.game_over = function() {

	};

	this.say_to_session = function(id, data) {
		this.gate.say_to_session(id, data);
	};
	
	this.say_to_all_session = function(data) {
		for(i in this.index_player_map) {
			this.say_to_session(this.index_player_map[i].session_id, data);
		}
	};
}

