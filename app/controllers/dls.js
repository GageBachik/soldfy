'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Dl = mongoose.model('Dl');


/**
 * Find dl by id
 */
exports.dl = function(req, res, next, id) {
    Dl.search(id, function(err, dl) {
        if (err) return next(err);
        if (!dl) return next(new Error('Failed to load dl ' + id));
        req.dl = dl;
        next();
    });
};

/**
 * Create an dl
 */
exports.create = function(req, res) {
    var dl = new Dl(req.body);

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
};

exports.destroy = function(req, res) {
    var dl = req.dl;

    dl.remove(function(err) {
        if (err) {
            return res.send('dls', {
                errors: err.errors,
                dl: dl
            });
        } else {
            res.jsonp(dl);
        }
    });
};