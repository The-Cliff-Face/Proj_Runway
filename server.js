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
const { Worker } = require('worker_threads');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const fs = require('fs');
//const Engine = require('./search_engine/SearchEngine');
require('dotenv').config();

// https://www.npmjs.com/package/bcryptjs
const bcrypt = require('bcryptjs');
const saltLength = 8;
const url = process.env.MONGODB_URI;

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
const { validateRecommendationInput } = require('./verification.js');
const { sendVerificationEmail, sendResetEmail } = require('./mailgun.js');
const { sign } = require('jsonwebtoken');


// helper function i made to remove elements from an array
function remove(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

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

    const userProfiles = db.collection('userProfiles');
    const duplicateUser = await userProfiles.findOne({email: req.body.email});
    if (duplicateUser != null) {
        res.status(200).json({ error: 'Duplicate User!' });
        return;
    }

    bcrypt.hash(req.body.password, saltLength, function (err, hash) {
        if (err) {
            res.status(200).json({ error: 'Unable to signup new user' });
            return;
        }

        let newUser = req.body;
        newUser.password = hash;
        newUser.emailIsVerified = false;
        newUser.verificationCode = getRandomInt(1000, 10000);
        sendVerificationEmail(
            newUser.verificationCode,
            newUser.email
        );
        const db = client.db('Runway');
        const userProfiles = db.collection('userProfiles');
    
        let newProfile = {email: req.body.email, username: req.body.username, hasTakenSurvey: false};
        userProfiles.insertOne(newProfile);

        users.insertOne(newUser);
        let ret = { error: '' };
        res.status(200).json(ret);
    });
});

app.post('/api/verify_email', async (req, res) => {
    // input JSON: { email: "asdf@gmail.com", code: XXXX }

    const db = client.db('Runway');
    const users = db.collection('Users');
    let user = await users.findOne({email: req.body.email});
    
    if (user && user.verificationCode == req.body.code) {
        users.updateOne({email: req.body.email},
            { 
                $set: {"emailIsVerified": true},
            }
        );
        
        res.status(200).json({error: ""});
    } else {
        res.status(401).json({error: "Invalid verification code"});
    }
});

// There are two steps to resetting a forgotten password.
// The first is to generate a reset code, store this reset code in the DB, and send it to a user's email.


// The second is to take in an attempted reset code, an email, and a new password.
// Then, if the provided reset code matches the stored code for the given email,
// update the user's password to the new password.

// Initiate: generate reset code and send email
app.post('/api/initiate_reset_password', async (req, res) => {
    // input JSON: { "email": "forgetfuljoe@gmail.com" }
    // output JSON: { "error": "applicable error message here" }

    if (!req.body.email) {
        res.status(200).json({ error: 'No email provided' });
        return;
    }

    if (!validateEmail(req.body.email)) {
        res.status(200).json({ error: 'Invalid email format' });
        return;
    }

    const db = client.db('Runway');
    const users = db.collection('Users');
    let user = await users.findOne({ email: req.body.email });

    if (user) {
        let resetCode = getRandomInt(1000, 10000);
        // unconditionally update, because each reset attempt should create a new reset code
        users.updateOne({ email: req.body.email },
            { $set: {"resetCode": resetCode} }
        );
        sendResetEmail(resetCode, req.body.email);
        res.status(200).json({ error: '' });
    } else {
        res.status(401).json({ error: 'No account found for provided email' });
    }
});

// Terminate: check validity of reset code and set new password
app.post('/api/terminate_reset_password', async (req, res) => {
    // input JSON: { "email": "forgetfuljoe@gmail.com", "code": 5689, "password": "newPassword11" }
    // output JSON: { "error": "applicable error message here" }

    if (!req.body.email) {
        res.status(200).json({ error: 'No email provided' });
        return;
    }

    if (!validateEmail(req.body.email)) {
        res.status(200).json({ error: 'Invalid email format' });
        return;
    }

    if (!req.body.code) {
        res.status(200).json({ error: 'No reset code provided' });
        return;
    }

    if (!req.body.password) {
        res.status(200).json({ error: 'No password provided' });
        return;
    }

    const db = client.db('Runway');
    const users = db.collection('Users');
    let user = await users.findOne({ email: req.body.email });

    if (user && user.resetCode) {
        if (user.resetCode === req.body.code) {
            // update user's entry in DB with hash of new password
            bcrypt.hash(req.body.password, saltLength, function (err, hash) {
                users.updateOne({ email: req.body.email },
                    { $set: {"password": hash} },
                );
                res.status(200).json({ error: '' });
            });
        } else {
            res.status(401).json({ error: 'Invalid reset code' });
        }
    } else {
        res.status(401).json({ error: 'No account found for provided email' });
    }
});


