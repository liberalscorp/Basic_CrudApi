const express = require("express");
const userAuth = require("../controllers/userReg.js");
const router = express.Router();

router.post("/", userAuth.handleNewUser);

module.exports = router;
