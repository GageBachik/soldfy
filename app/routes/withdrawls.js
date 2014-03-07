'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Wrequest = mongoose.model('Wrequest');

module.exports = function(app) {
	app.post('/withdrawl/:userId/:btcAddress', function(req, res){
		User.findById(req.params.userId, function(err, user){
			var wRequest = new Wrequest({
				amount: user.btc,
				btcAddress: req.params.btcAddress
			});
			user.btc = 0.000;
			wRequest.save(function(err){
				if (err)console.log(err);
			});
			user.save(function(err){
				if (err)console.log(err);
			});
		});
		res.end('Made a Succesfull Request!');
	});
};
