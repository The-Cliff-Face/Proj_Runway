// using express.js instead of the Next.js App Router
// requires us to do some funky stuff to be able
// to run our frontend and backend simultaneously.
// see https://www.npmjs.com/package/concurrently
// for a potential solution.

// https://www.digitalocean.com/community/tutorials/how-to-handle-passwords-safely-with-bcryptsjs-in-javascript
const express = require('express');

// half of these I don't even remember why they're here sorry
const cors = require('cors');
const cookieParser = require('cookie-parser')
const path = require('path');
require('dotenv').config();

// https://www.npmjs.com/package/bcryptjs
const bcrypt = require('bcryptjs');
const saltLength = 8;

const url = process.env.MONGODB_URI;
console.log(url);
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();

// yes it's bad that this is hardcoded, we will use process.env.PORT or smth on Heroku
const port = 3001;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true
}));

const { sign } = require('jsonwebtoken');

// I'm pretty sure the email is just dummy data that we need
// to use for verification (i.e. it could be anything like a user id instead)
const createAccessToken = (email) => {
    return sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'
    });
}

const createRefreshToken = (email) => {
    return sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    });
};

//const sendRefreshToken = (res, refreshToken) => {
    //res.cookie('refreshToken', refreshToken, {
    //    httpOnly: true,
    //    path: '/refreshToken',
    //});
//};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

app.post('/api/signup', async (req, res) => {
    // TODO validate format of email and username

    const db = client.db('Runway');
    const users = db.collection('Users');

    bcrypt.hash(req.body.password, saltLength, function (err, hash) {
        let newUser = req.body;
        newUser.password = hash;
        newUser.emailIsVerified = false;
        newUser.verificationCode = getRandomInt(1000, 10000);
        users.insertOne(newUser);
        let ret = {}
        res.status(200).json(ret);
    });
});

app.post('/api/signin', async (req, res) => {
    const db = client.db('Runway');
    const users = db.collection('Users');

    let user = await users.findOne({ email: req.body.email });
    // compare user.password (which is hashed) to the hash of the
    // password sent to this API endpoint
    bcrypt.compare(req.body.password, user.password, function (err, res) {
        if (res) {
            console.log('Login successful!');
            //refreshToken = createRefreshToken(user.email);
        } else {
            console.log('PERMISSION DENIED');
        }
    });
    console.log(user.email, user.password);
    let ret = { accessToken: createAccessToken(user.email)};
    res.status(200).json(ret);
});

app.listen(port, () => { console.log('app listening'); });