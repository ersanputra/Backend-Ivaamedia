const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();
require('./config/passport'); // Ensure the path is correct

const router = require('./routers/router');

const app = express();
const port = process.env.PORT || 3000;

// Enable All CORS Requests
app.use(cors());

// Initialize Passport
app.use(passport.initialize());

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use the router
app.use(router);

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}!`);
});