// The second is to take in an attempted reset code, an email, and a new password.
// Then, if the provided reset code matches the stored code for the given email,
// update the user's password to the new password.

// Initiate: generate reset code and send email
app.post('/api/initiate_reset_password', async (req, res) => {
    // input JSON: { "email": "forgetfuljoe@gmail.com" }
    // output JSON: { "error": "applicable error message here" }

    if (!req.body.email) {
        res.status(200).json({ error: 'No email provided' });
        return;
    }

    if (!validateEmail(req.body.email)) {
        res.status(200).json({ error: 'Invalid email format' });
        return;
    }

    const db = client.db('Runway');
    const users = db.collection('Users');
    let user = await users.findOne({ email: req.body.email });
    
    if (user) {
        let resetCode = getRandomInt(1000, 10000);
        // unconditionally update, because each reset attempt should create a new reset code
        users.updateOne({ email: req.body.email },
            { $set: {"resetCode": resetCode} }
        );
        sendResetEmail(resetCode, req.body.email);
        res.status(200).json({ error: '' });
    } else {
        res.status(401).json({ error: 'No account found for provided email' });
    }
});

// Terminate: check validity of reset code and set new password
app.post('/api/terminate_reset_password', async (req, res) => {
    // input JSON: { "email": "forgetfuljoe@gmail.com", "code": 5689, "password": "newPassword11" }
    // output JSON: { "error": "applicable error message here" }

    if (!req.body.email) {
        res.status(200).json({ error: 'No email provided' });
        return;
    }

    if (!validateEmail(req.body.email)) {
        res.status(200).json({ error: 'Invalid email format' });
        return;
    }

    if (!req.body.code) {
        res.status(200).json({ error: 'No reset code provided' });
        return;
    }

    if (!req.body.password) {
        res.status(200).json({ error: 'No password provided' });
        return;
    }

    const db = client.db('Runway');
    const users = db.collection('Users');
    let user = await users.findOne({ email: req.body.email });

    if (user && user.resetCode) {
        if (user.resetCode === req.body.code) {
            // update user's entry in DB with hash of new password
            bcrypt.hash(req.body.password, saltLength, function (err, hash) {
                users.updateOne({ email: req.body.email },
                    { $set: {"password": hash} },
                );
                res.status(200).json({ error: '' });
            });
        } else {
            res.status(401).json({ error: 'Invalid reset code' });
        }
    } else {
        res.status(401).json({ error: 'No account found for provided email' });
    }
});

app.post('/api/createProfile', async (req, res) =>  {
    // input JSON: { "email": "forgetfuljoe@gmail.com", "username": "joe"}
    // output JSON: { ret: {userProfile object} "error": "applicable error message here" }
    const tokenResult = verifyAndDecodeToken(req);
    if (tokenResult.hasOwnProperty('error')) {
        res.status(401).json({results: "", error:tokenResult.error});
        return;
    }

    const {email, username} = req.body;
    if (!email) {
        res.status(200).json({results: "", error:"No email provided"});
        return;
    } 
    if (!username) {
        res.status(200).json({results: "", error:"No username provided"});
        return;
    }  
    const db = client.db('Runway');
    const userProfiles = db.collection('userProfiles');
    let newUser = req.body;
    const tmp = await userProfiles.findOne({email: email})
    if (tmp != null) {
        res.status(200).json({results: "", error:"Profile already created!"});
        return;
    }
    userProfiles.insertOne(newUser);
    let ret = { ret: newUser, error: '' };
    res.status(200).json(ret);
});


app.post('/api/getProfile', async (req, res) =>  {
    // input JSON: { "email": "forgetfuljoe@gmail.com"}
    // output JSON: { ret: {userProfile object} "error": "applicable error message here" }
    let { email } = req.body;

    const tokenResult = verifyAndDecodeToken(req);
    if (tokenResult.hasOwnProperty('error')) {
        res.status(401).json({results: "", error:tokenResult.error});
        return;
    }
   
    if (!email) { // use tokens instead if no email is provided
        email = tokenResult.email;   
    }
    const db = client.db('Runway');
    const userProfiles = db.collection('userProfiles');
    let user = await userProfiles.findOne({"email": email});

    if (!user) {
        res.status(200).json({ error: 'No user found!'});
        return;
    }
    let likes = [];
    if (user.liked) {
        likes = user.liked;
    }
    let hasTakenSurvey = false;
    if (user.hasOwnProperty('hasTakenSurvey')) {
        hasTakenSurvey = user.hasTakenSurvey;
    }
    
    res.status(200).json({ res: user.username, likes:likes, hasTakenSurvey: hasTakenSurvey, error: '' });

});


