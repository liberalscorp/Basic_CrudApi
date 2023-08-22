
const { v4: uuid } = require('uuid');
const path = require('path');
const fs = require('fs');


const userDataFilePath = path.join(__dirname, '../modals/userData.json');

const readDataFromFile = () => {
  try {
    const data = fs.readFileSync(userDataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeDataToFile = (data) => {
  fs.writeFileSync(userDataFilePath, JSON.stringify(data, null, 2));
};

let userData = readDataFromFile();


exports.getUsers = (req, res) => {
  console.log(`Users in the database: ${JSON.stringify(userData)}`);
  res.send(userData);
};

exports.createUser = async (req, res) => {
  const user = req.body;
  const newUser = { id: uuid() , ...user};
  userData.push(newUser);
  await writeDataToFile(userData);

  console.log(`User [${newUser.firstName} ${newUser.lastName}] added to the database.`);
  res.send(`User [${newUser.firstName} ${newUser.lastName}] added to the database.`);
};

exports.getUser = (req, res) => {
  const userId = req.params.id;
  const foundUser = userData.find((user) => user.id === userId);

  if (foundUser) {
    res.send(foundUser);
  } else {
    res.status(404).send(`User with the ID ${userId} not found.`);
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  const index = userData.findIndex((user) => user.id === userId);

  if (index !== -1) {
    userData.splice(index, 1);
    await writeDataToFile(userData);
    console.log(`User with the ID ${userId} deleted from the database.`);
    res.send(`User with the ID ${userId} deleted from the database.`);
  } else {
    console.log(`User with ID ${userId} not found`);
    res.status(404).send(`User with ID ${userId} not found`);
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const user = userData.find((user) => user.id === userId);

  if (!user) {
    console.log(`User with ID ${userId} not found`);
    return res.status(404).json({ message: 'User not found' });
  }

  user.age = req.body.age || user.age;
  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  await writeDataToFile(userData);

  console.log(`User with ID ${userId} has been updated: ${JSON.stringify(user)}`);
  res.status(200).json({ message: 'User updated successfully', user });
};

exports.getUserByQuery = (req, res) => {
  const { firstName } = req.query;

  if (!firstName) {
    return res.status(400).json({ message: 'Please provide a firstName query parameter.' });
  }

  const filteredUsers = userData.filter((user) => {
    // Check if firstName is defined and is a string before calling toLowerCase()
    if (typeof user.firstName === 'string') {
      return user.firstName.toLowerCase() === firstName.toLowerCase();
    }
    return false; // Exclude users without firstName or non-string values from the filtered list
  });

  if (filteredUsers.length === 0) {
    console.log(`No users found with firstName '${firstName}'`);
    return res.status(404).json({ message: `No users found with firstName '${firstName}'` });
  } else {
    console.log(`Users with firstName '${firstName}': ${JSON.stringify(filteredUsers)}`);
    res.send(filteredUsers);
  }
};
