const express = require("express");
const userFunctions = require("../controllers/usersfunc.js");


const router = express.Router();

// no parameters
router.route("/")
    .get(userFunctions.getUsers)
    .post(userFunctions.createUser)

// for query parameters
router.route("/search")    
    .get(userFunctions.getUserByQuery)
    
// with parameters
router.route("/:id")
    .get(userFunctions.getUser)
    .delete(userFunctions.deleteUser)
    .patch(userFunctions.updateUser);
    

module.exports = router;