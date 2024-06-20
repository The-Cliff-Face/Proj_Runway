// https://www.digitalocean.com/community/tutorials/how-to-handle-passwords-safely-with-bcryptsjs-in-javascript
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const url = process.env.MONGODB_URI;
console.log(url);
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();

const port = 3001;
const app = express();

app.use(express.json());
app.use(cors());

app.post('/api/signin', async (req, res) => {
    const db = client.db('Runway');
    const users = db.collection('Users');

    let user = await users.findOne({ email: req.body.email });
    console.log(user.email, user.password);
    let ret = {}
    res.status(200).json(ret);
});


app.listen(port, () => { console.log('app listening'); });