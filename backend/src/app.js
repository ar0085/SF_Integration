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
const path = require("path");
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // or wherever frontend runs
    credentials: true, // allow sending cookies
  })
);

app.use(
  session({
    secret: "some_random_secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true, // 🔹 Set to `false` to allow HTTP frontend with HTTPS backend
      httpOnly: true, // 🔹 Prevent JavaScript from accessing session cookie
      sameSite: "None", // 🔥 Required for cross-origin cookies
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api", accountRoutes);

app.use((req, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

// FE related
// // 1. Serve static files from "public" directory
// app.use(express.static(path.join(__dirname, "..", "public")));

// // 2. (Optional) Fallback route for SPA
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "public", "index.html"));
// });

module.exports = app;
