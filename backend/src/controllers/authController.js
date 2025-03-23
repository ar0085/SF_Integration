const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const jsforce = require("jsforce");

const tokenStore = require("../../tokenstore");

const { getOAuth2Instance } = require("../config/salesforce");

exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
      email,
      hashedPassword,
    ]);

    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userResult = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.salesforceLogin = (req, res) => {
  const oauth2 = getOAuth2Instance();

  // Build Salesforce auth URL (no PKCE needed)
  const authUrl = oauth2.getAuthorizationUrl({
    scope: "full refresh_token offline_access api",
  });

  return res.redirect(authUrl);
};

exports.salesforceCallback = async (req, res) => {
  const oauth2 = getOAuth2Instance();
  const { code } = req.query;

  if (!code) {
    return res
      .status(400)
      .send("Error: Missing authorization code from Salesforce.");
  }

  try {
    // Use jsforce's built-in authorize method (standard web server flow)
    const conn = new jsforce.Connection({ oauth2 });
    await conn.authorize(code);

    // Save tokens in session for demonstration
    // tokenStore.sfAccessToken = conn.accessToken;
    // tokenStore.sfInstanceUrl = conn.instanceUrl;

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    };

    res.cookie("sfAccessToken", conn.accessToken, cookieOptions);
    res.cookie("sfInstanceUrl", conn.instanceUrl, cookieOptions);

    console.log("✅ Successfully authenticated with Salesforce!");
    console.log("🔹 Access Token:", conn.accessToken);
    console.log("🔹 Instance URL:", conn.instanceUrl);
    console.log("✅ Salesforce Access Token Stored in Cookie");

    // Redirect to your frontend's dashboard
    // return res.redirect(
    //   `${process.env.FRONTEND_URL}/dashboard?accessToken=${conn.accessToken}&instanceUrl=${conn.instanceUrl}`
    // );

    return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error("❌ Salesforce OAuth Error:", error);
    return res.status(500).send("Salesforce OAuth token exchange failed.");
  }
};
