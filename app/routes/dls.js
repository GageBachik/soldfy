'use strict';

var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var Dl = mongoose.model('Dl');
var uuid = require('node-uuid');
var fmt = require('fmt');
var Bitpay = require('bitpay-node');
var client = new Bitpay.Client({ apiKey: 'oPpplAptLT1WSag8xQ1nEO9OyznU8MyCDzFfSwkFE' });
var amazonS3 = require('awssum-amazon-s3');
var s3 = new amazonS3.S3({
    'accessKeyId'     : 'AKIAISZCSVIT5TAYCIPA',
    'secretAccessKey' : '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',
    'region'          : amazonS3.US_EAST_1
});

module.exports = function(app) {

	app.post('/dls', function(req, res, next){
		// download the file via aws s3 here
		var dlKey = req.body.dlKey;

		Dl.findOne({key:dlKey}, function(err, dl){
			if (err) return next(err);
			console.log(dl);
			if (dl.btcId.length > 0){

				client.getInvoice(dl.btcId, function(err, invoice) {
					console.log(invoice);
					if(invoice.status === 'confirmed' || invoice.status === 'paid' || invoice.status === 'complete'){
						console.log('confirmed');
					}
					else{
						res.redirect('http://www.soldfy.com');
					}
				});

			}
			var files = dl.dlFile;
			var dlName = dl.name + '.' + dl.dlFile.split('.').pop();

			var options = {
				BucketName    : 'soldfy',
				ObjectName    : files,
			};

			s3.GetObject(options, { stream : true }, function(err, data) {
				// stream this file to stdout
				fmt.title('Download Stream Started');
				res.attachment(dlName);
				data.Stream.pipe(res);
			});
			Dl.remove({ key: dlKey }, function(err) {
				if (err) {
					console.log('error delteing file');
				}
				else {
					console.log('file key deleted');
				}
			});
		});

		//res.end('Successful Download Post!');
	});

	app.post('/dls/create/:dlKey/:email/:btcId?*', function(req, res, next){
		// create the dl with the article etc here
		var oneTimeKey = uuid.v4();
		var artId = req.param('dlKey');
		var btcId = req.param('btcId');
		var email = req.param('email');

		Article.findById(artId, function(err, art){
			if (err) return next(err);
			var dlFile = art.fileURL.split('/').pop();
			var dl = new Dl({
				key: oneTimeKey,
				dlFile: dlFile,
				name: art.title,
				btcId: btcId,
				email: email
			});
			dl.save(function(err) {
				if (err) {
					return res.send('dls', {
						errors: err.errors,
						dl: dl
					});
				} else {
					res.jsonp(dl);
				}
			});
		});
		//res.end('Successful Download Create Post!');
	});

};