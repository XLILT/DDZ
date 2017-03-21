#!/usr/bin/env node

var mysql = require('mysql');

exports = module.exports = UserDAO;

function UserDAO(host, port, user, passwd) {
	this.host = host;
	this.port = port;
	this.user = user;
	this.passwd = passwd;

	this.get_user_by_name = function(name, callback) {
		var conn = mysql.createConnection({
			host: this.host,
			user: this.user,
			password: this.passwd,
		});

		conn.connect();

		conn.query('select id, name, passwd from xl_ddz.user where name = ?', [name], function(err, rows, fields) {
			if(callback) {
				callback(err, rows, fields);
			}
			
			conn.end();
		});
	};

	this.get_user_by_id = function(id, callback) {
		var conn = mysql.createConnection({
			host: this.host,
			user: this.user,
			password: this.passwd,
		});

		conn.connect();

		conn.query('select id, name, passwd from xl_ddz.user where id = ?', [id], function(err, rows, fields) {

		if(callback) {
			callback(err, rows);
		}
			
			conn.end();
		});
	};

	this.add_user = function(name, passwd, callback) {
		var conn = mysql.createConnection({
			host: this.host,
			user: this.user,
			password: this.passwd,
		});

		conn.connect();

		conn.query('insert into xl_ddz.user(name, passwd) values(?, ?)', [name, passwd], function(err, result) {
			if(callback){
				callback(err, result);
			}
		
			conn.end();
		});
	}
}

