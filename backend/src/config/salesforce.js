require("dotenv").config();
const crypto = require("crypto");
const jsforce = require("jsforce");

const { SF_CONSUMER_KEY, SF_CONSUMER_SECRET, SF_CALLBACK_URL, SF_LOGIN_URL } =
  process.env;

// // Function to generate a secure PKCE code verifier
// const generateCodeVerifier = () => {
//   return crypto.randomBytes(64).toString("hex"); // Generates a 128-char string
// };

// Function to generate a secure PKCE code verifier
const generateCodeVerifier = () => {
  return crypto.randomBytes(64).toString("base64url"); // Generates a 128-char string
};

// Function to correctly Base64 URL encode (remove +, /, and = characters)
const base64urlEncode = (buffer) => {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, ""); // Remove padding
};

// Function to create a SHA256-based code challenge from code verifier
// const generateCodeChallenge = (codeVerifier) => {
//   return base64urlEncode(
//     crypto.createHash("sha256").update(codeVerifier).digest()
//   );
// };

// Function to create a SHA256-based code challenge from code verifier
const generateCodeChallenge = (codeVerifier) => {
  return crypto.createHash("sha256").update(codeVerifier).digest("base64url");
};

module.exports = {
  getOAuth2Instance: () => {
    return new jsforce.OAuth2({
      loginUrl: SF_LOGIN_URL || "https://login.salesforce.com",
      clientId: SF_CONSUMER_KEY,
      clientSecret: SF_CONSUMER_SECRET,
      redirectUri:
        "https://useful-osprey-hideously.ngrok-free.app/api/auth/salesforce/callback",
    });
  },
};
