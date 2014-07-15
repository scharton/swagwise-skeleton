module.exports = function (app) {

    // Require mongoose dependency
    var mongoose = require('mongoose');

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

    /* ========================= FRONT-END ROUTES ======================= */
    // Route to handle all angular requests
    app.get('*', function (req, res) {
        res.sendfile('./app/index.html'); // load our public/index.html file
    });
};