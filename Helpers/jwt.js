/*
To handle the creation and authorization of JSON Web Tokens (JWTS), 
we will create some custom middleware and helper methods.

We can use these to check for the authorization token sent over 
by the client in the request header and create and sign tokens 
to send over to the client-side.
*/

const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// get password vars from .env file
dotenv.config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      console.log(err)

      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
}

function generateAccessToken(username) {
  return jwt.sign({data: username}, process.env.TOKEN_SECRET, { expiresIn: '1h' });
}

module.exports = {
    authenticateToken,
    generateAccessToken
}