const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // console.log(authHeader);
    if (authHeader) {
        console.log(authHeader);
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user.Username;
            next();
        });
    }else{
        res.status(401).send('Unauthorized');
    }

}

module.exports = verifyJWT;