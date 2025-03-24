const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  salesforceLogin,
  salesforceCallback,
  getCurrentUser,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);

// Initiate and complete Salesforce OAuth
router.get("/salesforce", salesforceLogin);
router.get("/salesforce/callback", salesforceCallback);

router.get("/me", getCurrentUser);

module.exports = router;
