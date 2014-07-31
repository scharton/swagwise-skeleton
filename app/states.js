(function (angular) {
    "use strict";
    var app = angular.module('Swagwise');

    // the args are part of ui-router
    app.config(
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/'); // catch all for an unmapped route

            //angular ui router states
            $stateProvider.state('home', {url: '/', templateUrl: 'views/home.html', controller: 'HomeController'})
                .state('swag', {url: '/swag', templateUrl: 'views/swag.html', controller: 'SwagController'})
                .state('about', {url: '/about', templateUrl: 'views/about.html'})
                .state('cart', {url: '/cart', templateUrl: 'views/cart.html', controller: 'CartController'})
                .state('checkout', {url: '/checkout', templateUrl: 'views/checkout.html', controller: 'CheckoutController'})
                .state('receipt', {url: '/receipt', templateUrl: 'views/receipt.html', controller: 'ReceiptController' })
                .state('contact', {url: '/contact', templateUrl: 'views/contact.html'})
                .state('login', {url: '/login', templateUrl: 'views/login.html', controller: 'LoginController'})
                .state('signup', {url: '/signup', templateUrl: 'views/signup.html', controller: 'SignupController'})
                .state('product', {url: '/product/:id', templateUrl: 'views/detail.html', controller: 'ProductDetail'})
            ;
        }
    )
    ;
})(window.angular);


