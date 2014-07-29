module.exports = function (app) {

    // Require mongoose dependency
    var mongoose = require('mongoose');
    var passport = require('passport');

// test secret key : sk_test_4UOJTjvKipzSNLY9PdUhgn91
// var stripe       = require('stripe')('your_key_here');
// require(stripe) returns a function immediately invoked with the second part
    var stripe       = require('stripe')('sk_test_4UOJTjvKipzSNLY9PdUhgn91');
    /* ======================= REST ROUTES ====================== */
    // Handle API calls

    // Swag API route - get is HTTP get
    app.route('/api/swag')
        .get(function (req, res) {
            // use mongoose to get all products in the database
            mongoose.model('Swag').find(req.query, function (err, swag) {

                // Example of isFeatured
                // http://localhost:9001/api/swag/?isFeatured=true
                // req.query = {isFeatured: true}

                // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                res.send(swag); // return products in JSON format
            });
        });

    // for example, you could have .post(function...)

    app.route('/api/swag/:id')
        .get(function (req, res) {
            // use mongoose to get a product in the database by id
            mongoose.model('Swag').findOne({id: req.params.id}, function (err, product) {
                // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                res.send(product); // return the product in JSON format
            });
        });

    /* Add the dependency to passport after the mongoose require declaration */

    /* Add the following routes after the products routes */
// logout API route
    app.get('/api/logout', function(req, res, next) {
        req.logout();
        res.send(200);
    });

    // login API route
    app.post('/api/login', passport.authenticate('local'), function(req, res) {
        res.cookie('user', JSON.stringify(req.user));
        res.send(req.user);
    });

    // signup API route
    app.post('/api/signup', function(req, res, next) {
        var User = mongoose.model('User');
        var user = new User({
            email: req.body.email,
            password: req.body.password
        });
        user.save(function(err) {
            if (err) return next(err);
            res.send(200);
        });
    });

    /* ========================= FRONT-END ROUTES ======================= */
    app.route('/api/checkout')
        .post(function(req, res, next) {
            stripe.charges.create({
                amount: 5000,
                currency: "usd",
                card: {
                    number: '4242424242424242',
                    exp_month: 07,
                    exp_year: 2015,
                    name: 'John Smoltz',
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
                res.send(charge);
            });
        });

    /* ========================= FRONT-END ROUTES ======================= */
    // Route to handle all angular requests
    app.get('*', function (req, res) {
        res.sendfile('./app/index.html'); // load our public/index.html file
    });
};