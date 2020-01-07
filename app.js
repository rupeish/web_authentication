var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

//connect to mongodb
//mongoose.connect('mongodb://localhost/testAuth');
mongoose.connect('mongodb://localhost:27017/testAuth');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console,'connection error'));
db.once('open',function(){
	//we are in
});

//sessions for traking logins
app.use(session({
	secret:'Work Hard',
	resave:true,
	saveUninitialized:false,
	store: new MongoStore({
		mongooseConnection: db
	})
}));

//parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//serve static files from '/public'
app.use(express.static(__dirname+'/template'));



//include routes
var routes = require('./routes/router');
app.use('/',routes);



//catch 404 error and forward to error handler
app.use(function(req,res,next){
	var err = new ERROR('File Not Found')
	err.status = 404;
	next(err);
});


//error handler
//define as last app.use callback
app.use(function(err,req,res,next){
	res.status(err.status || 500);
    res.send(err.message);
	
});

//listen on port 3000
app.listen(3000,function(){
	console.log('app is listening on 3000');
});
