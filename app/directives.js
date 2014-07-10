(function (angular) {
    "use strict";

    var app = angular.module('Swagwise');

    app.directive('rotatingThumbnail', function ($interval) {
        return {
            replace: true, // makes the HTML replaced so img set properly; makes <rotating-thumbnail> go away so
                            // images aren't all weird
            // E - element, A - attribute, C - CSS class
            restrict: 'E',
            // String @, One-way function &, Two-way bound object =
            scope: {
                images: '=', // attribute passed in will be called 'images'
                title: '@'
            },
            templateUrl: 'templates/rotating-thumbnail.html'
            ,
            link: function (scope, element, attributes) { // passed in by position, not injected
                // element and attributes can technically be removed because we aren't using them
                var rotator;
                var counter = 0;
                var destroyRotator = function () {
                    if (rotator) {
                        $interval.cancel(rotator);
                        rotator = undefined;
                        // reset productImage
                        scope.productImage = scope.images[0];
                    }

                };

                scope.productImage = scope.images[0];


                scope.rotateImage = function () {
                    // if rotator exists, just return
                    if (rotator) {
                        return;
                    }

                    // create a new rotator
                    rotator = $interval(function () {
                        counter += 1;
                        if (counter == scope.images.length) {
                            counter = 0;
                        }
                        scope.productImage = scope.images[counter];

                    }, 1000);
                };

                scope.cancelRotator = function () {
                    destroyRotator();
                };

                scope.$on('$destroy', function () {
                    destroyRotator();
                });
            }
        };
    });

    app.directive('productGroup', function(){
       return {
           scope: {
               swag: '='
           },
           restrict: 'E',
           replace: true,
           templateUrl: 'templates/product-group.html'
       }
    });

})(window.angular);