angular.module('starter.controllers', ['angular-md5'])

.factory('UserServices', function(localStorageService) {
    var userDetails;
    function set(data) {
        //userDetails = data;
        localStorageService.set(userDetails, data);
    }
    
    function get() {
        var userSession = localStorageService.get(userDetails);
        return userSession;
    }
    
    function logout() {
        localStorageService.clear();
    }
    
    return {
        set: set,
        get: get,
        logout: logout
    }
})

.controller('LoginCtrl', function($scope, $state, $ionicPopup, $ionicLoading, $http, $httpParamSerializerJQLike, md5, UserServices) {
  $scope.validateLogin = function(username, password) {
      $ionicLoading.show({
          template: 'Please wait...'
        });
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
          var phone = data.phone;
          var userDetails = {name: full_name, email: email, gravatar: hash, phone:phone};
          UserServices.set(userDetails);
          $ionicLoading.hide();
          $state.go("user-dash.home");
      }).error(function(data){
          console.log("Error!");
          $scope.loginStatus = true;
          $scope.message = "Invalid Credentials!";
          $ionicLoading.hide();
          $ionicPopup.alert({
                 title: 'Login failed :(',
                 template: 'Please try again.'
               });
      })
  }
})

.controller('RegistrationCtrl', function($scope, $rootScope, $ionicLoading, $http, $httpParamSerializerJQLike, $state) {
    $scope.register = function(email, password, fullname, phone, secret, secret_answer) {
        $ionicLoading.show({
          template: 'Please wait...'
        });
        $http({
           method: 'POST',
           url: 'https://floating-plateau-55000.herokuapp.com/bookshare/api/auth/register',
           data: JSON.stringify({
               email: email,
               password: password,
               full_name: fullname,
               phone: phone,
               secretq: secret,
               secreta: secret_answer
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
            $ionicLoading.hide();
        }).error(function(){
            $scope.registrationStatus = true;
            $ionicLoading.hide();
            $scope.message = "User already exists!";
        })
    }
    
})


.controller('ForgotCtrl', function($scope, $http, $ionicLoading, $ionicPopup, $state) {
    $scope.email = "";
    $scope.beginRecovery = function(email) {
        $ionicLoading.show({
            template: "Processing your request.."
        });
        
        $scope.email = email;
        $http({
            method: 'POST',
            url: 'http://floating-plateau-55000.herokuapp.com/bookshare/api/auth/sendSMSAuth',
            data: JSON.stringify({
                email: email,
                type: 'forgotpwd'
            }),
            contentType: "application/json"
        }).success(function(response) {
            $ionicLoading.hide();
             $ionicLoading.show({
            template: "Sending SMS"
            });
            if(response.result=="OK"){
                $ionicLoading.hide();
                $scope.SMSAuthSuccess = true; 
                $scope.verifyAccount = function(auth) {
                    $ionicLoading.show({
                        template: "Verifying.."
                    });
                    $http({
                        method: 'POST',
                        url: 'http://floating-plateau-55000.herokuapp.com/bookshare/api/auth/verifyAccount',
                        data: JSON.stringify({
                            email: $scope.email,
                            authcode: auth
                        }),
                        contentType: "application/json"
                    }).success(function(response) {
                        $ionicLoading.hide();
                        if(response.result=="OK") {
                            $scope.showPasswordField = true;
                            $scope.resetPassword = function(password) {
                            
                                $http({
                                    method: 'POST',
                                    url: 'http://floating-plateau-55000.herokuapp.com/bookshare/api/auth/resetPassword',
                                    data: JSON.stringify({
                                        email: $scope.email,
                                        password: password
                                    }),
                                    contentType: "application/json"
                                }).success(function(response){
                                    if(response.result=="OK") {
                                        $ionicPopup.alert({
                                            template: "Password updated successfully!"
                                        });
                                        $state.go('tab-login.login');
                                    } else {
                                        //
                                    }
                                })
                            }
                        }
                        else {
                            $ionicPopup.alert({
                            title: 'Error Verifying!',
                            template: 'Please try again!'
                            });
                        }
                    })
                }
            }
        })
    }
})

.controller('DashboardCtrl', function($scope, $http, $stateParams, Books, UserServices, $httpParamSerializerJQLike){
    $scope.books = Books.all();
    $scope.userDetails = UserServices.get();
    $scope.userfullname = $scope.userDetails.name;
    $scope.email = $scope.userDetails.email;
    $scope.dashboardData = "";
    $scope.newBooks = "";
    
    $scope.init = function() {
        $http({
            method: 'GET',
            url: 'http://floating-plateau-55000.herokuapp.com/bookshare/api/dashboard-services/init?email='+$scope.email
        }).success(function(response) {
            $scope.dashboardData = response;
        }).finally(function() {
               $scope.$broadcast('scroll.refreshComplete');
        });
        
        $scope.retrieveLatestBooks = function() {
            $http({
            method: 'GET',
            url: 'http://floating-plateau-55000.herokuapp.com/bookshare/api/bookslist'
            }).success(function(response) {
                $scope.newBooks = response;
            }).finally(function(){
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
        $scope.retrieveLatestBooks();
    }
    
    $scope.init();
        
        
    
})

.controller('NotificationsCtrl', function($scope, $http, $ionicLoading, $ionicPopup, $timeout, md5, UserServices) {
    
    $scope.userDetails = UserServices.get();
    $scope.email = $scope.userDetails.email;
    $scope.notificationsData = "";
    $scope.avatar = [];
    $scope.bookData = [];
    
    $scope.init = function() {
        $http({
            method: 'GET',
            url: 'http://floating-plateau-55000.herokuapp.com/bookshare/api/dashboard-services/init?email='+$scope.email
        }).success(function(response) {
            $scope.notificationsData = response;
            for(i=0;i<response.length;i++) {
                $scope.avatar.push(md5.createHash(response[i].requestedBy)); 
                
                $http({
                    method: 'GET',
                    url: 'http://floating-plateau-55000.herokuapp.com/bookshare/api/bookdetails?bookId='+$scope.notificationsData[i].reqItemId
                }).success(function(bookdata) {
                     $scope.bookData.push(bookdata);
                })
            }
        }).finally(function() {
               $scope.$broadcast('scroll.refreshComplete');
        });
    }
    
    $scope.init();
    
    $scope.acceptRequest = function(notificationId) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Request?',
            template: 'Requested user will contact you.'
        });
        var popup = "";
        
        confirmPopup.then(function(res) {
            if(res) {
                $ionicLoading.show({
                    template: 'Please wait..'
                });
                
                $http({
                    method: 'POST',
                    url: 'http://floating-plateau-55000.herokuapp.com/bookshare/api/dashboard-services/acceptRequest',
                    data: JSON.stringify({
                        docId: notificationId
                    }),
                    contentType: "application/json"
                }).success(function(data) {
                    $ionicLoading.hide();
                    if(data.result=="OK") {
                        popup = $ionicPopup.show({
                            template: "You have approved the request"
                        });
                    }
                })
            }
            else {
               // Return back. 
            }
                
        })
        $timeout(function() {
            popup.close(); 
        }, 3000);
    };

    
    $scope.declineRequest = function(notificationId) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Dismiss Request?',
            template: 'Click OK to dismiss.'
        });
        var popup = "";
        confirmPopup.then(function(res) {
            if(res) {
                $ionicLoading.show({
                    template: 'Please wait..'
                });
                
                $http({
                    method: 'POST',
                    url: 'http://floating-plateau-55000.herokuapp.com/bookshare/api/dashboard-services/declineRequest',
                    data: JSON.stringify({
                        docId: notificationId
                    }),
                    contentType: "application/json"
                }).success(function(data) {
                    $ionicLoading.hide();
                    if(data.result=="OK") {
                       popup = $ionicPopup.show({
                            template: "You have dismissed the request"
                        });
                    }
                    
                })
            }
        })
         $timeout(function() {
            popup.close(); 
        }, 3000);
        
    }
})

