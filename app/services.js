(function (angular) {
    "use strict";

    var app = angular.module('Swagwise');

    // new API service to simplify services
    app.factory('API', function ($resource) {
        return {
            swag: $resource('/api/swag/:id'),
            checkout: $resource('/api/checkout'),
            login: $resource('/api/login'),
            logout: $resource('/api/logout'),
            register: $resource('/api/register')

        };
    });

    app.factory('Auth', function (API, $rootScope, $cookieStore) {

        $rootScope.currentUser = $cookieStore.get('user');
        $cookieStore.remove('user');

        return {

            login: function (user, success, error) {
                return API.login.save(user)
                    .$promise.then(function (data) {
                        $rootScope.currentUser = data;
                        success();
                    }, error);
            },

            signup: function (user, success, error) {
                return API.register.save(user)
                    .$promise.then(success, error);
            },

            logout: function (success) {
                return API.logout.get('/api/logout').$promise.then(function () {

                    $rootScope.currentUser = null;
                    $cookieStore.remove('user');

                    success();
                });
            }
        };

    });

    app.factory('SwagService', function (API) {

        // if :id isn't passed in, it just treats as '/api/swag'
        return API.swag;
    });

    // Inject in $cookieStore, SwagService and app config
    app.factory('CartService', function ($state, $cookieStore, API) {

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
                            API.swag.get({id: key}, function (response) {
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

            checkout: function (card) {
                // Implement the checkout
                var user = $cookieStore.get('user');

                var data = {
                    amount: this.getCartTotal(),
                    customer_id: user.customer_id
                    // if you want to support anonymous purchase
//                customer_id: (user ? user.customer_id : undefined)
                };

                // Merge card data
                angular.extend(data, card);

                // Use $promise or just a regular callback as the 2nd parameter of save(data, callback)/
                API.checkout.save(data).$promise.then(
                    function (response) {
                        $state.go('receipt', response);
                    });
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