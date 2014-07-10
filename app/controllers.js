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

        // get() is part of $resource
        $scope.item = SwagService.get({id: product_id});

        $scope.imageInterval = 3000;

    });

})(window.angular);