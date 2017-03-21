function Game() {
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
}
