angular.module('starter.services', [])

.factory('Books', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var books = [{
    id: 0,
    name: 'Headfirst Java',
    author: 'Kathy Sierra & Bert Bates',
    image: 'img/HF_Java.png',
    isbn: '0596009208',
    user: 'Pallavi'
  }, {
    id: 1,
    name: 'Cracking the Coding interview',
    author: 'Gayle Laakmann McDowell',
    image: 'img/cdi.png',
    isbn: '0984782850',
    user: 'Swetha Chandra'
  }, {
    id: 2,
    name: 'Steve Jobs',
    author: 'Walter Issacson',
    image: 'img/steve.png',
    isbn: '1501127624',
    user: 'Raja Ramya'
  }, {
    id: 3,
    name: 'Headfirst JavaScript',
    author: 'Eric T. Freeman & Elisabeth Robson',
    image: 'img/HF_JS.png',
    isbn: '144934013X',
    user: 'Latha'
  }, {
    id: 4,
    name: 'Beginning Software Engineering',
    author: 'Rod Stevens',
    image: 'img/SE.png',
    isbn: '1118969146',
    user: 'Pallavi'
  }];

  return {
    all: function() {
      return books;
    },
    remove: function(book) {
      books.splice(books.indexOf(book), 1);
    },
    get: function(bookId) {
      for (var i = 0; i < books.length; i++) {
        if (books[i].id === parseInt(bookId)) {
          return books[i];
        }
      }
      return null;
    }
  };
});
