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
		users_portrait.forEach((user_portrait) => {
			if(user_portrait.index === this.you.index) {
				this.you.name = user_portrait.name;
				this.you.sex = user_portrait.sex;

				UI.show_my_portrait(this.you.name, this.you.sex);
			}
			else {
				var enemy = new Enemy();
				enemy.index = user_portrait.index;
				enemy.name = user_portrait.name;
				enemy.sex = user_portrait.sex;
				enemy.locate_position(this.you.index);

				this.enemys[enemy.index] = enemy;

				UI.show_enemy_portrait(enemy.position, enemy.name, enemy.sex);
			}
		});
	};

	this.set_players_poker = function(pokers, players_poker_count) {
		this.you.hand_poker = [];
		pokers.forEach((poker) => {
			this.you.hand_poker.push(new Poker(poker.id));
		});

		UI.show_my_hand_poker(Poker.sort(this.you.hand_poker).reverse());

		for(var index in players_poker_count) {
			if(this.enemys[index]) {
				this.enemys[index].hand_poker_count = players_poker_count[index];
			}
		}

		for(var index in this.enemys) {
			UI.show_enemy_hand_poker(this.enemys[index].position, this.enemys[index].hand_poker_count);
		}
	};

	this.try_gamble_score = function(index, time) {
		
		var position = '';
		if(index !== this.you.index) {
			position = this.enemys[index].position;
		}
		else {
			UI.show_gamble_score_bar();
		}

		UI.clock_time(position, time);
	};

	this.set_landlord_pokers = function(pokers) {
		var landlord_pokers = [];
		pokers.forEach((poker) => {
			landlord_pokers.push(new Poker(poker.id));
		});

		UI.show_landlord_poker(landlord_pokers);
	};

	this.you_gamble_score = function(score) {
		this.you.gamble_score = score;
		client.gamble_score(score);
	};

	this.set_base_score = function(score) {
		this.base_score = score;
		UI.show_bscore(score);
	};

	this.set_rate = function(rate) {
		this.rate = rate;
		UI.show_rate(rate);
	};

	this.landlord_elected = function(index) {
		this.landlord_index = index;
		var name = index === this.you.index ? this.you.name : this.enemys[index].name;
		UI.show_tips(name + '成为地主，游戏即将开始');

		setTimeout(() => {
			UI.hide_gamble_score();
			UI.show_tool_bar(true);
		}, 3000);
	};

	this.set_player_gamble_score = function(index, score) {
		if(index === this.you.index) {
			UI.gamble_score(score);
		}
		else {
			UI.show_player_gamble_score(this.enemys[index].position, score);
		}
	};
}
