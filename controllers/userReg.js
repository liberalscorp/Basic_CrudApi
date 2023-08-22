const userDB = {
    users : require('../modals/userAuth.json'),
    setUser : function (data) { this.users = data; }
}

const fsPromise = require('fs').promises;
const path = require('path');
const bcrpyt = require('bcrypt');

exports.handleNewUser = async (req, res) => {
    const { username , password } = req.body;

    if (!username || !password) {
        res.status(400).send('Username and password both required');
        return;
    } 
    // check if username already exists
    const dupUser = userDB.users.find(newUser => newUser.Username === username);
    if (dupUser) { 
        res.status(400).send('Username already exists');
        return;
    }
    try{
        // hash password
        const hashedPassword = await bcrpyt.hash(password, 10);
        // add new user to database
        const newUser = { "Username" : username , "Password" : hashedPassword };
        userDB.setUser([...userDB.users, newUser]);
        await fsPromise.writeFile(path.join(__dirname, '../modals/userAuth.json'), JSON.stringify(userDB.users, null, 2));

        console.log(`User [${username}] added to the database.`);
        res.status(201).send(`User [${username}] created successfully`);
    }catch(err){
        res.status(500).send(err.message);
    }
}
