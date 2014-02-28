'use strict';

var Paypal = require('paypal-ap');

module.exports = function(app) {

	var paypal = new Paypal({
		currencyCode : 'USD',
		applicationId : 'APP-80W284485P519543T',
		cancelUrl : 'http://<yourdomain>/cancel',
		returnUrl : 'http://<yourdomain>/complete',
		ipnUrl : 'http://<yourdomain>/ipn',
		reverseAllParallelPaymentsOnError : true,
		signature:  'AFcWxV21C7fd0v3bYYYRCpSSRl31A8z-7FjDfLT1FGelFZbbXwEGlJTZ'
	});

	app.get('/pay', function(req, res, next){
		var paymentOptions = {
			receiverList: {
				receiver: [{
					email: 'gbachik@gmail.com',
					amount: 5 //fix this
				},{
					email: req.param('ppEmail'),
					amount: 10 //fix this
				}]
			},
			feesPayer: 'PRIMARYRECEIVER',
			actionType: 'PAY',
			trackingId: req.param('trackingId')
		};
		paypal.pay(paymentOptions, function(err, result) {
			if (err) return next(err);
			//payKey is used to trigger a paypal dialog on the clientside, see 
			//https://cms.paypal.com/us/cgi-bin/?cmd=_render-content&content_ID=developer/library_overview_land
			res.json({ payKey: result.payKey });
		});
	});

	app.get('/ipn', function(req, res, next) {
		var params = req.body;
		var trackingId = params.trackingId;
		var status = params.status;
		if (status === 'COMPLETED') {
			paypal.verify(req.body, function(err, verified) {
				if (err) return next(err);
				if (!verified) return next(new Error('Paypal failed to verify trackingId: ' + trackingId));
			});
		}
	});

	app.get('/cancel', function(/*req, res, next*/){
	//triggers when the user cancel the payflow
	});

	app.get('/complete', function(/*req, res, next*/){
	//triggers when the user completes the payflow successfull
	});
	
};
