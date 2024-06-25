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

const sendAccessToken = (req, res, accessToken) => {
    res.send({
        accessToken: accessToken,
        email: req.body.email,
    });
};

const sendRefreshToken = (res, refreshToken) => {
    //res.cookie('refreshToken', refreshToken, {
    //    httpOnly: true,
    //    path: '/refreshToken',
    //});
};

module.exports = {
    createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken
}