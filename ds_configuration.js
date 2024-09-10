exports.config = {
  dsClientId: "4109451d-9c5a-41de-a712-e066afac9ba9",
  dsClientSecret: "a275097f-4613-4e1e-bea8-0d571165bbb6",
  dsAcountID: "146ce1e2-e653-4262-bfa1-f68eea719bed",
  appUrl: process.env.DS_APP_URL || "http://localhost:3000/", // The url of the application.
  production: false,
  debug: true,
  sessionSecret: process.env.SESSION_SECRET || "12345",
  tokenSecret: process.env.TOKEN_SECRET || "LJHDJAS67567%7677SDKLKJSL",
  allowSilentAuthentication: true, // a user can be silently authenticated if they have an

  targetAccountId: null, // Set if you want a specific DocuSign AccountId, If null, the user's default account will be used.
};

exports.config.dsOauthServer = "https://account-d.docusign.com";

exports.config.refreshTokenFile = require("path").resolve(
  __dirname,
  "./refreshTokenFile"
);