app.post('/api/updateRecommendations', async (req, res) => {
    // input: recommandation Matrix
    const { recommendation } = req.body;
    if (!recommendation) {
        res.status(200).json({ error: 'Must supply recommendations!'});
        return;
    }
    /*
    if (!validateRecommendationInput(recommendation)) {
        res.status(200).json({ error: 'Invalid Recommendation Input'});
       
        return;
    }
    */
    const tokenResult = verifyAndDecodeToken(req);
    if (tokenResult.hasOwnProperty('error')) {
        res.status(401).json({error:tokenResult.error});
        return;
    }
    const db = client.db('Runway');
    const userProfiles = db.collection('userProfiles');
    //console.log(recommendation);
    await userProfiles.updateOne({"email":tokenResult.email}, {
        $set: {'recommendations': recommendation},
    });
    // seperate them out because mongodb does not update documents even if one of the parameters does not change
    // idiotic programming on their part
    await userProfiles.updateOne({"email":tokenResult.email}, {
        $set: {'hasTakenSurvey': true},
    });
    

    res.status(200).json({message:'Success Updated Document!', error: ''});

});

app.post('/api/logout', (req, res) => {
    // Logs out the user
    res.clearCookie('refreshToken', {
      path: '/',
      sameSite: 'strict',
    });
    res.status(200).json({error: ''});
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
    // Add check that email is verified - Leinecker specifically called a group out on this point
    if (!user.emailIsVerified) {
        res.status(200).json({ error: 'Please verify your email before signing in' });
        return;
    }

    // compare user.password (which is hashed) to the hash of the
    // password sent to this API endpoint
    bcrypt.compare(req.body.password, user.password, function (err, bRes) {
        if (bRes) {
            
            refreshToken = createRefreshToken(user.email);
            //console.log(user.email, user.password);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, 
                //sameSite: 'strict',
            });

            let ret = { accessToken: createAccessToken(user.email) };

            res.status(200).json(ret);
            
            
        } else {
            console.log('PERMISSION DENIED');
            res.status(200).json({ error: 'No user found!' });
        }
    });
    
});

app.post('/api/getWhatsHot', async (req, res) => {
    // output json:
    // { "ret": [productEntry], "error": [ERROR MESSAGE] }
    const tokenResult = verifyAndDecodeToken(req);
    if (tokenResult.hasOwnProperty('error')) {
        res.status(401).json({results: "", error:tokenResult.error});
        return;
    } 
    try {
        const db = client.db("Runway");
        const collection = db.collection("comments");
        const documents = await collection.find({}).toArray();
        let scores = [];
        for (let i=0;i<documents.length;i++) {
            const document = documents[i];
            if (document.likes) {
                scores.push({id: document.id, score: document.likes});
            }
        }
        scores.sort((a, b) => b.score - a.score);
    
        const clothes = db.collection("Clothing_new");
        let ret = [];
        for (let i=0;i<scores.length;i++) {
            const item = await clothes.findOne({'id':scores[i].id});
            ret.push(item);
        }
        res.status(200).json({results: ret, error:""});
    } catch (e) {
        res.status(500).json({results: [], error:e});
    }
    
});

app.post('/api/getUserLikes', async (req, res) => {
    const tokenResult = verifyAndDecodeToken(req);
    if (tokenResult.hasOwnProperty('error')) {
        res.status(401).json({results: "", error:tokenResult.error});
        return;
    } 
    const db = client.db("Runway");
    const userProfiles = db.collection('userProfiles');
    const Clothing = db.collection("Clothing_new");
    let user = await userProfiles.findOne({"email": tokenResult.email});
    if (!user) {
        res.status(404).json({results: [], error:"cant find user"});
        return;
    }

    const likes = user.liked;
    
    if (!likes) {
        res.status(200).json({results: [], error:""});
        return;
    }
    
    let ret = [];
    try {
        for (let i=0;i<likes.length;i++) {
            const item = await Clothing.findOne({id:likes[i]});
            if (!item){
                continue;
            }
            ret.push(item);
        }
        res.status(200).json({results: ret, error:""});
        return;
    } catch (e) {
        res.status(200).json({results: [], error:e});
        return;
    }
    
});


