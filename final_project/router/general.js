const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

public_users.get('/books', async function (req, res) {
  try {
    // Await the response from the Axios POST request
    let response = await axios.get('https://osgcsprog-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
    console.log(response.data); 
    return res.send(JSON.stringify(response.data, null,4));
    
  } catch (error) {
    // If there is an error, log the error message to the console
    console.error('Error getting data:', error); 
    return res.status(500).send("Internal error");
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn], null,4));
 });

 public_users.get('/books/isbn/:isbn', async function (req, res) {
    try {
    const isbn = req.params.isbn;
      let response = await axios.get('https://osgcsprog-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/'+isbn);
      console.log(response.data); 
      return res.send(JSON.stringify(response.data, null,4));
      
    } catch (error) {
      // If there is an error, log the error message to the console
      console.error('Error getting data:', error); 
      return res.status(500).send("Internal error");
    }
  });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksList  = [];
  for(let i in books){
    if (books[i].author === author){
        //res.send(JSON.stringify(books[i]));
        booksList.push(books[i]);
    }
  }
  return res.status(200).json(booksList);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let titleList  = [];
  for(let i in books){
    if (books[i].title === title){
        //res.send(JSON.stringify(books[i]));
        titleList.push(books[i]);
    }
  }
  return res.status(200).json(titleList);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let bookReview = books[isbn]["reviews"];
  res.status(200).send(bookReview);
});

module.exports.general = public_users;