.controller('NewBookCtrl', function($scope, $http, UserServices, $ionicLoading, $ionicPopup, $state) {
    $scope.userDetails = UserServices.get();
    $scope.email = $scope.userDetails.email;
    $scope.userFullname = $scope.userDetails.name;
    
    $scope.addBook = function(bookname, isbn, author) {
        $scope.response = "";
        $scope.showResult = false;
        $scope.showNotFoundError = false;
        $scope.bookname = bookname;
        $scope.ISBN = isbn;
        $scope.author = author;
        $ionicLoading.show({
          template: 'Please wait...'
        });
        
        var reqUrl = "https://www.googleapis.com/books/v1/volumes?q="+$scope.bookname+"+isbn:"+$scope.ISBN+"+inauthor:"+$scope.author;
        //&key=AIzaSyDlYdl06a70zyOrCMJPnSlBs7UTNkTordM"
        $http({
            method: 'GET',
            url: reqUrl
        }).success(function(data){
            console.log(data);
            $ionicLoading.hide();
            if(data.totalItems>0) {
                var epochTS = new Date();
                var timeStamp = epochTS.toISOString();
                $scope.response = data;
                $scope.showResult = true;
                $scope.assertBookDetails = function() {
                     $ionicLoading.show({
                      template: 'Processing Request...'
                    });
                /*
                {{response.items[0].volumeInfo.title}}, ISBN, {{response.items[0].volumeInfo.authors[0]}}, {{response.items[0].volumeInfo.categories[0]}}, {{response.items[0].volumeInfo.publisher}}, {{response.items[0].volumeInfo.publishedDate}}, {{response.items[0].volumeInfo.pageCount}}, {{response.items[0].volumeInfo.description}}
                */
                var bookTitle = $scope.response.items[0].volumeInfo.title;
                var ISBN = $scope.ISBN;
                var author = $scope.response.items[0].volumeInfo.authors;
                var category = $scope.response.items[0].volumeInfo.categories[0];
                var publisher = $scope.response.items[0].volumeInfo.publisher;
                var pubyear = $scope.response.items[0].volumeInfo.publishedDate;
                var pagecount = $scope.response.items[0].volumeInfo.pageCount;
                var bookcover = $scope.response.items[0].volumeInfo.imageLinks.thumbnail;
                var description = $scope.response.items[0].volumeInfo.description;
                var avgrating = $scope.response.items[0].volumeInfo.averageRating;
                    $http({
                        method: 'POST',
                        url: "https://floating-plateau-55000.herokuapp.com/bookshare/api/book/new",
                        data: JSON.stringify({
                            email: $scope.email,
                            fullName: $scope.userFullname,
                            book_title: bookTitle,
                            ISBN: ISBN,
                            author: author,
                            category: category,
                            publisher: publisher,
                            pubyear: pubyear,
                            coverimg: bookcover,
                            pageCount: pagecount,
                            description: description,
                            avgRating: avgrating,
                            availability: 1,
                            timestamp: timeStamp
                        }),
                        contentType: "application/json"
                    }).success(function() {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                         title: 'Added!',
                         template: 'Book has been added successfully'
                        });
                        console.log("Added!");
                        $scope.bookname = "";
                        $scope.ISBN = "";
                        $scope.author = "";
                    })
        }
            }
            else {
                $scope.showNotFoundError = true;
            }
        })
        
    }
    
      $scope.addBookManually = function() {
                    $scope.category = this.category;
                    $scope.publisher = this.publisher;
                    $scope.year = this.year;
                    $scope.pagecount = this.pagecount;
                    $scope.description = this.description;
                
                    $http({
                        method: 'POST',
                        url: "https://floating-plateau-55000.herokuapp.com/bookshare/api/book/new",
                        data: JSON.stringify({
                            email: $scope.email,
                            fullName: $scope.userFullname,
                            book_title: $scope.bookname,
                            ISBN: $scope.ISBN,
                            author: $scope.author,
                            category: $scope.category,
                            publisher: $scope.publisher,
                            pubyear: $scope.year,
                            coverimg: '0',
                            pageCount: $scope.pagecount,
                            description: $scope.description,
                            avgRating: 'NA',
                            availability: 1
                        }),
                        contentType: "application/json"
                    }).success(function() {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                         title: 'Added!',
                         template: 'Book has been added successfully'
                        });
 
                        $state.go('user-dash.home');
                    })
                }
})

