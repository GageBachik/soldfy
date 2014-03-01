'use strict';

// Articles routes use articles controller
var articles = require('../controllers/articles');
var authorization = require('./middlewares/authorization');
var fs = require('fs');
var uuid = require('node-uuid');
var knox = require('knox').createClient({
    key: 'AKIAISZCSVIT5TAYCIPA',
    secret: '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',
    bucket: 'soldfy'
});
var mime = require('mime');
var HttpError = require('httperror');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
	if (req.article.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(app) {

    app.get('/articles', articles.all);
    app.post('/articles', authorization.requiresLogin, articles.create);
    app.get('/articles/:articleId', articles.show);
    app.put('/articles/:articleId', authorization.requiresLogin, hasAuthorization, articles.update);
    app.del('/articles/:articleId', authorization.requiresLogin, hasAuthorization, articles.destroy);

    // Finish with setting up the articleId param
    app.param('articleId', articles.article);

    app.post('/uploadToAmazon', function (req, res, next) {
        var file = req.files.file;
        var extension = file.name.split('.').pop();
        var stream = fs.createReadStream(file.path);
        var mimetype = mime.lookup(file.path);
        var fileName = uuid.v4() + '.' + extension;
        var fileURL = 'https://soldfy.s3.amazonaws.com/' + fileName;

        if (mimetype.localeCompare('image/jpeg') || mimetype.localeCompare('image/pjpeg') || mimetype.localeCompare('image/png') || mimetype.localeCompare('image/gif')) {

            req = knox.putStream(stream, fileName,
                {
                    'Content-Type': mimetype,
                    'Cache-Control': 'max-age=604800',
                    'x-amz-acl': 'public-read',
                    'Content-Length': file.size
                },
                function(err, result) {
                    console.log(result);
                }
           );
        } else {
            next(new HttpError(400));
        }

        req.on('response', function(res){
            if (res.statusCode === 200) {

                // Do old upload / client send here:

                var responseObj = {
                        title: req.param('title'),
                        content: req.param('content'),
                        price:req.param('price'),
                        paypal: req.param('paypal'),
                        bitcoin: req.param('bitcoin'),
                        ppEmail: req.param('ppEmail'),
                        fileURL: fileURL
                    };
                res.send(JSON.stringify(responseObj));
            } else {
                next(new HttpError(res.statusCode));
            }
        });
    });

/* OLD UPLOAD CODE
    // Handle product upload
    app.post('/upload-full-form', function (req, res) {
        res.setHeader('Content-Type', 'text/html');
        var newfileURL = __dirname + '/uploads/' + uuid.v4();
        var fileUploadMessage = '';
    
    // process file
        if (!req.files.file || req.files.file.size === 0) {
            fileUploadMessage = 'No file uploaded at ' + new Date().toString();
            res.send(fileUploadMessage);
        }
        else {

            var file = req.files.file;
            var extension = file.name.split('.').pop();
       
            fs.rename(file.path, newfileURL+'.'+extension, function (err) {
                if (err)
                    console.log(err);
                else
                {
                    fileUploadMessage = '<b>"' + file.name + '"<b> uploaded to the server at ' + new Date().toString();

                    var responseObj = {
                        title: req.param('title'),
                        content: req.param('content'),
                        price:req.param('price'),
                        paypal: req.param('paypal'),
                        bitcoin: req.param('bitcoin'),
                        ppEmail: req.param('ppEmail'),
                        fileURL: newfileURL
                    };
                    res.send(JSON.stringify(responseObj));
                }
            });
        }
    });
*/
};