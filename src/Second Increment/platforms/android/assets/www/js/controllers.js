angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state) {
  $scope.validateLogin = function() {
    var username = this.username;
    var password = this.password;

    if(username=="admin"&&password=="admin") {
      $state.go('user-dash.home');
    }
    else {
      $scope.status = "Invalid login";
    }
  }
})

.controller('RegistrationCtrl', function($scope, $rootScope, $http, $httpParamSerializerJQLike) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

//  $scope.chats = Chats.all();
  //$scope.remove = function(chat) {
    //Chats.remove(chat);
  //};
    
    $scope.register = function(email, password, fullname) {
        $http({
           method: 'POST',
           url: 'http://localhost:9804/bookshare/api/auth/register',
           data: JSON.stringify({
               email: email,
               password: password,
               full_name: fullname
           }),
        contentType: "application/json"
        }).success(function(){
            $rootScope.show("Processing...Please wait");
        })
    }
    
})



.controller('ForgotCtrl', function($scope) {
  //$scope.settings = {
    //enableFriends: true
  //};
})

.controller('DashboardCtrl', function($scope, $stateParams, Books){
  $scope.books = Books.all();
})

.controller('BookDetailCtrl', function($scope, $stateParams, Books) {
  $scope.book = Books.get($stateParams.bookId);

})

.controller('wishListCtrl', function($scope, $stateParams, Books) {
  $scope.book = Books.all();

})

.controller('AccountCtrl', function($scope) {
  //Get Current User's username
  $scope.username = 'admin';
  var password = $scope.password;

  //set new password.

});
