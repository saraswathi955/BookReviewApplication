const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password } = req.body;
  if (!username || !password) {
    res.send({message: "Username and password are required"});
  }

  // Check if the username already exists
  const userExits = users.some(user => user.username === username);
  if (userExits) {
    res.send({message: "Username already exists"})
  }
  // Register the new user
  users.push({ username, password });
  res.send({message: "User registered successfully" });

});


function getBooks() {
  return new Promise((resolve, reject) => {
      resolve(books);
  });
}


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

//   return res.status(200).json(JSON.stringify(books, null, 4));


  // res.send(JSON.stringify(books,null,4));
  getBooks().then((bks) => res.send(JSON.stringify(bks)));

});


function getByISBN(isbn) {
  return new Promise((resolve, reject) => {
      let isbnNum = parseInt(isbn);
      if (books[isbnNum]) {
          resolve(books[isbnNum]);
      } else {
          reject({status:404, message:`ISBN ${isbn} not found`});
      }
  })
}


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  getByISBN(req.params.isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
});


//   const isbn = req.params.isbn;
//   const book = books[isbn];
//   if (book) {
    
//     res.send(book);
//   }
//   res.send({message: "Book not found"});
//  });



  

// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
  //Write your code here
  // const author = req.params.author.toLowerCase();

  // Get all keys from the books object
  // const bookKeys = Object.keys(books);
  // Filter books by the author
  // const bookByAuthor = bookKeys.map(key => books[key]).filter(book => book.author.toLowerCase() === author);
  // Check if any books were found
//   if (bookByAuthor.length > 0) {
//     res.send(bookByAuthor);
//   }
//   return res.send({message: "No book found for this author"});
// });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getBooks()
  .then((bookEntries) => Object.values(bookEntries))
  .then((books) => books.filter((book) => book.author === author))
  .then((filteredBooks) => res.send(filteredBooks));
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  getBooks()
  .then((bookEntries) => Object.values(bookEntries))
  .then((books) => books.filter((book) => book.title === title))
  .then((filteredBooks) => res.send(filteredBooks));
});



// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
  //Write your code here
//   const title = req.params.title.toLowerCase();
//   const bookKeys = Object.keys(title);
  
//   const bookByTitle = bookKeys.map(key => books[key]).filter(book => book && book.title.toLowerCase().includes(title));

//   if(bookByTitle.length > 0) {
//     res.send(bookByTitle);
//   }
//   res.send({message: "No book found for this title"});
// });




//  Get book review
// public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  // const isbn = req.params.isbn;
  // const book = books[isbn];
  // if (book) {
  //   const reviews = book.reviews;
  //   if (Object.keys(reviews).length > 0) {
  //       res.send(reviews);
  //   } else {
  //       res.send({message: "No reviews found for this book"});
  //   }
  // } else {
  //   res.send({message: "No book found with the given ISBN"})
//   }
  
// });



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getByISBN(req.params.isbn)
  .then(
      result => res.send(result.reviews),
      error => res.status(error.status).json({message: error.message})
  );
});

module.exports.general = public_users;