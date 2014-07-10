'use strict';

module.exports = {
    db: 'mongodb://REMOVED@ds033429.mongolab.com:33429/gbachiktesting',
    app: {
        name: 'Soldfy'
    },
    facebook: {
        clientID: '472103969579095',
        clientSecret: '9740987777d35699ccfee758c34b2881',
        callbackURL: 'http://soldfy.com/auth/facebook/callback'
    },
    twitter: {
        clientID: 'CONSUMER_KEY',
        clientSecret: 'CONSUMER_SECRET',
        callbackURL: 'http://localhost:3000/auth/twitter/callback'
    },
    github: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    linkedin: {
        clientID: 'API_KEY',
        clientSecret: 'SECRET_KEY',
        callbackURL: 'http://localhost:3000/auth/linkedin/callback'
    }
};
