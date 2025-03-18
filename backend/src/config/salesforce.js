require("dotenv").config();
const jsforce = require("jsforce");

const { SF_CONSUMER_KEY, SF_CONSUMER_SECRET, SF_CALLBACK_URL, SF_LOGIN_URL } =
  process.env;

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
