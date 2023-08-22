const express = require("express");
const userAuth = require("../controllers/userAuth.js");
const router = express.Router();

router.post("/", userAuth.handleAuth);

module.exports = router;