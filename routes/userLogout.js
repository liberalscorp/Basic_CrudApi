const express = require("express");
const logout = require("../controllers/userLogout.js");
const router = express.Router();

router.get("/", logout.handleLogout);

module.exports = router;