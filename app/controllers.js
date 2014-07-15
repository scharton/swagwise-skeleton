(function (angular) {
    "use strict";
    var app = angular.module('Swagwise');

    app.controller('HomeController', function($scope, SwagService) {
        $scope.featuredProducts = SwagService.query({isFeatured: true});
    });

    // Inject in the CartService
    app.controller('CartController', function($scope, CartService) {

        // Set the items on the scope to the items in the CartService using the getItems method
        $scope.items = CartService.getItems();

        $scope.addItem = function(item) {
            // Pass the item into the addItem method of the CartService
            CartService.addItem(item);
        };

        $scope.getItemCount = function() {
            // Return the item count from the CartService
            return CartService.getItemCount();
        };

        $scope.getCartSubtotal = function() {
            // Return the subtotal using the getCartSubtotal method of the CartService
            return CartService.getCartSubtotal();
        };

        $scope.getCartTotal = function() {
            // Return the cart total using the getCartTotal methode of the CartService
            return CartService.getCartTotal();
        };

        $scope.removeItem = function(id) {
            // Pass the item id into the removeItem method of the CartService
            CartService.removeItem(id);
        };

        $scope.emptyCart = function() {
            // Invoke the emptyCart method of the CartService
            CartService.emptyCart();
        }

        $scope.checkout = function() {
            // Invoke the checkout method of the CartService
            CartService.checkout();
        };

    });


    // $scope is what makes the data available to the view
    app.controller('SwagController', function ($scope, SwagService, filterFilter) {
        var items = SwagService.query();

        $scope.swagSearch = "";
        $scope.swag = items;

        // Watch swag search for changes
        $scope.$watch('swagSearch', function(newValue, oldValue) {
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
        $scope.item = SwagService.get({id: product_id});

        $scope.imageInterval = 3000;

    });



})(window.angular);