function Game() {
	this.base_score = 0;
	this.rate = 1;
	this.landlord_index = -1;
    this.last_player_index = 0;
    this.last_played_pokers = [];
    this.enemys = {};
    this.you = new You();

	this.set_your_index = function(index) {
		this.you.index = index;
	};

	this.set_players_portrait = function(users_portrait) {
        for(i = 0; i < users_portrait.length; i++) {
			if(users_portrait[i].index === this.you.index) {
				this.you.name = users_portrait[i].name;
				this.you.sex = users_portrait[i].sex;

				ui.show_my_portrait(this.you.name, this.you.sex);
			}
			else {
				var enemy = new Enemy();
				enemy.index = users_portrait[i].index;
				enemy.name = users_portrait[i].name;
				enemy.sex = users_portrait[i].sex;
				enemy.locate_position(this.you.index);

				this.enemys[enemy.index] = enemy;

				ui.show_enemy_portrait(enemy.position, enemy.name, enemy.sex);
			}
		}

		/*
		users_portrait.forEach((user_portrait) => {
			if(user_portrait.index === this.you.index) {
				this.you.name = user_portrait.name;
				this.you.sex = user_portrait.sex;

				ui.show_my_portrait(this.you.name, this.you.sex);
			}
			else {
				var enemy = new Enemy();
				enemy.index = user_portrait.index;
				enemy.name = user_portrait.name;
				enemy.sex = user_portrait.sex;
				enemy.locate_position(this.you.index);

				this.enemys[enemy.index] = enemy;

				ui.show_enemy_portrait(enemy.position, enemy.name, enemy.sex);
			}
		});
		*/
	};

	this.set_players_poker = function(pokers, players_poker_count) {
		this.you.hand_poker = [];

		for(i = 0; i < pokers.length; i++) {
			this.you.hand_poker.push(new Poker(pokers[i].id));
		}
		/*
		pokers.forEach((poker) => {
			this.you.hand_poker.push(new Poker(poker.id));
		});
		*/

		ui.show_my_hand_poker(Poker.sort(this.you.hand_poker).reverse());

		for(var index in players_poker_count) {
			if(this.enemys[index]) {
				this.enemys[index].hand_poker_count = players_poker_count[index];
			}
		}

		for(var index in this.enemys) {
			ui.show_enemy_hand_poker(this.enemys[index].position, this.enemys[index].hand_poker_count);
		}
	};

	this.try_gamble_score = function(index, time) {
		
		var position = '';
		if(index !== this.you.index) {
			position = this.enemys[index].position;
		}
		else {
			ui.show_gamble_score_bar();
		}

		ui.clock_time(position, time);
	};

	this.set_landlord_pokers = function(pokers) {
		var landlord_pokers = [];
		
		for(i = 0; i < pokers.length; i++) {
			landlord_pokers.push(new Poker(pokers[i].id));
		}

		/*
		pokers.forEach((poker) => {
			landlord_pokers.push(new Poker(poker.id));
		});
		*/

		ui.show_landlord_poker(landlord_pokers);
	};

	this.you_gamble_score = function(score) {
		this.you.gamble_score = score;
		client.gamble_score(score);
	};

	this.set_base_score = function(score) {
		this.base_score = score;
		ui.show_bscore(score);
	};

	this.set_rate = function(rate) {
		this.rate = rate;
		ui.show_rate(rate);
	};

	this.landlord_elected = function(index) {
		this.landlord_index = index;
		this.last_player_index = index;
		var name = index === this.you.index ? this.you.name : this.enemys[index].name;
		ui.show_tips(name + '成为地主，游戏即将开始');

		setTimeout(function() {
			ui.hide_gamble_score();
			ui.show_tool_bar(true);
		}, 2000);

		/*
		setTimeout(() => {
			ui.hide_gamble_score();
			ui.show_tool_bar(true);
		}, 2000);
		*/
	};

	this.set_player_gamble_score = function(index, score) {
		if(index === this.you.index) {
			ui.gamble_score(score);
		}
		else {
			ui.show_player_gamble_score(this.enemys[index].position, score);
		}
	};

	this.ready_to_play = function(index, time) {
		if(index === this.you.index) {
			ui.show_tool_bar();
			ui.clock_time('', time);

			setTimeout(function() {
				ui.show_tool_bar(true);
			}, time);

			/*
			setTimeout(() => {
				ui.show_tool_bar(true);
			}, time);
			*/
		}
		else {
			ui.clock_time(this.enemys[index].position, time);
		}
	};

	this.you_play = function(is_pass) {
		var cope_pokers = [], playing_pokers = [];
		if(is_pass) {
			if(this.last_player_index === this.you.index) {
				playing_pokers.push(Poker.sort(this.you.hand_poker)[0]);
			}
		}
		else {
			cope_pokers = this.last_played_pokers;
			playing_pokers = ui.get_selected_pokers();
		}

		if(PokerRule.could_play_poker(playing_pokers, cope_pokers)) {
			//console.log("could play");
			//this.you_play(playing_pokers);
			client.play_poker(playing_pokers);

			ui.show_tool_bar(true);
		}
		else {
			ui.show_tips("你选择的牌不符合规则");
		}

	};

	this.reselect_poker = function() {
		ui.reselect_poker();
	};

	this.on_play_poker = function(index, pokers) {
		var position = index === this.you.index ? '' : this.enemys[index].position;
		ui.stop_clock(position);

		var playing_pokers = [];

		for(i = 0; i < pokers.length; i++) {
			playing_pokers.push(new Poker(pokers[i].id));
		}
		/*
		pokers.forEach((poker) => {
			playing_pokers.push(new Poker(poker.id));
		});
		*/

		if(position === '') {
			ui.show_my_ground_poker(playing_pokers);
		}
		else {
			ui.show_enemy_ground_poker(position, playing_pokers);
		}

		if(playing_pokers.length > 0) {
			this.last_player_index = index;
			this.last_played_poker = playing_pokers;
		}
	};
    
}