.controller('MyBooksCtrl', function($scope, UserServices, $http, $ionicLoading) {
    $scope.userDetails = UserServices.get();
    $scope.email = $scope.userDetails.email;
    $scope.response = "";
    $scope.init = function() {
        $ionicLoading.show({
            template: 'Loading...'
        });
        var reqURL = 'https://floating-plateau-55000.herokuapp.com/bookshare/api/userbooks?email='+$scope.email;
        $http({
            method: 'GET',
            url: reqURL,
            contentType: "applcation/json"
        }).success(function(response){
            console.log(response);
            $ionicLoading.hide();
            $scope.response = response;
        }).error(function() {
            console.log("Unknown Error!!");
        }).finally(function() {
               $scope.$broadcast('scroll.refreshComplete');
        });
    }
    
    $scope.init();
    
})

.controller('BookDetailCtrl', function($scope, $stateParams, Books, UserServices, $http, md5, $ionicLoading, $ionicPopup, $timeout) {
    $scope.userDetails = UserServices.get();
    $scope.email = $scope.userDetails.email;
    $scope.fullName = $scope.userDetails.name;
    $scope.response = "";
    $scope.bookTitle = "";
    $scope.description = "";
    $scope.ISBN = "";
    $scope.amznData = "";
    $scope.bookPrice = "";
    $scope.coverimg = "";
    $scope.wishlistCtrl = false;
    $scope.docId = "";
    
    $scope.init = function() {
        $ionicLoading.show({
            template: 'Processing Request...'
        });
        var bookId = $stateParams.bookId;
        var reqURL = "http://floating-plateau-55000.herokuapp.com/bookshare/api/bookdetails?bookId="+bookId;
        $scope.avatar = [];
        $scope.ownBook = [];
        $http({
            method: 'GET',
            url: reqURL
        }).success(function(response) {
            $ionicLoading.hide();
            $scope.readOnly = true;
            $scope.response = response;
            $scope.bookTitle = response.book_title;
            $scope.description = response.description;
            $scope.ISBN = response.ISBN;
            $scope.coverimg = response.coverimg;
            $scope.docId = response._id;
            $scope.getWishlist = function() {
                $http({
                    method: 'GET',
                    url: 'http://floating-plateau-55000.herokuapp.com/bookshare/api/dashboard-services/getWishlist?email='+$scope.email
                }).success(function(data){
                    console.log(data);
                    for(i=0;i<data.length;i++) {
                        if(data[i].docId == $scope.docId) {
                            $scope.wishlistCtrl = true;
                            console.log($scope.wishlistCtrl);
                        }
                    }
                });
            }
            $scope.getWishlist();
            
            $scope.getBookOwners = function() {
                $scope.ISBN;
                var ISBNReqURL = "http://floating-plateau-55000.herokuapp.com/bookshare/api/fetchBooksByISBN?ISBN="+$scope.ISBN;
                $http({
                    method: 'GET',
                    url: ISBNReqURL
                }).success(function(data) {
                    $scope.availableWith = data;
                    for(i=0;i<data.length;i++) {
                       $scope.avatar.push(md5.createHash(data[i].email));
                       if(data[i].email == $scope.email) {
                           $scope.ownBook.push(true);
                       } else {
                           $scope.ownBook.push(false);
                       }
                    }
                })
            }
            
            $scope.getBookMetaFromAmazon = function() {
                $http({
                    method: 'GET',
                    url: 'http://floating-plateau-55000.herokuapp.com/bookshare/api/external/amznReqAuth?ISBN='+$scope.ISBN
                }).success(function(AmazonData) {
                    $scope.amznData = AmazonData;
                    $scope.bookPrice = $scope.amznData[0].ItemAttributes[0].ListPrice[0].FormattedPrice[0];
                    if($scope.response.coverimg=="0") {
                        $scope.coverimg = $scope.amznData[0].MediumImage[0].URL[0];
                        console.log($scope.coverimg);
                    }
                })
            }
            $scope.getBookOwners();
            $scope.getBookMetaFromAmazon();
        }).finally(function() {
               $scope.$broadcast('scroll.refreshComplete');
        });
    }
    $scope.init();
    
    /* Save Book Request to Notifications Collection */
    $scope.sendRequest = function(bookId, email, uname) {
        
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Request?',
            template: 'A Notification will be sent to '+uname
        });
        
        confirmPopup.then(function(res) {
            if(res) {
            var epochTS = new Date();
            var timeStamp = epochTS.toISOString();
    
            $ionicLoading.show({
                template: 'Placing request...'
            });

            $http({
                method: 'POST',
                url: 'http://floating-plateau-55000.herokuapp.com/bookshare/api/requestbook',
                data: JSON.stringify({
                    reqItemId: bookId,
                    email: email,
                    requestedBy: $scope.email,
                    fullName: uname,
                    reqType: 'Book',
                    read: 0,
                    status: 0,
                    timestamp: timeStamp
                }),
                contentType: "application/json"
            }).success(function(data){
                $ionicLoading.hide();
                $ionicPopup.alert({
                     title: 'Request Placed Successfully!',
                     template: 'Confirmation:'+data._id
                   });
                $scope.sendSMS(email, uname);
            })
            } else {
               console.log('cancelled');
            }
        });
}
    
    /* Send SMS Notification */
    
    $scope.sendSMS = function(email, uname) {
        $http({
            method: 'POST',
            url: 'http://floating-plateau-55000.herokuapp.com/bookshare/api/external/sendSMS',
            data: JSON.stringify({
                email: email,
                uname: uname
            }),
            contentType: "application/json"
        }).success(function(data) {
            console.log("SMS has been sent");
        })
    }
    
    $scope.bookDetailsSpeech = function() {
        var speechText = $scope.bookTitle + "Description: " + $scope.description;
            TTS.speak({
               text: speechText,
               locale: 'en-US',
               rate: 0.9
           }, function () {
               console.log("Done");
           }, function (reason) {
                console.log("Error!");
           });
    }
    
    $scope.getCustomerReviews = function() {
        $scope.customerreviews = true;
        $scope.customerReviews = $scope.amznData[0].CustomerReviews[0].IFrameURL[0];
        $scope.customerReviews = $scope.customerReviews.replace(" ", "");
    }
    
    $scope.addToWishlist = function(docId) {
        $ionicLoading.show({
            template: 'Adding to Wishlist..'
        });
        
        $http({
            method: 'POST',
            url: 'http://floating-plateau-55000.herokuapp.com/bookshare/api/dashboard-services/wishlist',
            data: JSON.stringify({
                docId: $scope.docId,
                email: $scope.email
            }),
            contentType: "application/json"
            }).success(function(response) {
                $ionicLoading.hide();
                var popup = $ionicPopup.show({
                    template: 'Book has been added to your Wishlist.'
                });
                $timeout(function() {
                    popup.close(); 
                }, 3000);
        })
    }
})

