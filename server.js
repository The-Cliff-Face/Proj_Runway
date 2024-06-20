// using express.js instead of the Next.js App Router
// requires us to do some funky stuff to be able
// to run our frontend and backend simultaneously.
// see https://www.npmjs.com/package/concurrently
// for a potential solution.

// https://www.digitalocean.com/community/tutorials/how-to-handle-passwords-safely-with-bcryptsjs-in-javascript
const express = require('express');
const cors = require('cors');
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

const port = 3001;
const app = express();

app.use(express.json());
app.use(cors());

app.post('/api/signup', async (req, res) => {
    const db = client.db('Runway');
    const users = db.collection('Users');

    bcrypt.hash(req.body.password, saltLength, function (err, hash) {
        let newUser = req.body;
        newUser.password = hash;
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
        // compare password to one in DB
    });
    console.log(user.email, user.password);
    let ret = {}
    res.status(200).json(ret);
});


app.listen(port, () => { console.log('app listening'); });