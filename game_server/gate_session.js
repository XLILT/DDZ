#!/usr/bin/env node

var Session = require('./session');
var Conf = require('./conf');

exports = module.exports = GateSession;

function GateSession(id, socket, server) {
	Session.call(this, id, socket, server);

	this.next_package_len = 0;
	this.package_buf = Buffer.alloc(0);

	this.on_data = function(data) {
		if(Conf.is_debug) {
			console.log('session get:', data);
		}

		this.server.on_client_data(this.id, data);
		/*
		var buf = data;
		if(this.next_package_len === 0) {
			if(buf.length < 4) {
				return;
			}

			this.next_package_len = buf.readInt32BE();
			buf = buf.slice(4);

			if(Conf.is_debug) {
				console.log(this.next_package_len);
			}
		}
			
		var remain_len = this.next_package_len - this.package_buf.length;
		if (buf.length < remain_len) {
			this.package_buf = Buffer.concat([this.package_buf, buf]);
		}
		else {			
			this.package_buf = Buffer.concat([this.package_buf, buf.slice(0, remain_len)]);

			buf = buf.slice(remain_len);

			this.on_one_package_data(this.package_buf);
			this.package_buf = Buffer.alloc(0);
			this.next_package_len = 0;

			if(buf.length > 0) {
				this.on_data(buf);
			}
		}
		*/
	};

	/*
	this.on_one_package_data = function(package_buf) {
		var package_json = package_buf.toJSON();
		
		if(Conf.is_debug) {
			console.log(package_json);
		}
	};
	*/

	this.final = function() {
		this.socket.disconnect(true);
	};

	this.host = function() {
		//console.log(this.socket.handshake);
		return this.socket.handshake.address;
	};

	this.say_to_client = function(data) {
		this.socket.emit('data', data);
	};
}

