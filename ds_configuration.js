
exports.config = {
    dsClientId: process.env.DS_CLIENT_ID ||"8baa1a29-df63-42c8-a2c3-48221dfd0bf3"
  , dsClientSecret: process.env.DS_CLIENT_SECRET || "bd7c0009-f648-4adc-ad7f-174c628400a7",
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

