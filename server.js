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
const jwt = require("jsonwebtoken");
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
const { KeyboardReturnRounded, KeyboardReturnOutlined } = require('@mui/icons-material');
const { Truculenta } = require('next/font/google/index.js');

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

    if (!req.body.email) {
        res.status(200).json({ error: 'No email provided' });
        return;
    }
    if (!req.body.password) {
        res.status(200).json({ error: 'No password provided' });
        return;
    }

    const db = client.db('Runway');
    const users = db.collection('Users');

    let user = await users.findOne({ email: req.body.email });
    if (!user) {
        res.status(200).json({ error: 'No user found!' });
        return;
    }
    // compare user.password (which is hashed) to the hash of the
    // password sent to this API endpoint

    
    bcrypt.compare(req.body.password, user.password, function (err, bRes) {
        if (bRes) {
            console.log('Login successful!');
            refreshToken = createRefreshToken(user.email);
            //console.log(user.email, user.password);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/refreshToken',
            });

            let ret = { accessToken: createAccessToken(user.email) };

            res.status(200).json(ret);
            
            
        } else {
            console.log('PERMISSION DENIED');
            res.status(200).json({ error: 'No user found!' });
        }
    });
    
});


async function grabClothingData() {
    const db = client.db("Runway");
    const collection = db.collection("Clothing");
    console.log("Reading Documents");
    const documents = await collection.find({}).toArray();
    worker.postMessage({ type: 'start' , task: documents});
}


//https://nodejs.org/api/worker_threads.html
const worker = new Worker('./search_engine/SearchEngine.js');
grabClothingData();


worker.on('message', (msg) => {
    if (msg.type === 'loaded') {
        console.log("Search Worker Started");
        
    }
});



app.post('/api/spellcheck', async (req, res) => {
    const { word } = req.body;

    const tokenResult = verifyAndDecodeToken(req);
    if (typeof tokenResult == "boolean") {
        res.status(401).json({results: "", error:"token problem"});
        return;
    } else {
        console.log(tokenResult);
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

/**
 * Verifies tokens in the req.header
 * @param {object} req
 * @returns { Object } False for invalid tokens, Returns Decoded token
 */
function verifyAndDecodeToken(req) {
    if(!req.headers.authorization) {
        return {"error":"No req auth headers","result":false};
            
    }
    const token = req.headers.authorization;
    if (!token) {
        return {"error":"no token in req header auth","result":false};
    }
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return decodedToken;
        
    } catch (error) {
        return {"error":error,"result":false};
    }

}

//https://www.geeksforgeeks.org/how-to-implement-jwt-authentication-in-express-js-app/
app.post('/api/search', async (req, res) => {

    const { search, max_results } = req.body;

    
    const tokenResult = verifyAndDecodeToken(req);
    if (tokenResult.hasOwnProperty('error')) {
        res.status(401).json({results: "", error:tokenResult.error});
        return;
    } else {
        console.log(tokenResult);
    }
    
    
    //const { search, max_results } = req.body;
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

app.post('/api/postComment', async (req, res) =>  {
    const { message, id } = req.body;

    const tokenResult = verifyAndDecodeToken(req);
    if (typeof tokenResult == "boolean") {
        res.status(401).json({results: "", error:"token problem"});
        return;
    } else {
        console.log(tokenResult);
    }

    const db = client.db('Runway');
    const comments = db.collection('comments');
    let document = await comments.findOne({ id: id});
    if (!document) {
        let newDocument = {
            comments: [message],
            id: id,
        }
        comments.insertOne(newDocument);
    } else {
        let cur = document.comments;
        cur.push(message);
        comments.updateOne({id:id}, {
            $set: {'comments': cur},
        });
    }
    res.status(200).json({sucess: "true", error:""});

});

app.post('/api/viewComments', async (req, res) =>  {
    const { id } = req.body;

    const tokenResult = verifyAndDecodeToken(req);
    if (typeof tokenResult == "boolean") {
        res.status(401).json({results: "", error:"token problem"});
        return;
    } else {
        console.log(tokenResult);
    }

    const db = client.db('Runway');
    const comments = db.collection('comments');
    let document = await comments.findOne({ id: id});
    let ret = {comments: document.comments};
    res.status(200).json({ret:ret, error:""});

});



app.listen(port, () => { console.log(`express backend listening on port ${port}`); });