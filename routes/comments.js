const express = require("express");
const router = express.Router();

const posts = require("../data/posts.js")
const comments = require("../data/comments.js")

const error = require("../utilities/error.js")
const users = require("../data/users.js")

//////////////POSTS//////////////
router.get('/', (req, res) => {

    // If there is no userId or postId query parameter, return all 
    if (!req.query.userId && !req.query.postId) {

        console.log(`GET /comments with no userId or postId parameter`);

        const links = [
            {
                href: "comments/:id",
                rel: ":id",
                type: "GET",
            },
        ];
        
        return res.json({ comments, links })
    };

    // Otherwise we got a query parameter. If it's a userId ...
    if (req.query.userId) {
        console.log(`GET /comments?userId=${req.query.userId}`);
    }

    // // Check to make user userId is a number
    // if (!req.query.userId)
    //     next();

    // // Find the user
    // const foundUser = users.find(u => u.id == req.query.userId)
    // if (!foundUser)
    //     next();

    // // console.log(`User Found: ${foundUser.id}`)

    // // Find posts from user
    // const result = posts.filter(p => Number(p.userId) === Number(foundUser.id))

    // if (!result) {
    //     next();
    // }

    // res.json({ result });
})

router.get('/:id', (req, res, next) => {
  const comment = comments.find(p => p.id == req.params.id)

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

  if (comment) res.json({ comments, links });
  else next()
})

// NEW ROUTE
router.get('/posts', (req, res, next) => {

})

// Create Post
router.post('/', (req, res, next) => {


    console.log(`POST /comments`);
  // Within the POST request route, we create a new
  // post with the data given by the client.
  // We should also do some more robust validation here,
  // but this is just an example for now.
  if (req.body.userId && req.body.postId && req.body.body){
    const comment = {
      id: comments[comments.length - 1].id + 1,
      userId:  req.body.userId,
      postId: req.body.postId,
      body: req.body.body
    }

    console.log(comment);

    comments.push(comment)
    res.json(comment)
  } else {
    next(error(400, "Insufficient Data"))
  }
})

//Update a comment (only the body!)
router.patch('/:id', (req, res, next) => {
  // Within the PATCH request route, we allow the client
  // to make changes to an existing comment in the database.
  const comment = comments.find((c, i) => {
    if (c.id == req.params.id) {
      // req.body holds the update for the comment
      comments[i].body = req.body.body;
      return true
    }
  })

  if (comment) res.json(comment)
  else next()
})

// Updated for comments

//BUGGY//
router.delete("/:id", (req, res, next) => {
  const comment = comments.find((c, i) => {
    if (c.id == req.params.id) {
      comment.splice(i, 1)
      return true
    }
  })

  if (comment) res.json(comment);
  else next()
})


module.exports = router