const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const jsforce = require("jsforce");

const tokenStore = require("../../tokenstore");

const {
  getOAuth2Instance,
  generateCodeVerifier,
  generateCodeChallenge,
} = require("../config/salesforce");

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

// exports.salesforceLogin = (req, res) => {
//   const oauth2 = getOAuth2Instance();
//   const authUrl = oauth2.getAuthorizationUrl({ scope: "api" });
//   return res.redirect(authUrl);
// };

// exports.salesforceLogin = (req, res) => {
//   const oauth2 = getOAuth2Instance();

//   // Redirect to Salesforce login with PKCE
//   const authUrl = oauth2.getAuthorizationUrl({
//     scope: "full refresh_token offline_access api",
//   });

//   return res.redirect(authUrl);
// };

// exports.salesforceLogin = (req, res) => {
//   const oauth2 = getOAuth2Instance();

//   // Generate a new PKCE code verifier
//   const codeVerifier = generateCodeVerifier();
//   req.session.codeVerifier = codeVerifier; // Store it for later verification

//   // Create a code challenge from the code verifier
//   const codeChallenge = generateCodeChallenge(codeVerifier);

//   console.log("🔹 Generated Code Verifier:", codeVerifier);
//   console.log("🔹 Generated Code Challenge:", codeChallenge);

//   // Redirect to Salesforce login with PKCE
//   const authUrl = oauth2.getAuthorizationUrl({
//     response_type: "code",
//     client_id: process.env.SF_CONSUMER_KEY,
//     redirect_uri: process.env.SF_CALLBACK_URL,
//     scope: "full refresh_token offline_access api",
//     code_challenge: codeChallenge,
//     code_challenge_method: "S256", // Mandatory for PKCE
//   });

//   return res.redirect(authUrl);
// };

exports.salesforceLogin = (req, res) => {
  const oauth2 = getOAuth2Instance();

  // Build Salesforce auth URL (no PKCE needed)
  const authUrl = oauth2.getAuthorizationUrl({
    // response_type: "code",
    // client_id: process.env.SF_CONSUMER_KEY,
    // redirect_uri: process.env.SF_CALLBACK_URL,
    scope: "full refresh_token offline_access api",
  });

  return res.redirect(authUrl);
};

// exports.salesforceCallback = async (req, res) => {
//   const oauth2 = getOAuth2Instance();
//   const { code } = req.query;

//   try {
//     const conn = new jsforce.Connection({ oauth2 });
//     await conn.authorize(code);

//     // Demo approach: store tokens in session
//     req.session.sfAccessToken = conn.accessToken;
//     req.session.sfInstanceUrl = conn.instanceUrl;

//     // Redirect to the frontend's dashboard on port 4002
//     // (You can adjust if you serve the frontend differently)
//     return res.redirect("http://localhost:4002/dashboard");
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Salesforce OAuth Error");
//   }
// };

// exports.salesforceCallback = async (req, res) => {
//   const oauth2 = getOAuth2Instance();
//   const { code } = req.query;

//   if (!code) {
//     return res.status(400).send("Error: Missing authorization code.");
//   }

//   try {
//     const conn = new jsforce.Connection({ oauth2 });

//     // Exchange authorization code for an access token
//     await conn.authorize(code);

//     // Store the tokens in the session
//     req.session.sfAccessToken = conn.accessToken;
//     req.session.sfInstanceUrl = conn.instanceUrl;

//     console.log("🔹 Salesforce Access Token:", conn.accessToken);

//     return res.redirect("http://localhost:4002/dashboard"); // Redirect user to frontend
//   } catch (error) {
//     console.error("❌ Salesforce OAuth Error:", error);
//     return res.status(500).send("Failed to authenticate with Salesforce.");
//   }
// };

// exports.salesforceCallback = async (req, res) => {
//   const oauth2 = getOAuth2Instance();
//   const { code } = req.query;

//   if (!code) {
//     return res.status(400).send("Error: Missing authorization code.");
//   }

//   try {
//     // Retrieve stored code verifier
//     const codeVerifier = req.session.codeVerifier;
//     console.log("🔹 Retrieved Code Verifier:", codeVerifier);

//     if (!codeVerifier) {
//       return res.status(400).send("Error: PKCE code_verifier missing.");
//     }

//     // Exchange authorization code for an access token using PKCE verifier
//     const conn = new jsforce.Connection({ oauth2 });

//     await conn.authorize(code, {
//       codeVerifier: codeVerifier,
//     });

//     // Store tokens in session
//     req.session.sfAccessToken = conn.accessToken;
//     req.session.sfInstanceUrl = conn.instanceUrl;

