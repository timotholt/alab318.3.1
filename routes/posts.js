const express = require("express");
const router = express.Router();
const posts = require("../data/posts.js")
const error = require("../utilities/error.js")
const users = require("../data/users.js")

//////////////POSTS//////////////
router.get('/', (req, res) => {

    // If there is no query parameter, return all posts
    if (!req.query.userId) {

        // console.log(`GET /posts with no userId parameter`);

        const links = [
            {
                href: "posts/:id",
                rel: ":id",
                type: "GET",
            },
        ];
        
        return res.json({ posts, links })
    };

    // Otherwise we got a query parameter
    // console.log(`GET /posts?userId=${req.query.userId}`);

    // Check to make user userId is a number
    if (!req.query.userId)
        next();

    // Find the user
    const foundUser = users.find(u => u.id == req.query.userId)
    if (!foundUser)
        next();

    // console.log(`User Found: ${foundUser.id}`)

    // Find posts from user
    const result = posts.filter(p => Number(p.userId) === Number(foundUser.id))

    if (!result) {
        next();
    }

    res.json({ result });
})

router.get('/:id', (req, res, next) => {
  const post = posts.find(p => p.id == req.params.id)

  const links = [
    {
      href: `/${req.params.id}`,
      rel: "",
      type: "PATCH",
    },
    {
      href: `/${req.params.id}`,
      rel: "",
      type: "DELETE",
    },
  ];

  if (post) res.json({ post, links });
  else next()
})

// NEW ROUTE
router.get('/posts', (req, res, next) => {

})

// Create Post
router.post('/', (req, res, next) => {

    if (!req.body.userId || !req.body.title || !req.body.content) {
        console.log(`POST /posts MISSING DATA`);
        next(error(400, "Insufficient Data"));
    }
  // Within the POST request route, we create a new
  // post with the data given by the client.
  // We should also do some more robust validation here,
  // but this is just an example for now.
  if (req.body.userId && req.body.title && req.body.content){
    const post = {
      id: posts[posts.length - 1].id + 1,
      userId:  req.body.userId,
      title: req.body.title,
      content: req.body.content
    }

    posts.push(post)
    res.json(post)
  } else {
    next(error(400, "Insufficient Data"))
  }
})

//Update a Post
router.patch('/:id', (req, res, next) => {
  // Within the PATCH request route, we allow the client
  // to make changes to an existing post in the database.
  const post = posts.find((p, i) => {
    if (p.id == req.params.id) {
      // req.body holds the update for the user
      for (const key in req.body) {
        // applying the req.body keys to the existing user keys, overwriting them
        posts[i][key] = req.body[key]
      }
      return true
    }
  })

  if (post) res.json(post)
  else next()
})

router.delete("/:id", (req, res, next) => {
  const post = posts.find((p, i) => {
    if (p.id == req.params.id) {
      posts.splice(i, 1)
      return true
    }
  })

  if (post) res.json(post);
  else next()
})


module.exports = router