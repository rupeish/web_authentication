var express = require('express');
var router = express.Router();
var User = require('../models/user');

//GET route for reading data

router.get('/',function(req,res,next){
	//return res.send("Its Working");
	return res.sendFile(path.join(__dirname +'/template/index.html'));
});

//post route for updating data
router.post('/',function(req,res,next){
	//confirm that user entered same password twice
	if(req.body.password !== req.body.passwordConf)
	{
		var err = new Error('password does not match');
		err.status = 400;
		res.send('Passwords do not match');
		return next(err);
	}

	if(req.body.email &&
		req.body.username &&
		req.body.password &&
		req.body.passwordConf){

		var userData = {
			email : req.body.email,
			username : req.body.username,
			password : req.body.password
		}
		console.log("===0");
	User.create(userData,function(err,user){
		if (err){
			return next(err);
			//console.log("===1");
		}
		else
		{
			req.session.userId = user._id;
			//console.log("===2");
			return res.redirect('/profile');
		}
	});
}else if(req.body.logemail && req.body.logpassword)
{
	console.log("===1");
	User.authenticate(req.body.logemail,req.body.logpassword,function(err,user){
		if(err || !user){
			var err = new Error('Wrong password or email');
			err.status = 401;
			return next(err);
		}
		else{
			req.session.userId = user._id;
			return res.redirect('/profile');
		}
	});
}else{
	console.log("===2");
	var err = new Error('All fields are required');
	err.status = 400;
	return next(err);
}

})

// Get route after registering
router.get('/profile',function(req,res,next){
	User.findById(req.session.userId)
	.exec(function(error,user){
		if(err){
			return next(err);
		}else
		{ 
			if(user===null){
			var err = new Error('Not authorized');
			err.status = 400;
			return next(err);
		}else{
			return res.send('<h1>Name: </h1>' + user.username +'<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>');
		}
	}
	});
	
});

//Get for logout
router.get('/logout',function(req,res,next){
	if(req.session){
		//delete session
		req.session.destroy(function(err){
			if(err){
				return next(err);
			}else{
				return res.redirect('/');
			}
		});
	}
});

module.exports = router;