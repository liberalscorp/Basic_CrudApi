const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const usersRoutes = require("./routes/userRoute.js");
const userAuth = require("./routes/registerUser.js");
const userLogin = require("./routes/authenticateUser.js");
const verifyJWT = require("./middleware/verifyJWT.js");
const cookieParser = require("cookie-parser");
const refreshToken = require("./routes/refreshToken.js");
const logout = require("./routes/userLogout.js");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.all("*", (req, res, next) => { console.log(`${req.method} ${req.path}`); next(); });

// routes for user authentication
app.use("/register", userAuth);
app.use("/auth", userLogin);
app.use("/refresh", refreshToken);
app.use("/logout", logout)

// random route
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "views", "index.html")));

// routes for people
app.use(verifyJWT);

app.use("/people", usersRoutes);
app.all("*", (req, res) => res.sendFile(path.join(__dirname, "views", "404.html")));

app.listen(PORT, () =>console.log(`Server running on port: http://localhost:${PORT}`));