app.post('/api/refresh', async (req, res) => { 
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
            if (error) return res.sendStatus(403);
            const accessToken = { accessToken: createAccessToken(user.email) };
            res.json(accessToken);
        });
    } catch (e) {
        res.sendStatus(500);
    }
    
});

async function grabClothingData() {
    const filePath = path.join(__dirname+'/search_engine/', 'data.json');
    if (fs.existsSync(filePath)) {
        worker.postMessage({type: 'readAndLoadData'});
        return true;
    }
    return false;
    

}

async function grabData() {
    const db = client.db("Runway");
    const male_clusters = db.collection("clusters_men_new");
    console.log("grabbing data 1/4");
    const male_clusters_data = await male_clusters.find({}).toArray();

    const female_clusters = db.collection("clusters_women_new");
    console.log("grabbing data 2/4");
    const female_cluster_data = await female_clusters.find({}).toArray();

    console.log("grabbing data 3/4");
    const clusCol = db.collection("clusters_new");
    const clusters = await clusCol.find({}).toArray();
    recommenderWorker.postMessage({type: 'start', task: {clusters, male_clusters_data, female_cluster_data}});

    const hasData = await grabClothingData();
    if (hasData) {
        console.log("Using serialized data");
        return;
    } 
    console.log("grabbing data 4/4");
    const collection = db.collection("Clothing_new");
    const documents = await collection.find({}).toArray();
    worker.postMessage({ type: 'start' , task: {documents}});
    
}
 

//https://nodejs.org/api/worker_threads.html
const worker = new Worker('./search_engine/SearchEngine.js');
const recommenderWorker = new Worker('./search_engine/Recommender.js');
grabData();

const searchRequestMap = new Map();
worker.on('message', (msg) => {
    if (msg.type === 'loaded') {
        console.log("Search Worker Started");
    }
    if (msg.type.startsWith('query')) {
        const requestId = msg.type.split('+')[1];
        const { resolve, reject } = searchRequestMap.get(requestId) || {};
        if (resolve) {
            resolve(msg.result);
            searchRequestMap.delete(requestId);
        } else {
            reject(new Error('we lost your req id'));
        }
    }
});

recommenderWorker.on('message', (msg) => {
    if (msg.type === 'loaded') {
        console.log("Recommend Worker Started");
        
    }
});


app.post('/api/recommend', async (req, res) => {

    const tokenResult = verifyAndDecodeToken(req);
    if (tokenResult.hasOwnProperty('error')) {
        res.status(401).json({results: "", error:tokenResult.error});
        return;
    }
    const db = client.db('Runway');
    const userProfiles = db.collection('userProfiles');
    let user = await userProfiles.findOne({"email": tokenResult.email});
    if (!user) {
        res.status(404).json({ error: 'No user found!' });
        return;
    }
    if (!user.recommendations) {
        res.status(200).json({error:"Invalid User Profile!"});
        return;
    }

    const recommendation = user.recommendations;
    recommenderWorker.postMessage({ type: 'recommend', task: {rec:recommendation, type:recommendation.other.gender} });
    recommenderWorker.once('message', (msg) => {
        if (msg.type === 'recommendResult') {
            ret = msg.results;
            res.status(200).json({results: ret, error:""});
            
        }
    });

});




