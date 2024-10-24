const express = require("express");
const router = express.Router();
const users = require("./../data/users.js")

//////////////USERS//////////////
// Creating a simple GET route for individual users,
// using a route parameter for the unique id.
router.get('/', (req, res) => {
    res.json(users)
})
  
  // Creating a simple GET route for individual users,
  // using a route parameter for the unique id.
  router.get('/:id', (req, res) => {
    const user = users.find(u => u.id == req.params.id)
    if (user) res.json(user)
    else throw "Resource Not Found"
  })
  
  
  // Create User
  router.post('/', (req, res) => {
    // Within the POST request route, we create a new
    // user with the data given by the client.
    // We should also do some more robust validation here,
    // but this is just an example for now.
    if (req.body.name && req.body.username && req.body.email){
      const foundUser = users.find(u => u.username === req.body.username)
      if (foundUser) {
        return next(error(400, "Username Already Taken"))
      }
  
      const user = {
        id: users[users.length - 1].id + 1,
        name:  req.body.name,
        username: req.body.username,
        email: req.body.email
      }
  
      users.push(user)
      res.json(user)
    } else {
      throw "Insufficient Data"
    }
  })
  
  router.patch('/:id', (req, res) => {
    // Within the PATCH request route, we allow the client
    // to make changes to an existing user in the database.
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        // req.body holds the update for the user
        for (const key in req.body) {
          // applying the req.body keys to the existing user keys, overwriting them
          users[i][key] = req.body[key]
        }
        return true
      }
    })
  
    if (user) res.json(user)
    else throw "Resource Not Found"
  })
  
  router.delete("/:id", (req, res) => {
    // const user = user.find((u, i) => {
    //   if (u.id == req.params.id) {
    //     users.splice(i, 1)
    //      return true
    //   }
    // })
  
    const userIndex = users.findIndex(u => u.id == req.params.id)
  
    if (userIndex !== -1){
      const deletedUser = users[userIndex]
      users.splice(userIndex, 1)
      res.json(deletedUser)
    } else {
      throw "Resource Not Found"
    }
  
  })
  

module.exports = router
