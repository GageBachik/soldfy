'use strict';

var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var uuid = require('node-uuid');
var ipn = require('paypal-ipn');
var Paypal = require('paypal-ap');
var paypal = new Paypal({
	applicationId: 'APP-8BB92250VW021833V',
	productionUrl: 'https://svcs.paypal.com/AdaptivePayments/',
	sandboxUrl: 'https://svcs.paypal.com/AdaptivePayments/',
	username:  'gbachik_api1.gmail.com',
    password:  'ZL3L2K7U5NJPYAP3',
    signature: 'AFcWxV21C7fd0v3bYYYRCpSSRl31A8z-7FjDfLT1FGelFZbbXwEGlJTZ'
});

module.exports = function(app) {

	app.get('/pay/:downloadId', function(req, res, next){

		Article.findById(req.params.downloadId, function(err, article){

			console.log(paypal);

			var ourFee = Math.ceil((article.price * 0.01) * 10) / 10;
			var paymentOptions = {
				actionType:   'PAY',
				currencyCode: 'USD',
				cancelUrl:  'http://soldfy.com/cancel',
				returnUrl:  'http://soldfy.com/complete',
				ipnUrl:     'http://soldfy.com/ipn',
				memo: article.title + ' - ' + article._id,
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
				//payKey is used to trigger a paypal dialog on the clientside
				console.log(result);
				res.json({ payKey: result.payKey });
			});
		});
	});

	app.post('/ipn', function(req, res, next) {
		var params = req.body;
		res.send(200);
		ipn.verify(params, function callback(err, msg) {
			if (err) {
				console.error(msg);
				return next(err);
			} else {
			//Do stuff with original params here
				console.log(params);
				if (params.payment_status === 'Completed') {
					//Payment has been confirmed as completed
					console.log('completed');
				}
			}
		});
	});

	app.get('/cancel', function(/*req, res, next*/){
		//triggers when the user cancel the payflow
		console.log('Failed to pay!');
	});

	app.get('/complete', function(req, res){
		//triggers when the user completes the payflow successfull
		res.end('You Paid!');
	});

};
