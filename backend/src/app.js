const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");

const app = express();

app.use(bodyParser.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:4002", // or wherever frontend runs
    credentials: true, // allow sending cookies
  })
);

app.use(
  session({
    secret: "some_random_secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // 🔹 Set to `false` to allow HTTP frontend with HTTPS backend
      httpOnly: true, // 🔹 Prevent JavaScript from accessing session cookie
      sameSite: "lax", // 🔹 Required for cross-origin session persistence
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api", accountRoutes);

app.use((req, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

module.exports = app;
