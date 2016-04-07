var bs = angular.module("bookShareWeb", ['ngRoute'])

.config(function($routeProvider){
    $routeProvider
    
    .when('/', {
        templateUrl: 'templates/home.html',
        controller: 'homeController'
    })
    
    .when('/books', {
        templateUrl: 'templates/books.html',
        controller: 'booksController'
    })
})

.controller('homeController', function($scope, $http){
    $scope.init = function() {
        $http({
            method: 'GET',
            url: 'https://floating-plateau-55000.herokuapp.com/bookshare/api/getUsers'
        }).success(function(response) {
            $scope.response = response;
            console.log(response);
        })
    }
    $scope.init();
})

.controller('booksController', function($scope, $http){
    $scope.init = function() {
        $http({
            method: 'GET',
            url: 'https://floating-plateau-55000.herokuapp.com/bookshare/api/allbooks'
        }).success(function(response) {
            $scope.response = response;
            console.log(response);
        })
    }
    $scope.init();
});