// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ui.router'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab-login', {
    url: '/auth',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab-login.login', {
    url: '/login',
    views: {
      'tab-login': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('tab-login.register', {
      url: '/register',
      views: {
        'tab-register': {
          templateUrl: 'templates/register.html',
          controller: 'RegistrationCtrl'
        }
      }
    })


  .state('tab-login.account', {
    url: '/forgot',
    views: {
      'tab-account': {
        templateUrl: 'templates/forgot.html',
        controller: 'ForgotCtrl'
      }
    }
  })

    .state('user-dash', {
      url: '/dashboard',
      abstract: true,
      templateUrl: 'templates/dashboard/tabs.html'
    })

    .state('user-dash.home', {
      url: '/home',
      views: {
        'tab-dashboard': {
          templateUrl: 'templates/dashboard/user.html',
          controller: 'DashboardCtrl'
        }
      }
    })
    .state('user-dash.home-book-detail', {
      url: '/book-details/:bookId',
      views: {
        'tab-dashboard': {
          templateUrl: 'templates/dashboard/book-detail.html',
          controller: 'BookDetailCtrl'
        }
      }
    })

    .state('user-dash.wishList', {
      url: '/wishlist',
      views: {
        'tab-wishList': {
          templateUrl: 'templates/dashboard/wishlist.html',
          controller: 'wishListCtrl'
        }
      }
    })

    .state('user-dash.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/dashboard/account.html',
          controller: 'AccountCtrl'
        }
      }
    });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/auth/login');

});
