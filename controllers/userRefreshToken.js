const userDB ={
    users : require('../modals/userAuth.json'),
    setUser : function (data) { this.users = data; }
}

const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.handleRefreshToken = (req, res) => {
    const cookies = req.cookies;

    if (!cookies ?.jwt ) {
        return res.status(401).json({ message: "No refresh token found in cookies" });
        
    }
    console.log(cookies.jwt);

    const refreshToken = cookies.jwt;
    console.log(refreshToken);
    const foundUser = userDB.users.find(userCred => userCred.refreshToken === refreshToken);
    if (!foundUser) {
        res.sendStatus(403);
       // console.log("here")
        return;
    }
    // verify refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => { 
        if (err || foundUser.Username !== user.username) {
            console.log(err , foundUser.Username , user.username)
            return res.status(401).send(err , foundUser.Username , user.username);
        }
        const accessToken = jwt.sign({username : user.Username},process.env.ACCESS_TOKEN_SECRET,{expiresIn : '60s'})
        res.json({accessToken});
    });
};