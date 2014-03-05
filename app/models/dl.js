'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Article Schema
 */
var DlSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    key: {
        type: String,
        default: '',
        trim: true
    },
    dlFile: {
        type: String,
        default: '',
        trim: true
    },
    name: {
        type: String,
        default: '',
        trim: true
    },
    btcId: {
        type: String,
        default: '',
        trim: true
    },
    email: {
        type: String,
        default: '',
        trim: true
    }
});

/**
 * Statics
 */
DlSchema.statics.search = function(key, callback) {
    this.findOne({
        key: key
    }).exec(callback);
};

mongoose.model('Dl', DlSchema);
