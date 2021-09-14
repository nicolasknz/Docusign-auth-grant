
exports.config = {
    dsClientId: process.env.DS_CLIENT_ID ||"1f7b1925-5652-4394-b6d6-784cda8273ad"
  , dsClientSecret: process.env.DS_CLIENT_SECRET || "43c9557f-8fd3-40c0-aba7-04f487f7e06e",
    dsAcountID : "a390f5d4-71f1-4da3-a55d-06939e4521d6"
  , appUrl: process.env.DS_APP_URL || 'http://localhost:3000' // The url of the application.
  , production: false
  , debug: true 
  , sessionSecret: process.env.SESSION_SECRET ||'12345' 
  , tokenSecret :  process.env.TOKEN_SECRET || 'LJHDJAS67567%7677SDKLKJSL'
  , allowSilentAuthentication: true // a user can be silently authenticated if they have an


  , targetAccountId: null // Set if you want a specific DocuSign AccountId, If null, the user's default account will be used.

}

exports.config.dsOauthServer = exports.config.production ?
    'https://account.docusign.com' : 'https://account-d.docusign.com';

exports.config.refreshTokenFile =  require('path').resolve(__dirname,'./refreshTokenFile');

