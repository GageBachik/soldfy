'use strict';

var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var uuid = require('node-uuid');
var Paypal = require('paypal-ap');
var paypal = new Paypal({
	username:  'gbachik-facilitator_api1.gmail.com',
    password:  '1393581229',
    signature: 'An5ns1Kso7MWUdW4ErQKJJJ4qi4-A0-y.5ij40isgBfYOT.pvUsu0O.M'
});

module.exports = function(app) {


	app.get('/testing/:downloadId', function (req, res) {
		var email = 'Default';
		var price = 'Default';
		Article.findById(req.params.downloadId, function(dberr, article){
			email = article.ppEmail;
			price = article.price;
		});
		res.end('It worked');
    });

	app.get('/pay/:downloadId', function(req, res, next){

		Article.findById(req.params.downloadId, function(dberr, article){

			var ourFee = Math.ceil((article.price * 0.01) * 10) / 10;
			var paymentOptions = {
				actionType: 'PAY',
				currencyCode : 'USD',
				cancelUrl : 'http://soldfy.com/cancel',
				returnUrl : 'http://soldfy.com/complete',
				ipnUrl : 'http://soldfy.com/ipn',
				reverseAllParallelPaymentsOnError : true,
				receiverList: {
					receiver: [{
						email: 'gbachik-facilitator@gmail.com',
						amount: ourFee,
						primary:'false'
					},{
						email: article.ppEmail,
						amount: article.price,
						primary:'true'
					}]
				},
				feesPayer: 'PRIMARYRECEIVER',
				trackingId: uuid.v1()
			};

			paypal.pay(paymentOptions, function(err, result) {
				if (err) {
					console.log(err);
					return next(err);
				}
				//payKey is used to trigger a paypal dialog on the clientside, see 
				//https://cms.paypal.com/us/cgi-bin/?cmd=_render-content&content_ID=developer/library_overview_land
				res.json({ payKey: result.payKey });
			});
		});
	});

	app.get('/ipn', function(req, res, next) {
		var params = req.body;
		var trackingId = params.trackingId;
		var status = params.status;
		console.log(params);
		if (status === 'COMPLETED') {
			paypal.verify(req.body, function(err, verified) {
				if (err) return next(err);
				if (!verified) return next(new Error('Paypal failed to verify trackingId: ' + trackingId));
				console.log('the use made a successfull payment');
			});
		}
	});

	app.get('/cancel', function(/*req, res, next*/){
		//triggers when the user cancel the payflow
		console.log('Failed to pay!');
	});

	app.get('/complete', function(req, res){
		//triggers when the user completes the payflow successfull
		console.log(req);
		console.log(res);
		console.log('Paid successfully!');
	});

};
