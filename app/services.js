(function (angular) {
    "use strict";

    var app = angular.module('Swagwise');

    app.factory('Auth', function($http, $rootScope, $cookieStore) {

        $rootScope.currentUser = $cookieStore.get('user');
        $cookieStore.remove('user');

        return {

            login: function(user, success, error) {
                return $http.post('/api/login', user)
                    .success(function(data) {
                        $rootScope.currentUser = data;

                        success();
                    })
                    .error(error);
            },

            signup: function(user, success, error) {
                return $http.post('/api/signup', user)
                    .success(success)
                    .error(error);
            },

            logout: function(success) {
                return $http.get('/api/logout').success(function() {

                    $rootScope.currentUser = null;
                    $cookieStore.remove('user');

                    success();
                });
            }
        };

    });

    app.factory('SwagService', function ($resource) {

        // if :id isn't passed in, it just treats as '/api/swag'
        return $resource('/api/swag/:id');
    });

    // Inject in $cookieStore, SwagService and app config
    app.factory('CartService', function ($cookieStore, SwagService) {

        // Private items object
        var items = {
            // Build as a map (hashmap)
            // property = id
            // value = item

        };


        // Angular factories return service objects
        return {

            getItems: function () {
                // Initialize the itemsCookie variable
                var itemsCookie;
                // Check if cart is empty
                if (!items.length) {
                    // Get the items cookie
                    itemsCookie = $cookieStore.get('items');
                    // Check if the item cookie exists
                    if (itemsCookie) {
                        // Loop through the items in the cookie
                        angular.forEach(itemsCookie, function (value, key) {
                            // Get the product details from the ProductService using the guid
                            SwagService.get({id: key}, function (response) {
                                var product = response; // don't use response.data because the response is the object
                                // Update the quantity to the quantity saved in the cookie
                                product.quantity = value;
                                // Add the product to the cart items object using the guid as the key
                                // typo - not guid, use id
                                items[product.id] = product;
                            });
                        });
                    }
                }
                // Returns items object
                return items;
            },


            addItem: function (item) {
                // Checks if item already exists
                if (items[item.id]) {
                    // If it exists, updates the quantity
                    items[item.id].quantity = parseInt(items[item.id].quantity) + 1;
                } else {
                    item.quantity = 1;
                    items[item.id] = item;
                }



                // Update cookie
                this.updateItemsCookie();
            },

            removeItem: function (id) {
                // Removes an item from the items object
                delete items[id];
                // Update cookie
                this.updateItemsCookie();
            },

            emptyCart: function () {
                // Re-initialize items object to an empty object
                items = {};
                // Remove items cookie using $cookieStore
                $cookieStore.remove('items');

            },

            getItemCount: function () {
                // Initialize total counter
                var total = 0;
                // Loop through items and increment the total by the item quantity
                angular.forEach(items, function (item) {
                    total += parseInt(item.quantity) || 1;
                });
                // Returns number of items, including item quantity
                return total;
            },

            getCartSubtotal: function () {
                // Initialize the total counter
                var total = 0;
                // Loop through the items and multiply the quantity by the item price and increment the total
                angular.forEach(items, function (item) {
                    var price = (item.specialPrice) ? parseFloat(item.specialPrice) : parseFloat(item.price);
                    var qty = parseInt(item.quantity);

                    total += (price * qty);
                });

                // Return the item quantity times item price for each item in the array
                return total;
            },

            getCartTotal: function () {
                // Add stuff like shipping and tax
                return this.getCartSubtotal();
            },

            checkout: function () {
                // Implement the checkout
            },

            updateItemsCookie: function () {
                // Initialize an object to be saved as the cookie
                var itemsCookie = {};
                // Loop through the items in the cart
                angular.forEach(items, function (item, key) {
                    // Add each item to the items cookie,
                    // using the guid as the key and the quantity as the value
                    itemsCookie[key] = item.quantity;
                });
//            console.log(itemsCookie);
                // Use the $cookieStore service to persist the itemsCookie object to the cookie named 'items'
                $cookieStore.put('items', itemsCookie);
            }


        };

    });



})(window.angular);