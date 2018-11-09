var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/myLib');

var db = mongoose.connection;

// book schema
var bookSchema = mongoose.Schema({
    username: {
        type: String
    },
    bookTitle: {
        type: String,
        index: true
    },
    author: {
        type: String
    },
    genre: {
        type: String
    },
    location: {
        type: String
    }
});

var book = module.exports = mongoose.model('book', bookSchema);

module.exports.addBook = function(newBook,callback) {
    newBook.save(callback);
};

module.exports.changeLocation = function(newLoc, username, bookTitle, callback) {
    var query = {username: username, bookTitle: bookTitle};
    var newvalues = { $set: {location: newLoc} };
    book.findOneAndUpdate(query, newvalues, {new: true}, callback);
};

module.exports.removeBook = function(bookTitle, author, username, callback){
    var query = {username: username, author: author, bookTitle: bookTitle};
    book.deleteOne(query, function(err){
        if (err) return handleError(err);
    })
};

// Autocomplete configuration
// var configuration = {
//     //Fields being autocompleted, they will be concatenated
//     autoCompleteFields : [ "bookTitle", "author", "genre"],
//     //Returned data with autocompleted results
//     dataFields: ["_id"],
//     //Maximum number of results to return with an autocomplete request
//     maximumResults: 10,
//     //MongoDB model (defined earlier) that will be used for autoCompleteFields and dataFields
//     model: book
// }