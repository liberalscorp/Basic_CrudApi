const userDB ={
    users : require('../modals/userAuth.json'),
    setUser : function (data) { this.users = data; }
}
const fsPromise = require('fs').promises;
const path = require('path');


exports.handleLogout = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt ) {
        console.log("here 1")
        return res.status(204).send("first");
    }
    console.log(cookies.jwt);
    // Check if refresh token exists in database
    const refreshToken = cookies.jwt;
    const foundUser = userDB.users.find(userCred => userCred.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt' , { httpOnly: true , maxAge : 24*60*60*1000});
        res.status(204).send("second");
        console.log("here 2")
        return;
    }
    // remove refresh token from database
    const otherUsers = userDB.users.filter(user => user.Username !== foundUser.Username);
    const updatedUser = { ...foundUser, refreshToken : '' };
    userDB.setUser([...otherUsers, updatedUser]);
    await fsPromise.writeFile(path.join(__dirname, '../modals/userAuth.json'), JSON.stringify(userDB.users, null, 2));

    console.log(`User [${foundUser.Username}] logged out successfully.`);
    res.clearCookie('jwt' , { httpOnly: true , maxAge : 24*60*60*1000});
    console.log("here 3")
    res.status(200).send("third");
};