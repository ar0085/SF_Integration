const express = require("express");
const router = express.Router();
const { getAccounts } = require("../controllers/dashboardController");
const auth = require("../middleware/authMiddleware");

router.get("/accounts", getAccounts);

module.exports = router;
