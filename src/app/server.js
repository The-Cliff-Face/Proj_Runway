const express = require('express');
const cors = require('cors');
const path = require('path');

const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();

const port = 3001;
const app = express();

app.use(
    express.static(path.join(__dirname, 'frontend/build')));
app.get('/', (req, res) => {
    res.send(path.resolve(__dirname, 'frontend', 'build',
        'index.html'));
});

app.use(express.json());
app.use(cors());


app.post('/api/addcard', (req, res) => {
    let error = '';

    const { userId, card } = req.body;

    const newCard = { Card: card, UserId: userId };
    try {
        const db = client.db('COP4331Cards');
        const result = db.collection('Cards').insertOne(newCard);
    }
    catch (e) {
        error = e.toString();
    }

    let ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/login', async (req, res) => {
    let error = '';

    const { login, password } = req.body;

    const db = client.db('COP4331Cards');
    const results = await
        db.collection('Users').find(
            {
                Login: login,
                Password: password
            }).toArray();

    let id = -1;
    let fn = '';
    let ln = '';

    if (results.length > 0) {
        id = results[0].UserId;
        fn = results[0].FirstName;
        ln = results[0].LastName;
    } else {
        error = 'Invalid username/password';
    }
    let ret = {
        id: id,
        firstName: fn,
        lastName: ln,
        error: error
    };
    res.status(200).json(ret);
});

app.post('/api/searchcards', async (req, res) => {
    let error = '';

    const { userId, search } = req.body;
    let _search = search.toLowerCase().trim();

    const db = client.db('COP4331Cards');
    const results = await db.collection('Cards').find({"Card":{$regex:_search+'.*', $options:'i'}}).toArray();

    let _ret = [];
    for (let i = 0; i < results.length; i++) {
        _ret.push(results[i].Card);
    }

    let ret = { results: _ret, error: error };
    res.status(200).json(ret);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});