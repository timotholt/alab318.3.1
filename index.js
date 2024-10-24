require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000

// Utility functions
const error = require('./utilities/error.js');

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ extended: true }))

// Install logger middleware
app.use((req, res, next) => {
    const time = new Date().toString()
    if (req && req.method && req.path) {
        console.log(time, req.method, req.path)
    } else {
        console.warn("Missing request properties", req)
    }
    next()
})

///////////////////////////////////////////////////////////////
// API-Key Middleware
//
// This middleware makes sure that the client
// has a valid API key.
///////////////////////////////////////////////////////////////

const apiKeys = ["perscholas", 'ps-example', 'hJasd3223-qeiurlw-qui323-quoew'];
app.use('/api', (req, res, next) => {

    const key = req.query['api-key'];

    // If the key is not in the list of valid keys, then return a 401 error
    if (!key || !apiKeys.includes(key)) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    
    // Add the key that was in the header to the request object
    req.key = key;
    next();
})

///////////////////////////////////////////////////////////////
// Install routing middleware
//
//      /api/users goes to ./routes/users.js
//      /api/posts goes to ./routes/posts.js
//
///////////////////////////////////////////////////////////////

app.use('/api/users', require('./routes/users'))
app.use('/api/posts', require('./routes/posts'))

///////////////////////////////////////////////////////////////
//
//      / goes to ./routes/index.js
//
///////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
    res.send("Work in progress!")
})

// 404 Error Handling Middleware
// Custom 404 (not found) middleware.
// Since we place this last, it will only process
// if no other routes have already sent a response!

app.use((err, req, res, next) => {
    console.log("I'm running! ", err)
    next(error(404, "Resource not found"))
})

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})
