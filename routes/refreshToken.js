const express = require("express");
const refreshToken = require("../controllers/userRefreshToken.js");
const router = express.Router();

router.get("/", refreshToken.handleRefreshToken);

module.exports = router;