app.post('/api/spellcheck', async (req, res) => {
    // input json:
    // { "word": "jeens" }
    // output json:
    // { "results": "jeans", "error": [ERROR MESSAGE] }
    // compares the misspelled word with the closest match in the dataset, not true spell check!!!
    const { word } = req.body;

    const tokenResult = verifyAndDecodeToken(req);
    if (tokenResult.hasOwnProperty('error')) {
        res.status(401).json({results: "", error:tokenResult.error});
        return;
    } 
    
    worker.postMessage({ type: 'spellcheck', task:word });

    worker.once('message', (msg) => {
        if (msg.type === 'spellResult') {
            ret = msg.result;
            if (ret=== "") {
                let ret = {word:"", error:"Closest match not found"}
                res.status(404).json({ret});
                
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
    // input json:
    // { "search": "jeans", max_results: 100 }
    // output json:
    // { "results": [Products], "error": [ERROR MESSAGE] }
    // searches using the Search Engine Worker
    // error code: 200: found results
    // error code: 404: did not find anything with the search term
    // error code: 500: either the server crashed or the worker is not ready yet

    const { search, max_results } = req.body;

    
    const tokenResult = verifyAndDecodeToken(req);
    if (tokenResult.hasOwnProperty('error')) {
        res.status(401).json({results: "", error:tokenResult.error});
        return;
    } 
    const requestId = crypto.randomUUID(); 

    const resultPromise = new Promise((resolve, reject) => {
        searchRequestMap.set(requestId, { resolve, reject });
    });
    
    worker.postMessage({ type: 'query', task:{id:requestId, field:search, max_results:max_results} });

    try {
        const result = await resultPromise;
        if (result.ret.length > 0) {
            res.status(200).json({ results: result, error: "" });
        } else {
            res.status(404).json({ results: result, error: "not found" });
        }
    } catch (error) {
        res.status(500).json({ results: "", error: error.message });
    }
    
});

app.post('/api/genderedSearch', async (req, res) => {
    // input json:
    // { "search": "jeans", max_results: 100, type: "male" }
    // output json:
    // { "results": [Products], "error": [ERROR MESSAGE] }
    // searches using the Search Engine Worker with Gender Settings
    // Note that "type" is option, if its not provided, the gender will be accessed through the user profile
    // error code: 200: found results
    // error code: 404: did not find anything with the search term, or type not provided and userprofile not found
    // error code: 500: either the server crashed or the worker is not ready yet

    const { search, max_results, type } = req.body;
    
    
    const tokenResult = verifyAndDecodeToken(req);
    if (tokenResult.hasOwnProperty('error')) {
        res.status(401).json({results: "", error:tokenResult.error});
        return;
    }
    const db = client.db('Runway');
    const userProfiles = db.collection('userProfiles');
    let user = await userProfiles.findOne({"email": tokenResult.email});
    if (!user) {
        res.status(404).json({ error: 'No user found!' });
        return;
    }
    if (!user.recommendations) {
        res.status(200).json({error:"Invalid User Profile!"});
        return;
    }

    const recommendation = user.recommendations;
    let gender = "all";
    if (!type) {
        gender = recommendation.other.gender;;
    } else {
        gender = type;
    }

    const requestId = crypto.randomUUID(); 

    const resultPromise = new Promise((resolve, reject) => {
        searchRequestMap.set(requestId, { resolve, reject });
    });

    //const { search, max_results } = req.body;
    worker.postMessage({ type: 'gendered_query', task:{id:requestId, field:search, max_results:max_results, type: gender} });
    try {
        const result = await resultPromise;
        if (result.ret.length > 0) {
            res.status(200).json({ results: result, error: "" });
        } else {
            res.status(404).json({ results: result, error: "not found" });
        }
    } catch (error) {
        res.status(500).json({ results: {ret:[]}, error: error.message });
    }
    
});

/**
 * updates recommendations to better fit the user interests
 * @param {object} params object
 * @returns { Void } nothing
 */
async function updateUserRecommendationsBasedOffPost(params) {
    const { id, like, userProfiles, tokenResult, user } = params;
    const db = client.db('Runway');
    const clothing = db.collection('Clothing');
    const item = await clothing.findOne({id:id});

    let recommendation = user.recommendations;
    if (typeof recommendation == 'null') {
        return;
    }
    // this can be set to anything
    const modifier = 10;

    if (item) {
        const tokens = item.name_processed.split(" ");
        for (let i=0;i<tokens.length;i++) {
            const word = tokens[i].toLowerCase();
            if (word !== 'gender') {
                if (recommendation.other.hasOwnProperty(word)) {
                    recommendation.other[word] += like * modifier;
                } else {
                    recommendation.other[word] = like * modifier;
                }
            }
        }

    }
    userProfiles.updateOne({"email": tokenResult.email}, {
        $set: {'recommendations': recommendation},
    });


}

/**
 * updates likes in the profile
 * @param {object} params object
 * @returns { Void } nothing
 */
function updateUserLikes(params) {
    const { id, like, userProfiles, tokenResult, user } = params;
    if (!user.liked && like>0) {
        userProfiles.updateOne({"email": tokenResult.email}, {
            $set: {'liked': [id]},
        });
        
        return true;
    }
    let liked = user.liked;
    
    if (like > 0) {
        if (liked.includes(id)) {
            return false;
        }
        liked.push(id);
    } else {
        remove(liked,id);
    }
    userProfiles.updateOne({"email": tokenResult.email}, {
        $set: {'liked': liked},
    });
    return true;
}

/**
 * updates likes in the product document
 * @param {object} params object
 * @returns { Void } nothing
 */
async function updateDocumentLikes(params) {
    const { id, like, tokenResult, comments,user } = params;
    
    let comment = await comments.findOne({ id: id});
    if (!comment) {
        let newDocument = {
            comments: [],
            id: id,
            likes: like,
            usersThatLiked: [user.username],
        }
        comments.insertOne(newDocument);
        return;
    }
    if (!comment.likes) {
        comment.likes = like;
    } else {
        comment.likes+=like;
    }
    let usersThatLiked = comment.usersThatLiked;
    if (!usersThatLiked) {
        usersThatLiked = [];
    }
    usersThatLiked.push(user.username);
    comments.updateOne({id:id}, {
        $set: {'likes': comment.likes},
        $set: {'usersThatLiked': usersThatLiked}
    });
    
    
}

app.post('/api/like', async (req, res) =>  {
    // input json:
    // { "id": "5", like: 1 }
    // output json:
    // { "success": Boolean, "error": [ERROR MESSAGE] }
    // likes a product, can unlike if the like parameter is negative

    const { id, like } = req.body;

    const tokenResult = verifyAndDecodeToken(req);
    if (tokenResult.hasOwnProperty('error')) {
        res.status(401).json({results: "", error:tokenResult.error});
        return;
    } 
    
    const db = client.db('Runway');
    const userProfiles = db.collection('userProfiles');
    const comments = db.collection('comments');
    
    let user = await userProfiles.findOne({"email": tokenResult.email});
    if (!user) {
        res.status(404).json({sucess:"false", error:"Invalid user!"});
        return;
    }
    const params = {id:id, like:like, userProfiles:userProfiles, tokenResult:tokenResult, user:user, comments:comments};
    const didLike = updateUserLikes(params);
    if (didLike) {
        updateDocumentLikes(params);
        updateUserRecommendationsBasedOffPost(params);
    } else {
        res.status(200).json({sucess: "false", error:"duplicate like"});
        return;
    }
    
    
    res.status(200).json({sucess: "true", error:""});

});


app.post('/api/postComment', async (req, res) =>  {
     // input json:
    // { "id": "5", "message": "this is the worst piece of clothing i ever seen, would buy again" }
    // output json:
    // { "success": Boolean, "error": [ERROR MESSAGE] }
    // likes a product, can unlike if the like parameter is negative
    const { message, id } = req.body;
    const tokenResult = verifyAndDecodeToken(req);
    if (tokenResult.hasOwnProperty('error')) {
        res.status(401).json({results: "", error:tokenResult.error});
        return;
    } 
    
    const db = client.db('Runway');
    const userProfiles = db.collection('userProfiles');
    const comments = db.collection('comments');
    let user = await userProfiles.findOne({"email": tokenResult.email});
    if (!user) {
        res.status(200).json({sucess: "false", error:"Cannot find user"});
        return;
    }
    const comment = {"message":message, "username":user.username};
    let document = await comments.findOne({ id: id});
    if (!document) {
        let newDocument = {
            comments: [comment],
            id: id,
            likes:0,
        }
        comments.insertOne(newDocument);
    } else {
        let cur = document.comments;
        cur.push(comment);
        comments.updateOne({id:id}, {
            $set: {'comments': cur},
        });
    }
    res.status(200).json({sucess: "true", error:""});

});

app.post('/api/viewComments', async (req, res) =>  {
    const { id } = req.body;

    const tokenResult = verifyAndDecodeToken(req);
    if (tokenResult.hasOwnProperty('error')) {
        res.status(401).json({results: "", error:tokenResult.error});
        return;
    } 

    const db = client.db('Runway');
    const comments = db.collection('comments');
    let document = await comments.findOne({ id: id});
    if (!document) {
        let ret = {comments: []};
        res.status(200).json({ret:ret, error:""});
        return;
    }
    let likes = 0;
    if (document.likes) {
        likes = document.likes;
    } 
    let usersThatLiked = [];
    if (document.usersThatLiked) {
        usersThatLiked = document.usersThatLiked;
    }
    let ret = {comments: document.comments};
    res.status(200).json({ret:ret,likes:likes, usersLiked:usersThatLiked, error:""});

});



app.listen(port, () => { console.log(`express backend listening on port ${port}`); });
