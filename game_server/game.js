#!/usr/bin/env node

var Conf = require('./conf');
var Dao = require('./dao');

exports = module.exports = Game;

function Game(gate) {
	const MAX_PLAYER_COUNT = 3;

	this.gate = gate;
	this.player_count = 0;
	this.remain_index = [0, 1 ,2];
	this.session_map = {};
	this.uid_map = {};
	this.dao = new Dao(Conf.user_db.host, Conf.user_db.port, Conf.user_db.user, Conf.user_db.passwd);

	
	this.on_client_data = function(id, data) {
		switch(data['event'])
		{
		case 'login':
			this.on_login(id, data);
			break;
		default:
		}
	};

	this.on_login = function(id, data) {
		if(this.palyer_count >= MAX_PLAYER_COUNT) {
			if(!this.uid_map[data.uid]) {
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

	this.add_player = function(session_id, user_data) {
		if(this.uid_map[user_data.uid]) {
			this.remain_index.unshift(this.session_map[this.uid_map[user_data.uid]].index);
			delete this.session_map[this.uid_map[user_data.uid]];
			this.player_count--;
		}

		var user_data_ext = {};
		user_data_ext.name = user_data.name;
		user_data_ext.session_id = session_id;
		user_data_ext.index = this.remain_index.shift();

		this.session_map[session_id] = user_data_ext;
		this.uid_map[user_data.uid] = session_id;
		this.player_count++;

		this.say_to_session(session_id, {event: 'login_success', index: user_data_ext.index});

		if(this.player_count >= MAX_PLAYER_COUNT) {
			this.start_game();
		}
	};

	this.start_game = function() {
		this.set_players_portrait();
	};

	this.set_players_portrait = function() {
		var users_data = [];
		for(i in this.session_map) {
			var user_data = {};
			user_data.index = this.session_map[i].index;
			user_data.name = this.session_map[i].name;
			user_data.sex = this.session_map[i].sex ? this.session_map[i].sex : 'male';

			users_data.push(user_data);
		}

		for(i in this.session_map) {
			this.say_to_session(this.session_map[i].session_id, {event: 'players_portrait', users_data: users_data});
		}
	}

	this.say_to_session = function(id, data) {
		this.gate.say_to_session(id, data);
	};
}

