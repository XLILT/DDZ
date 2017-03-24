#!/usr/bin/env node

var ejs = require("ejs");                                                                                                           
var bodyParser = require("body-parser");
var express = require("express");
var Conf = require('./conf')
var Login = require('./login');
var Register = require('./register');

var app = module.exports = express();

// express configure
//app.set('views', __dirname + '/views');  
app.engine(".html", ejs.__express);
app.set('view engine', 'html');  
app.use(express.static(__dirname + '/public')); 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/login', function(req, res) {
	var login = new Login(req, res);
	login.try_login();
});

app.post('/register', function(req, res) {
	var register = new Register(req, res);
	register.try_register();
});

app.listen(Conf['port'], Conf['host']);
console.log(`server run at ${Conf['host']}:${Conf['port']}`)

