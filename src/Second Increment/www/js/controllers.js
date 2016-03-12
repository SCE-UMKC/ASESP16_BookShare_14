angular.module('starter.controllers', ['angular-md5'])

.factory('UserServices', function() {
    var userDetails;
    function set(data) {
        userDetails = data;
    }
    
    function get() {
        return userDetails;
    }
    
    return {
        set: set,
        get:get
    }
})

.controller('LoginCtrl', function($scope, $state, $http, $httpParamSerializerJQLike, md5, UserServices) {
  $scope.validateLogin = function(username, password) {
      $http({
          method: 'POST',
          url: 'https://floating-plateau-55000.herokuapp.com/bookshare/api/auth/login',
          data: JSON.stringify({
              email: username,
              password: password
          }),
          contentType : "application/json"
      }).success(function(data){
          var full_name = data.full_name;
          var email = data.email;
          var hash = md5.createHash(data.email);
          var userDetails = {name: full_name, email: email, gravatar: hash};
          UserServices.set(userDetails);
          
          $state.go("user-dash.home");
      }).error(function(data){
          console.log("Error!");
          $scope.loginStatus = true;
          $scope.message = "Invalid Credentials!";
      })
  }
})

.controller('RegistrationCtrl', function($scope, $rootScope, $http, $httpParamSerializerJQLike, $state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
    
    $scope.register = function(email, password, fullname) {
        $http({
           method: 'POST',
           url: 'https://floating-plateau-55000.herokuapp.com/bookshare/api/auth/register',
           data: JSON.stringify({
               email: email,
               password: password,
               full_name: fullname
           }),
        contentType: "application/json"
        }).success(function(){
            $scope.registrationStatus = true;
            $scope.message = "User registration successful!";
            $scope.email = "";
            $scope.password = "";
            $scope.fullname = "";
            console.log("Successful");
            $state.go("tab-login.login");
        }).error(function(){
            $scope.registrationStatus = true;
            $scope.message = "User already exists!";
        })
    }
    
})



.controller('ForgotCtrl', function($scope) {
  //$scope.settings = {
    //enableFriends: true
  //};
})

.controller('DashboardCtrl', function($scope, $http, $stateParams, Books, UserServices, $httpParamSerializerJQLike){
  $scope.books = Books.all();
  $scope.userDetails = UserServices.get();
    $scope.userfullname = $scope.userDetails.name;
    $scope.email = $scope.userDetails.email;
    
    $scope.newBook = function(book_title, author, isbn) {
        $http({
            method: 'POST',
            url: "https://floating-plateau-55000.herokuapp.com/bookshare/api/book/new",
            data: JSON.stringify({
                email: $scope.email,
                book_title: book_title,
                author: author,
                isbn: isbn,
                available: '1'
            }),
            contentType: "application/json"   
        }).success(function(){
            $scope.book_title = "";
            $scope.author = "";
            $scope.isbn = "";
            $scope.statusMsg = true;
            $scope.message = "Book added successfully!";
        })
    }
})

.controller('BookDetailCtrl', function($scope, $stateParams, Books) {
  $scope.book = Books.get($stateParams.bookId);

})

.controller('wishListCtrl', function($scope, $stateParams, Books, UserServices) {
  /*$scope.userDetails = UserServices.get();
    $scope.email = $scope.userDetails.email;
    
    $scope.init = function() {
        $http({
            method: 'GET',
            url: "https://floating-plateau-55000.herokuapp.com/bookshare/api/userbooks",
            data: {email: $scope.email}
        }).success(function() {
            
        })
    }
*/
})

.controller('AccountCtrl', function($scope, $state, UserServices) {
    //Get Details from Service
   $scope.details = UserServices.get();
    $scope.userimg = $scope.details.gravatar;
    $scope.username = $scope.details.name;
    $scope.useremail = $scope.details.email;
    
    $scope.logout = function() {
        $state.go('tab-login.login');
    }
});
