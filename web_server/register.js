#!/usr/bin/env node

var Conf = require('./conf');
var DAO = require('./dao');

exports = module.exports = Register;

function Register(req, res) {
	this.req = req;
	this.res = res;
}

Register.prototype.try_register = function(){
	var dao = new DAO(Conf.user_db.host, Conf.user_db.port, Conf.user_db.user, Conf.user_db.passwd);
	dao.add_user(this.req.body.username, this.req.body.passwd, (err, result) => {
		var ret_result = {'result': -1};

		if(err){
			result.msg = JSON.stringify(err);
		}
		else{
			if(result.affectedRows === 1){
				 ret_result.result = 0;
			}
		}
		
		this.res.setHeader('Content-Type', 'application/json');
		this.res.end(JSON.stringify(ret_result));
	});
};

