#!/usr/bin/env node

var ejs = require("ejs");                                                                                                           
var bodyParser = require("body-parser");
var express = require("express");
var conf = require('./conf')

var app = module.exports = express();

// express configure
//app.set('views', __dirname + '/views');  
app.engine(".html", ejs.__express);
app.set('view engine', 'html');  
app.use(express.static(__dirname + '/public')); 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.listen(conf['port'], conf['host']);
console.log(`server run at ${conf['host']}:${conf['port']}`)

