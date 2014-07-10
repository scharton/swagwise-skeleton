(function (angular) {
    "use strict";
    var app = angular.module('Swagwise');

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
                $scope.swag = filterFilter(items, newValue);
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