function Client(url) {
	this.url = url;

	this.socket = io(this.url);
	
	this.socket.on('data', (data) => {
		this.on_server_data(data);
	});

	this.socket.on('disconnect', () => {
		this.socket.close();
	});

	this.say_to_server = function(data) {
		this.socket.emit('data', data);
	};

	this.on_server_data = function(data) {
		if(data.error) {
			console.error(data);
			return;
		}
		else {
			console.log(data);
		}

		switch(data.event)
		{
		case 'login_success':
			game.set_your_index(data.index);
			break;
		case 'players_portrait':
			game.set_players_portrait(data.users_data);
			break;
		case 'hand_pokers':
			game.set_players_poker(data.pokers, data.players_poker_count);
			break;
		case 'gamble_score':
			game.try_gamble_score(data.index, data.time);
			break;
		case 'landlord_pokers':
			game.set_landlord_pokers(data.pokers);
			break;
		case 'base_score':
			game.set_base_score(data.base_score);
			break;
		default:
		};
	};

	this.login = function() {
		this.say_to_server({
			event: 'login',
			uid: 1,
			passwd: $.md5('123456')
		});
	};

	this.gamble_score = function(score) {
		this.say_to_server({
			event: 'gamble_score',
			score: score
		});
	}
}

