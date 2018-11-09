var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'./uploads'});


var Book = require('../models/book');

function getBookList(username, callback){
  Book.find({'username': username}, 'bookTitle author', function(err, userBooks) {
    callback(err, userBooks);
  });
};

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  getBookList(req.user.username, function(err,userBooks){
    if (err) return handleError(err);
    else if (userBooks.length > 0) {
      res.locals.user.books = userBooks;
    };
    res.render('index', { title: 'library' });
  });
});

router.get('/loan', ensureAuthenticated, function(req, res, next) {
	res.render('loan', {title: 'loan'});
});

router.get('/add', ensureAuthenticated, function(req, res, next) {
  getBookList(req.user.username, function(err, userBooks){
    if (err) return handleError(err);
    else if (userBooks.length > 0) {
      res.locals.user.books = userBooks;
    };
    res.render('add', { title: 'add' });
  });
});

router.get('/remove', ensureAuthenticated, function(req, res, next) {
  getBookList(req.user.username, function(err, userBooks){
    if (err) return handleError(err);
    else if (userBooks.length > 0) {
      res.locals.user.books = userBooks;  
    };
    res.render('remove', { title: 'remove' });
  });
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('users/login');
}

router.post('/addBook', function(req, res) {
  
  var bookTitle = req.body.bookName;
  var author = req.body.author;
  var genre = req.body.genre;
  var username = req.user.username;

  newBook = new Book({
    username: username,
    bookTitle: bookTitle,
    author:author,
    genre: genre,
    location: 'Library'
  });

  Book.addBook(newBook, function(err, book){
    if(err) throw err;
    console.log(book);
  });

  res.redirect('/add');

});

router.post('/removeBook', function(req, res) {
  
  var bookTitle = req.body.bookName;
  var author = req.body.author;
  var username = req.user.username;

  Book.removeBook(bookTitle, author, username, function(err, book){
    if(err) throw err;
    console.log(book);
  });

  res.redirect('/remove');
  
});

router.post('/loanBook', function(req, res) {
  
  var bookTitle = req.body.bookName;
  var username = req.body.username;
  var location = req.body.location;

  Book.changeLocation(location, username, bookTitle, function(err, book){
    if(err) throw err;
    console.log(book);
  });

  res.redirect('/');
  
});

//initialization of AutoComplete Module
// var myMembersAutoComplete = new AutoComplete(configuration, function(){
//   //any calls required after the initialization
//   console.log("Loaded " + myMembersAutoComplete.getCacheSize() + " words in auto complete");
// });


module.exports = router;
