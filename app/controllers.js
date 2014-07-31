(function (angular) {
    "use strict";
    var app = angular.module('Swagwise');

    // $state is from ui router; allows redirects using $state.go
    app.controller('AppController', function ($scope, $state, $timeout, Auth) {

        function successCallback() {

            $state.go('login');

            $scope.alert = {
                type: 'success',
                message: 'You have been logged out.'
            };

            $timeout(function () {
                $scope.alert = undefined;

            }, 3000);
        }

        $scope.logout = function () {
            Auth.logout(successCallback);
        }

    });

    app.controller('SignupController', function ($scope, $state, $timeout, Auth) {

        function successCallback() {
            $scope.alert = {
                type: 'success',
                message: 'Your account has been created.'
            };

            $timeout(function () {

                $state.go('login');

                $scope.alert = undefined;

            }, 3000);
        }

        function errorCallback() {
            $scope.alert = {
                type: 'danger',
                message: 'There was an error creating your account. Please try again.'
            };

            $timeout(function () {
                $scope.alert = undefined;

            }, 3000);
        }

        $scope.signup = function () {
            Auth.signup({
                email: $scope.email,
                password: $scope.password
            }, successCallback, errorCallback);
        };
    });

    app.controller('LoginController', function ($scope, $state, $timeout, Auth) {

        function successCallback() {
            $scope.alert = {
                type: 'success',
                message: 'You have successfully logged in.'
            };

            $timeout(function () {

                $state.go('home');

                $scope.alert = undefined;

            }, 3000);
        }

        function errorCallback() {
            $scope.alert = {
                type: 'danger',
                message: 'Invalid username and/or password'
            };

            $timeout(function () {
                $scope.alert = undefined;

            }, 3000);
        }

        $scope.login = function () {

            Auth.login({
                email: $scope.email,
                password: $scope.password
            }, successCallback, errorCallback);

        };

    });

    app.controller('HomeController', function ($scope, SwagService) {
        $scope.featuredProducts = SwagService.query({isFeatured: true});
    });

    // Inject in the CartService
    app.controller('CartController', function ($scope, $state, CartService) {

        // set the items on the scope to the items in the cartservice using the getitems method
        $scope.items = CartService.getItems();

        $scope.updateItem = function (item) {
            /*
             if (typeof item.quantity === 'number') {
             cartservice.updateitemscookie();
             }
             */
            CartService.updateItemsCookie();
        };

        // watch items object on the scope
//        $scope.$watch('items', function(oldval, newval){
//            console.log('old value', oldval);
//            console.log('new value', newval);
//            cartservice.updateitemscookie();
//        });

        $scope.addItem = function (item) {
            // pass the item into the additem method of the cartservice
            CartService.addItem(item);
        };

        $scope.getItemCount = function () {
            // return the item count from the cartservice
            return CartService.getItemCount();
        };

        $scope.getItemSubtotal = function (item) {
            return (item.specialPrice || item.price) * item.quantity;
        };

        $scope.getItemPrice = function (item) {
            return item.specialPrice || item.price;
        };

        $scope.getCartSubtotal = function () {
            // return the subtotal using the getcartsubtotal method of the cartservice
            return CartService.getCartSubtotal();
        };

        $scope.getCartTotal = function () {
            // return the cart total using the getcarttotal methode of the cartservice
            return CartService.getCartTotal();
        };

        $scope.removeItem = function (id) {
            // pass the item id into the removeitem method of the cartservice
            CartService.removeItem(id);
        };

        $scope.emptyCart = function () {
            // invoke the emptycart method of the cartservice
            CartService.emptyCart();

            // if use ng-show="getitemcount()" then this isn't needed
            // $scope.items = cartservice.getitems();
        }

        $scope.checkout = function () {
            // invoke the checkout method of the cartservice
            $state.go('checkout');
        };

    });

    app.controller('CheckoutController', function ($scope, CartService)  {
        // create an object on the $scope for a card
        // the view checkout.html is updating card using ng-model
        $scope.card = {};

        $scope.checkout = function () {
            // We moved all this logic from this controller method to the service
            CartService.checkout($scope.card);
        };
    });
// $stateParams see angular-ui-router
    app.controller('ReceiptController', function($scope, $stateParams, CartService){
        $scope.order = $stateParams;
        console.log($stateParams);
        $scope.items = CartService.getItems();
        CartService.emptyCart();
    });

    // $scope is what makes the data available to the view
    app.controller('SwagController', function ($scope, SwagService, filterFilter) {
        var items = SwagService.query();

        $scope.swagSearch = "";
        $scope.swag = items;

        // Watch swag search for changes
        $scope.$watch('swagSearch', function (newValue, oldValue) {
//            console.log('new', newValue);
//            console.log('old', oldValue);
            if (newValue) {
                $scope.swag = filterFilter(items, {title: newValue});
            } else {
                $scope.swag = items;
            }

        });
    });
    // $stateParams provided by ui-router; gets stuff out of URL
    app.controller('ProductDetail', function ($scope, $stateParams, SwagService, $interval) {
        var product_id = $stateParams.id; // based on product/:id

        // get() is part of $resource
        $scope.item = SwagService.get({id: product_id}, function (item) {
            $scope.relatedSwag = SwagService.query({tags: item.tags[1]});
        });

        $scope.imageInterval = 3000;

    });

})(window.angular);