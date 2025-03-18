const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  salesforceLogin,
  salesforceCallback,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);

// Initiate and complete Salesforce OAuth
router.get("/salesforce", salesforceLogin);
router.get("/salesforce/callback", salesforceCallback);

module.exports = router;
