(function (angular) {
    "use strict";
    var app = angular.module('Swagwise');

    // $scope is what makes the data available to the view
    app.controller('SwagController', function ($scope, SwagService) {

        $scope.swagSearch = "";

//        SwagService.swag()
//            .then(function (response) {
//                // Put the data from the response onto the scope
//
////                console.log(response);
////                console.log(response.data[0]); // a subset of data
//                $scope.swag = response.data;
//
//            });
//
        $scope.swag = SwagService.query();

    });
    // $stateParams provided by ui-router; gets stuff out of URL
    app.controller('ProductDetail', function ($scope, $stateParams, SwagService, $interval) {
        var product_id = $stateParams.id; // based on product/:id

        var counter = 1; // put counter here so it doesn't reinitialize on each mouseover
        var rotator;

        // get() is part of $resource
        $scope.item = SwagService.get({id: product_id}, function (item) {
            $scope.productImage = item.images[0];
        });

        $scope.rotateImage = function () {

            if (rotator) {
                return;
            }
            rotator = $interval(function () {
                counter += 1;
                if (counter == $scope.item.images.length) {
                    counter = 0;
                }
                $scope.productImage = $scope.item.images[counter];

            }, 1000);
        };

        $scope.cancelRotator = function () {
            if (rotator) {
                $interval.cancel(rotator);
                rotator = undefined;
            }
        };
    });

})(window.angular);