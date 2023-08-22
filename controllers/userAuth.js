const userDB ={
    users : require('../modals/userAuth.json'),
    setUser : function (data) { this.users = data; }
}

const bcrpyt = require('bcrypt');
const path = require('path');
const fsPromise = require('fs').promises;
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.handleAuth = async (req, res) => {
    const { username , password } = req.body;

    if (!username || !password) {
        res.status(400).send('Username and password both required');
        return;
    }
    // check if username exists
    const foundUser = userDB.users.find(userCred => userCred.Username === username);
    if (!foundUser) {
        res.status(401).send('Username does not exist');
        return;
    }
    try{
        // check if password matches
        const matchPwd = await bcrpyt.compare(password, foundUser.Password);
        if (!matchPwd) {
            res.status(401).send('Incorrect password');
            return;
        }else{
            // generate token using jwt
            const accessToken = jwt.sign({username : foundUser.Username},process.env.ACCESS_TOKEN_SECRET,{expiresIn : '60s'})
            const refreshToken = jwt.sign({username : foundUser.Username},process.env.REFRESH_TOKEN_SECRET,{expiresIn : '1d'});
            // store refresh token in database
            const otherUsers = userDB.users.filter(user => user.Username !== foundUser.Username);
            const updatedUser = { ...foundUser, refreshToken };
            userDB.setUser([...otherUsers, updatedUser]);
            await fsPromise.writeFile(path.join(__dirname, '../modals/userAuth.json'), JSON.stringify(userDB.users, null, 2));
           
            // print success message
            console.log(`User [${username}] logged in successfully.`);
           
            // send access token and refresh token
            res.cookie('jwt', refreshToken, { httpOnly: true , maxAge : 24*60*60*1000});
            res.json({accessToken});
      
        }

    }catch(err){
        res.status(500).send(err.message);
    }

};