//     console.log("✅ Successfully authenticated with Salesforce.");
//     console.log("🔹 Access Token:", conn.accessToken);

//     return res.redirect("http://localhost:4002/dashboard");
//   } catch (error) {
//     console.error("❌ Salesforce OAuth Error:", error);
//     return res.status(500).send("Failed to authenticate with Salesforce.");
//   }
// };

// exports.salesforceCallback = async (req, res) => {
//   const oauth2 = getOAuth2Instance();
//   const { code } = req.query;

//   if (!code) {
//     return res.status(400).send("Error: Missing authorization code.");
//   }

//   try {
//     // Retrieve stored code verifier
//     const codeVerifier = req.session.codeVerifier;
//     console.log("🔹 Retrieved Code Verifier:", codeVerifier);

//     if (!codeVerifier) {
//       return res.status(400).send("Error: PKCE code_verifier missing.");
//     }

//     // Exchange authorization code for an access token using PKCE verifier
//     const conn = new jsforce.Connection({ oauth2 });

//     const tokenResponse = await conn.oauth2.requestToken({
//       grant_type: "authorization_code",
//       client_id: process.env.SF_CONSUMER_KEY,
//       redirect_uri: process.env.SF_CALLBACK_URL,
//       code: code,
//       code_verifier: codeVerifier,
//     });

//     conn.accessToken = tokenResponse.access_token;
//     conn.refreshToken = tokenResponse.refresh_token;
//     conn.instanceUrl = tokenResponse.instance_url;

//     // Store tokens in session
//     req.session.sfAccessToken = conn.accessToken;
//     req.session.sfInstanceUrl = conn.instanceUrl;

//     console.log("✅ Successfully authenticated with Salesforce.");
//     console.log("🔹 Access Token:", conn.accessToken);

//     return res.redirect("http://localhost:4002/dashboard");
//   } catch (error) {
//     console.error("❌ Salesforce OAuth Error:", error);
//     return res.status(500).send("Failed to authenticate with Salesforce.");
//   }
// };

// exports.salesforceCallback = async (req, res) => {
//   const oauth2 = getOAuth2Instance();
//   const { code } = req.query;

//   if (!code) {
//     return res.status(400).send("Error: Missing authorization code.");
//   }

//   try {
//     // Ensure the code is only used once
//     if (req.session.usedAuthCode && req.session.usedAuthCode === code) {
//       return res
//         .status(400)
//         .send("Error: Authorization code has already been used.");
//     }
//     req.session.usedAuthCode = code; // Mark this code as used

//     // Retrieve stored code verifier
//     const codeVerifier = req.session.codeVerifier;
//     console.log("🔹 Retrieved Code Verifier:", codeVerifier);

//     if (!codeVerifier) {
//       return res.status(400).send("Error: PKCE code_verifier missing.");
//     }

//     // Exchange authorization code for an access token using PKCE verifier
//     const conn = new jsforce.Connection({ oauth2 });

//     const tokenResponse = await conn.oauth2.requestToken({
//       grant_type: "authorization_code",
//       client_id: process.env.SF_CONSUMER_KEY,
//       redirect_uri: process.env.SF_CALLBACK_URL,
//       code: code,
//       code_verifier: codeVerifier,
//     });

//     conn.accessToken = tokenResponse.access_token;
//     conn.refreshToken = tokenResponse.refresh_token;
//     conn.instanceUrl = tokenResponse.instance_url;

//     // Store tokens in session
//     req.session.sfAccessToken = conn.accessToken;
//     req.session.sfInstanceUrl = conn.instanceUrl;

//     console.log("✅ Successfully authenticated with Salesforce.");
//     console.log("🔹 Access Token:", conn.accessToken);

//     return res.redirect("http://localhost:4002/dashboard");
//   } catch (error) {
//     console.error("❌ Salesforce OAuth Error:", error);
//     return res.status(500).send("Failed to authenticate with Salesforce.");
//   }
// };

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
    tokenStore.sfAccessToken = conn.accessToken;
    tokenStore.sfInstanceUrl = conn.instanceUrl;

    console.log("✅ Successfully authenticated with Salesforce!");
    console.log("🔹 Access Token:", conn.accessToken);
    console.log("🔹 Instance URL:", conn.instanceUrl);
    console.log("✅ Salesforce Access Token Stored in Cookie");

    // Redirect to your frontend's dashboard
    return res.redirect(
      `http://localhost:4002/dashboard?accessToken=${conn.accessToken}&instanceUrl=${conn.instanceUrl}`
    );
  } catch (error) {
    console.error("❌ Salesforce OAuth Error:", error);
    return res.status(500).send("Salesforce OAuth token exchange failed.");
  }
};
