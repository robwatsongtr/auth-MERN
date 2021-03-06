const express = require('express');
const app = express();
const mongoose = require('mongoose');
const auth = require('./Helpers/jwt.js')
const unless = require('express-unless')
const users = require('./Controllers/UserController.js')
const errors = require('./Helpers/errorHandler.js')

const port = 5002

// middleware for authenticating token submitted with requests
// To conditionally skip a middleware when a condition is met, 
// we can use the express-unless package. 
auth.authenticateToken.unless = unless
app.use(auth.authenticateToken.unless({
    path: [
        { url: '/users/login', methods: ['POST']},
        { url: '/users/register', methods: ['POST']}
    ]
}))

app.use(express.json()) 
app.use('/users', users) 
app.use(errors.errorHandler); // middleware for error responses


mongoose.connect('mongodb://127.0.0.1:27017/auth-tutorial', { useNewUrlParser: true })
  .catch( err => console.log(err) )
const connection = mongoose.connection

connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

app.listen( port, () => {
  console.log(`Server running on port ${port}`);
})