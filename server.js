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
const next = require('next');
const { Worker } = require('worker_threads');

//const Engine = require('./search_engine/SearchEngine');
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
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true
}));

const { validateEmail } = require('./verification.js');
const { validateUsername } = require('./verification.js');

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



// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

app.post('/api/signup', async (req, res) => {
    // input json:
    // { "username": [ALNUM], "email": "example@site.com", "password": [PLAINTEXT]}
    // output json:
    // { "error": [ERROR MESSAGE] }


    // TODO check for duplicate usernames/emails

    if (!req.body.username) {
        res.status(200).json({ error: 'No username provided' });
        return;
    }
    if (!req.body.email) {
        res.status(200).json({ error: 'No email provided' });
        return;
    }
    if (!req.body.password) {
        res.status(200).json({ error: 'No password provided' });
        return;
    }
    if (!validateEmail(req.body.email)) {
        res.status(200).json({ error: 'Invalid email format' });
        return;
    }
    if (!validateUsername(req.body.username)) {
        res.status(200).json({ error: 'Invalid username format' });
        return;
    }

    const db = client.db('Runway');
    const users = db.collection('Users');

    bcrypt.hash(req.body.password, saltLength, function (err, hash) {
        if (err) {
            res.status(200).json({ error: 'Unable to signup new user' });
            return;
        }

        let newUser = req.body;
        newUser.password = hash;
        newUser.emailIsVerified = false;
        newUser.verificationCode = getRandomInt(1000, 10000);
        users.insertOne(newUser);
        let ret = { error: '' };
        res.status(200).json(ret);
    });
});


app.post('/api/signin', async (req, res) => {
    // input json:
    // { "email": "example@site.com", "password": [PLAINTEXT] }
    // output json:
    // { "accessToken": "eyJhlkfjdsfudsafi", "error": [ERROR MESSAGE] }
    // also the refreshToken is returned as an httpOnly cookie in the header

    const db = client.db('Runway');
    const users = db.collection('Users');

    let user = await users.findOne({ email: req.body.email });
    // compare user.password (which is hashed) to the hash of the
    // password sent to this API endpoint
    bcrypt.compare(req.body.password, user.password, function (err, res) {
        if (res) {
            console.log('Login successful!');
        } else {
            console.log('PERMISSION DENIED');
        }
    });
    refreshToken = createRefreshToken(user.email);
    //console.log(user.email, user.password);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/refreshToken',
    });
    let ret = { accessToken: createAccessToken(user.email) };
    res.status(200).json(ret);
});


async function grabClothingData() {
    const db = client.db("Runway");
    const collection = db.collection("Clothing");
    const documents = await collection.find({}).toArray();
    worker.postMessage({ type: 'start' , task: documents});
}


//https://nodejs.org/api/worker_threads.html
const worker = new Worker('./search_engine/SearchEngine.js');
let loadedBool = false;
grabClothingData();


worker.on('message', (msg) => {
    if (msg.type === 'loaded') {
        console.log("Search Worker Started");
        loadedBool = true;
    }

});



app.post('/api/spellcheck', async (req, res) => {
    const { word } = req.body;
    if (!loadedBool) {
        res.status(404,{results:[], error:"Not loaded yet"});
        return
    }
    worker.postMessage({ type: 'spellcheck', task:word });

    worker.once('message', (msg) => {
        if (msg.type === 'spellResult') {
            ret = msg.result;
            if (ret=== "") {
                let ret = {word:"", error:"Closest match not found"}
                res.status(404,ret);
                
            } else {
                res.status(200).json({results: ret, error:""});
            }
            
        }
    });

});


app.post('/api/search', async (req, res) => {
    const { search, max_results } = req.body;
    if (!loadedBool) {
        res.status(404,{results:[], error:"Not loaded yet"});
        return
    }
    worker.postMessage({ type: 'query', task:{field:search, max_results:max_results} });
    let ret = {};
    worker.once('message', (msg) => {
        if (msg.type === 'queryResult') {
            ret = msg.result;
            res.status(200).json({results: ret, error:""});
        }
    });

    if (ret.length == 0) {
        res.status(404).json({results: ret, error:"not found"});
        return;
    }
    
    
});


app.listen(port, () => { console.log(`express backend listening on port ${port}`); });