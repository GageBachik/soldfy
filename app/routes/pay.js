'use strict';

var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var uuid = require('node-uuid');
var Bitpay = require('bitpay-node');
var client = new Bitpay.Client({ apiKey: 'oPpplAptLT1WSag8xQ1nEO9OyznU8MyCDzFfSwkFE' });
var request = require('request');
var ipn = require('paypal-ipn');
var Paypal = require('paypal-ap');
var paypal = new Paypal({
	applicationId: 'APP-21S092056P239643G',
	productionUrl: 'https://svcs.paypal.com/AdaptivePayments/',
	sandboxUrl: 'https://svcs.paypal.com/AdaptivePayments/',
	username:  'gbachik_api1.gmail.com',
    password:  'ZL3L2K7U5NJPYAP3',
    signature: 'AFcWxV21C7fd0v3bYYYRCpSSRl31A8z-7FjDfLT1FGelFZbbXwEGlJTZ'
});
var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport('SMTP',{
    service: 'Gmail',
    auth: {
        user: 'soldfy@gmail.com',
        pass: 'lolsauce123'
    }
});

module.exports = function(app) {

	app.get('/pay/:downloadId', function(req, res, next){

		Article.findById(req.params.downloadId, function(err, article){

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
						email: 'gbachik@gmail.com',
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

	app.post('/pay/bitcoin', function(req, res){

		console.log(req.body);
		var email = req.body.email;
		
		Article.findById(req.body.artId, function(err, article){

			var invoiceOptions = {
				price: article.price,
				currency: 'USD',
				redirectURL: 'http://www.soldfy.com'
			};
			client.createInvoice(invoiceOptions, function(err, invoice) {

				request.post(
					'http://soldfy.com/dls/create/'+ article._id + '/' + email+ '/' + invoice.id,
					{ form: { dlKey: article._id, email: email } },
					function (error, response, body) {
						if (!error && response.statusCode === 200) {
							console.log(body);
							var mailOptions = {
								from: 'Soldfy Admin ✔ <soldfy@gmail.com>', // sender address
								to: email, // list of receivers
								subject: 'Your One Time Download Key!', // Subject line
								text: 'Please note this key will only work after the btc invoice it marked as paid!\n Key: '+JSON.parse(body).key+'\n Download Link: http://soldfy.com/#!/dls/ \n Have a great day!' // plaintext body
								//html: '<b>Hello world ✔</b>' // html body
							};
							// send mail with defined transport object
							smtpTransport.sendMail(mailOptions, function(error, response){
								if(error){
									console.log(error);
								}else{
									console.log('Message sent: ' + response.message);
								}
								// if you don't want to use this transport object anymore, uncomment following line
								smtpTransport.close(); // shut down the connection pool, no more messages
							});

						}
					});

				console.log(invoice);
				res.redirect(invoice.url);
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
		res.end('Your file is being downloaded!');
	});

};
