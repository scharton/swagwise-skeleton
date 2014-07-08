(function (angular) {
    "use strict";

    var app = angular.module('Swagwise');

    app.factory('SwagService', function ($resource) {

        // if :id isn't passed in, it just treats as '/api/swag'
        return $resource('/api/swag/:id');
    });

})(window.angular);