'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Article Schema
 */
var WrequestSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        default: 0.000
    },
    btcAddress: {
        type: String,
        default: '',
        trim: true
    }
});

/**
 * Statics
 */
WrequestSchema.statics.search = function(key, callback) {
    this.findOne({
        key: key
    }).exec(callback);
};

mongoose.model('Wrequest', WrequestSchema);
