/* ================= REQUIRE MODULES ===================== */

var express = require('express'),
    app = express(),
    path = require('path'),
    fs = require('fs'), // file system
    logger = require('morgan'),
    mongoose = require('mongoose'),
    uriUtil = require('mongodb-uri');

var passport     = require('passport');
var session      = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt        = require('bcrypt-nodejs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var http         = require('http');
var https        = require('https');
var privateKey   = fs.readFileSync('cert/server.key', 'utf8');
var certificate  = fs.readFileSync('cert/server.crt', 'utf8');
var credentials  = {key: privateKey, cert: certificate};

var httpServer   = http.createServer(app); // Node's native server, registering express in Node
var httpsServer  = https.createServer(credentials, app);
var sslport = 8443;



// test secret key : sk_test_4UOJTjvKipzSNLY9PdUhgn91
// var stripe       = require('stripe')('your_key_here');
var stripe       = require('stripe')('sk_test_4UOJTjvKipzSNLY9PdUhgn91');
/*
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for
 * plenty of time in most operating environments.
 */

var options = {
    server: {
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 30000
        }
    },
    replset: {
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 30000
        }
    }
};

/*
 * Mongoose uses a different connection string format than MongoDB's standard.
 * Use the mongodb-uri library to help you convert from the standard format to
 * Mongoose's format.
 */
var mongodbUri = 'mongodb://mongodb:23password@ds053139.mongolab.com:53139/geekwise';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
var conn = mongoose.connection;

mongoose.connect(mongooseUri, options);
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function () {
    // Wait for the database connection to establish, then start the app.
    console.log('Connected to MongoLab');
    httpServer.listen(port);                                          // startup our app at http://localhost:9001
    httpsServer.listen(sslport);                                      // startup our HTTPS server on http://localhost:8443 or :443
    console.log('Swag at http://localhost:' + port);
    console.log('Swag secure at https://localhost' + sslport);
});

/* ============== MODELS ========================== */

// This is Node's file server ('fs')
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
    if(~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});

/* ===================== PASSPORT ========================= */
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    var User = mongoose.model('User');

    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
    var User = mongoose.model('User');

    User.findOne({ email: email }, function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false);

        function cb(err, isMatch) {
            if (err) return done(err);
            if (isMatch) return done(null, user);
            return done(null, false);
        }
        bcrypt.compare(password, user.password, function(err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    });
}));

/* ===================== CONFIGURATION ==================== */

var port = process.env.PORT || 9001;					                // Default port or port 9001

/* ================= REGISTER MODULES ===================== */

app.use(logger('dev'));                                 		        // log every request to the console
app.use(express.static(path.join(__dirname, 'app')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
/* Add the following after express.static in module section */
app.use(session({ secret: 'blackwidow straw' }));                       // Encryption key/salt
app.use(passport.initialize());                                         // Initializes passport
app.use(passport.session());                                            // Creates a passport session

/* Add the following after express.static */
// any user request will respond with a cookie, intercepts requests
app.use(function(req, res, next) {
    if (req.user) {
        res.cookie('user', JSON.stringify(req.user));
    }
    next();
});
		            // set the static files location

/* ======================== ROUTES ========================= */

require('./routes.js')(app);                            		        // configure our routes, passing in app reference


/* ======================== STRIPE ========================= */
stripe.charges.create({
    amount: 400,
    currency: "usd",
    card: {
        number: '4242424242424242',
        exp_month: 07,
        exp_year: 2015,
        name: 'BB Thorton',
        "brand": "Visa",
        "funding": "credit",
        "country": "US",
        "address_line1": null,
        "address_line2": null,
        "address_city": null,
        "address_state": null,
        "address_zip": null,
        "address_country": null,
        "cvc_check": null,
        "address_line1_check": null,
        "address_zip_check": null,
        "customer": null
    }
}, function(err, charge) {
    console.log(charge);
});

/* =============== START APP (THIS GOES LAST) ============== */

                                                   // startup our app at http://localhost:9001
//console.log('The MEAN app is started at http://localhost:' + port);   // shoutout to the user
exports = module.exports = app;                                         // expose app
