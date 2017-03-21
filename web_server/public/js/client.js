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

}

