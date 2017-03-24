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
			switch(data.error)
			{
			case 'login_error':
				$.cookie('uid', null);
				$.cookie('passwd', null);
				$.cookie('user_name', null);

				window.location.href = 'index.html';
				break;
			default:
			}
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
		case 'rate':
			game.set_rate(data.rate);
			break;
		case 'landlord_elected':
			game.landlord_elected(data.index);
			break;
		case 'player_gamble_score':
			game.set_player_gamble_score(data.index, data.score);
			break;
		case 'ready_to_play':
			game.ready_to_play(data.index, data.time);
			break;
		case 'play_poker':
			game.on_play_poker(data.index, data.pokers);
			break;
		default:
		};
	};

	this.login = function() {
		if(( $.cookie('uid') || $.cookie('uid') === 0)
			&& $.cookie('passwd')
			&& $.cookie('user_name')) {
			
			this.say_to_server({
				event: 'login',
				uid: $.cookie('uid'),
				passwd: $.cookie('passwd')
			});
		}
		else {
			$.cookie('uid', null);
			$.cookie('passwd', null);
			$.cookie('user_name', null);

			window.location.href = 'index.html';
		}
	};

	this.gamble_score = function(score) {
		this.say_to_server({
			event: 'gamble_score',
			score: score
		});
	};

	this.play_poker = function(pokers) {
		this.say_to_server({
			event: 'play_poker',
			pokers: pokers
		});
	};
}