.controller('CentralBookRepCtrl', function($scope, $http, UserServices, $ionicLoading) {
    $scope.userDetails = UserServices.get();
    $scope.email = $scope.userDetails.email;
    $scope.response = "";
    
    $scope.init = function() {
        $http({
            method: 'GET',
            url: 'http://floating-plateau-55000.herokuapp.com/bookshare/api/bookslist'
        }).success(function(response) {
            $scope.response = response;
        })
    }
    $scope.init();
})

.controller('wishListCtrl', function($scope, $stateParams, $http, UserServices, $ionicLoading) {
        $scope.userDetails = UserServices.get();
        $scope.email = $scope.userDetails.email;
        $scope.response = [];
    
        $scope.init = function() {
                $http({
                    method: 'GET',
                    url: 'http://floating-plateau-55000.herokuapp.com/bookshare/api/dashboard-services/getWishlist?email='+$scope.email
                }).success(function(data){
                    for(i=0;i<data.length;i++) {
                        $http({
                            method: 'GET',
                            url: 'http://floating-plateau-55000.herokuapp.com/bookshare/api/bookdetails?bookId='+data[i].docId
                        }).success(function(response){
                            $scope.response.push(response);
                        })
                    }
                   
                }).finally(function() {
                        $scope.response = [];
                        $scope.$broadcast('scroll.refreshComplete');
                });
            }
            $scope.init();
    
        $scope.deleteWishlistItem = function(docId) {
            $ionicLoading.show({
                template: 'Deleting..'
            });
            
            $http({
                method: 'GET',
                url: 'http://floating-plateau-55000.herokuapp.com/bookshare/api/dashboard-services/deleteWishlistItem?docId='+docId
            }).success(function(data) {
                if(data.result=="OK") {
                    $ionicLoading.hide();
                    $scope.init();
                }
            })
        }
})

.controller('AccountCtrl', function($scope, $state, UserServices, $http, $ionicLoading, $ionicPopup) {
    
    $scope.details = UserServices.get();
    $scope.userimg = $scope.details.gravatar;
    $scope.username = $scope.details.name;
    $scope.useremail = $scope.details.email;
    
    $scope.changePassword = function(password) {
        $ionicLoading.show({
            template: "Please wait.."
        });
        $http({
            method: 'POST',
            url: 'http://floating-plateau-55000.herokuapp.com/bookshare/api/auth/resetPassword',
            data: JSON.stringify({
                email: $scope.useremail,
                password: password
            }),
            contentType: "application/json"
        }).success(function(response){
            $ionicLoading.hide();
            if(response.result=="OK") {
                $ionicPopup.alert({
                    template: "Password updated successfully!"
                });
            }
            else {
                $ionicPopup.alert({
                    template: "Unknown error! Please try again!!"
                });
            }
        });
    }
    
    $scope.logout = function() {
        $state.go('tab-login.login');
        UserServices.logout();
    }
});