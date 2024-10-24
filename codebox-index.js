require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000


const users = require("./data/users.js")
const posts = require("./data/posts.js")

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ extended: true }))




//////////////USERS//////////////
// Creating a simple GET route for individual users,
// using a route parameter for the unique id.
app.get('/api/users', (req, res) => {
  res.json(users)
})

// Creating a simple GET route for individual users,
// using a route parameter for the unique id.
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id)
  if (user) res.json(user)
  else throw "Resource Not Found"
})


// Create User
app.post('/api/users', (req, res) => {
  // Within the POST request route, we create a new
  // user with the data given by the client.
  // We should also do some more robust validation here,
  // but this is just an example for now.
  if (req.body.name && req.body.username && req.body.email){
    const foundUser = users.find(u => u.username === req.body.username)
    if (foundUser) {
      res.json({ error: 'Username Already Taken' })
      return
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



//////////////POSTS//////////////
app.get('/api/posts', (req, res) => {
  res.json(posts)
})

app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id == req.params.id)
  if (post) res.json(post)
  else throw "Resource Not Found"
})


app.get("/", (req, res) => {
  res.send("Work in progress!")
})


// 404 Error Handling Middleware
// Custom 404 (not found) middleware.
// Since we place this last, it will only process
// if no other routes have already sent a response!
app.use((err, req, res, next) => {
  res.status(404).json({ error: err })
})


app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})