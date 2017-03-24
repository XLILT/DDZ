#!/usr/bin/env node

var Conf = require('./conf');
var DAO = require('./dao');

exports = module.exports = Login;

function Login(req, res) {
	this.req = req;
	this.res = res;
}

Login.prototype.try_login = function() {
	var dao = new DAO(Conf.user_db.host, Conf.user_db.port, Conf.user_db.user, Conf.user_db.passwd);
	dao.get_user_by_name(this.req.body.username, (err, rows, fields) => {
		var result = {result: -1};

		if(err) {
			result.msg = JSON.stringify(err);
		}
		else{
			if(rows.length === 1) {
				if(rows[0].passwd === this.req.body.passwd) {
					result.result = 0;
					result.uid = rows[0].id;
					result.name = rows[0].name;
				}
			}
			else if(rows.length === 0) {
				result.msg = "username not existed.";
			}	
		}	

		this.res.setHeader('Content-Type', 'application/json');
		this.res.end(JSON.stringify(result));
	});
};

