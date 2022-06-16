/*
Our user controller listens for requests with the help of Express Router, 
and it then determines what we do with these requests and their subsequent data.
*/

const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const userServices = require('../Services/Userservices.js')

// When a user registers, the first thing we do is utilize bcryptjs to 
// encrypt the password (it is wise to do this as soon as possible). 
// It allows us to create salt. Salts create unique passwords even in the 
// instance of two users choosing the same passwords and then hash the password.
router.post('/register', (req, res, next) => {
  const {password} = req.body
  const salt = bcrypt.genSaltSync(10);
  req.body.password = bcrypt.hashSync(password, salt);

  userServices.register(req.body)
    .then( () => res.send('success') )
    .catch( err => next(err))
})

// Upon completion, we are ready to send it to our services module, which 
// contains the methods needed to update our MongoDB database with the 
// hashed password we created.
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  userServices.login({ username, password})
    .then(user => { res.json(user) } )
    .catch(err => next(err))
})

router.get('/:id', (req, res, next) => {
  userServices.getById(req.params.id)
    .then(  (user) => res.json(user))
    .catch(err => next(err))
})

module.exports = router;