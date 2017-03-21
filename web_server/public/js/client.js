function Client(url) {
	this.url = url;

	this.socket = io(this.url);
	
	this.socket.on('data', (data) => {
		this.on_server_data(data);
	});

	this.say_to_server = function(data) {
		this.socket.emit('data', data);
	};

	this.on_server_data = function(data) {
		console.log(data);
	}
}

