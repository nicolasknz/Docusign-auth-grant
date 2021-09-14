#!/usr/bin/env node

const express = require('express')
    , session = require('express-session')  
    , bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , MemoryStore = require('memorystore')(session) 
    , path = require('path')
    , passport = require('passport')
    , DocusignStrategy = require('passport-docusign')
    , dsConfig = require('./ds_configuration.js').config
    , moment = require('moment')
    , tokenReplaceMinGet = 60; 

const superagent = require('superagent'),    
    Encrypt = require('./Encrypt').Encrypt, 
    docusign = require('docusign-esign'),
    fs = require('fs');

const {AddUser} = require('./addUser');
const {createPermission} = require('./addPermission');
const {sendEnvelopeUsingEmbeddedSending} = require('./embedded_signing');

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
    
const PORT = process.env.PORT || 3000
    , HOST = process.env.HOST || 'localhost'
    , max_session_min = 180 ;

let hostUrl = 'http://' + HOST + ':' + PORT
if (dsConfig.appUrl != '' && dsConfig.appUrl != '{APP_URL}') {hostUrl = dsConfig.appUrl}


let app = express()
    .use(cookieParser())
    .use(session({
    secret: dsConfig.sessionSecret,
    name: 'ds-authexample-session',
    cookie: {maxAge: max_session_min * 60000},
    saveUninitialized: true,
    resave: true,
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
  })}))
  .use(passport.initialize())
  .use(passport.session())
  .use(bodyParser.urlencoded({ extended: true }))
  .get('/ds/login', (req, res, next) => {    
    // res.cookie("AccountID", dsConfig.dsAcountID, {
    //   httpOnly: false,
    // });
    passport.authenticate('docusign')(req, res, next);
    })
  .get('/ds/callback', [dsLoginCB1, dsLoginCB2]); // OAuth callbacks. See below
  
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: "Docu Sign Backend Integration",
        description: "Docu Sign Backend Integration",
        contact: {
          name: "Vedant Khandokar",
        },
        servers: [`http://${HOST}:${PORT}`],
      },
    },
    apis: ["index.js"],
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
function dsLoginCB1 (req, res, next) {

    passport.authenticate('docusign', { failureRedirect: '/ds/login' })(req, res, next);
}
function dsLoginCB2 (req, res, next) {

    console.log(`Received access_token: |${req.user.accessToken}|`);
    console.log(`Expires at ${req.user.tokenExpirationTimestamp.format("dddd, MMMM Do YYYY, h:mm:ss a")}`);
    console.log('Auth Successful');
    console.log(`Received access_token: |${req.user.accessToken}|`);
    console.log(`Expires at ${req.user.tokenExpirationTimestamp.format("dddd, MMMM Do YYYY, h:mm:ss a")}`);

    res.cookie("access-token", req.user.accessToken, {
      httpOnly: false,
    });
    // res.cookie("AccountID", dsConfig.dsAcountID, {
    //   httpOnly: false,
    // });
    // Most Docusign api calls require an account id. This is where you can fetch the default account id for the user 
    // and store in the session.

    res.redirect('/');
}

/* Start the web server */
if (dsConfig.dsClientId && dsConfig.dsClientId !== '{CLIENT_ID}' &&
    dsConfig.dsClientSecret && dsConfig.dsClientSecret !== '{CLIENT_SECRET}') {
    app.listen(PORT)
    console.log(`Listening on ${PORT}`);
    console.log(`Ready! Open ${hostUrl}`);
} else {
  console.log(`PROBLEM: You need to set the clientId (Integrator Key), and perhaps other settings as well. 
You can set them in the source file ds_configuration.js or set environment variables.\n`);
  process.exit(); // We're not using exit code of 1 to avoid extraneous npm messages.
}

passport.serializeUser  (function(user, done) {

    console.log("In serialize user");
    done(null, user)
});
passport.deserializeUser(function(obj,  done) {
    console.log("In de-serialize user");
    done(null, obj);
   
});

// Configure passport for DocusignStrategy
let docusignStrategy = new DocusignStrategy({
    production: dsConfig.production,
    clientID: dsConfig.dsClientId,
    clientSecret: dsConfig.dsClientSecret,
    callbackURL: 'http://localhost:3000/ds/callback/',
    scope : 'signature',
    state: true 
  },
  function _processDsResult(accessToken, refreshToken, params, profile, done) {
    let user = profile;
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    user.expiresIn = params.expires_in;
    user.tokenExpirationTimestamp = moment().add(user.expiresIn, 's'); // The dateTime when the access token will expire
    
    new Encrypt(dsConfig.refreshTokenFile).encrypt(refreshToken);
    return done(null, user);
  }
);

if (!dsConfig.allowSilentAuthentication) {
  // See https://stackoverflow.com/a/32877712/64904 
  console.log("Silent Auth")
  docusignStrategy.authorizationParams = function(options) {
    return {prompt: 'login'};
  }
}
passport.use(docusignStrategy);

function hasToken(req,bufferMin = tokenReplaceMinGet)
{
    let noToken = !req.user || !req.user.accessToken || !req.user.tokenExpirationTimestamp
    , now = moment()
    , needToken = noToken || moment(req.user.tokenExpirationTimestamp).subtract(
        bufferMin, 'm').isBefore(now);
 
    if (noToken) {console.log('hasToken: Starting up--need a token')}
    if (needToken && !noToken) {console.log('checkToken: Replacing old token')}
    if (!needToken) {console.log('checkToken: Using current token')}
  
    return (!needToken)
}

function internalLogout (req, res,next) {
    req.user = null;
  }

function getAccessTokenUsingRefreshToken(req, res,callback) {  
  const clientId = dsConfig.dsClientId;
  const clientSecret = dsConfig.dsClientSecret;

  //read and decrypt the refresh token 
  const refreshToken = new Encrypt(dsConfig.refreshTokenFile).decrypt();
  
  const clientString = clientId + ":" + clientSecret,
  postData = {
      "grant_type": "refresh_token",
      "refresh_token": refreshToken,
    },
  headers = {
      "Authorization": "Basic " + (new Buffer(clientString).toString('base64')),
    },
  authReq = superagent.post( dsConfig.dsOauthServer + "/oauth/token")
      .send(postData)
      .set(headers)
      .type("application/x-www-form-urlencoded");

  const _this = this;      

  authReq.end(function (err, authRes) {
      
      if (err) {
          console.log("ERROR getting access token using refresh token:");
          console.log(err);
        return callback(err, authRes);
      } else {
          console.log("Received access token after refresh");
          console.log(authRes.body.access_token);
          res.cookie("access-token", authRes.body.access_token, {
            httpOnly: false,
          });
          // res.cookie("AccountID", dsConfig.dsAcountID, {
          //   httpOnly: false,
          // });
          const accessToken = authRes.body.access_token;
          const refreshToken = authRes.body.refresh_token;
          const expiresIn = authRes.body.expires_in;

          //Obtain the user profile
          docusignStrategy.userProfile(accessToken, function(err,profile)
          {
              if (err) {
                  console.log("ERROR getting user profile:");
                  console.log(err);
                  return callback(err, authRes);
              }else{
                  let user = profile;
                  user.accessToken = accessToken;
                  user.refreshToken = refreshToken;
                  user.expiresIn = expiresIn;
                  user.tokenExpirationTimestamp = moment().add(user.expiresIn, 's'); // The dateTime when the access token will expire
                  req.login(user,(err)=>{
                          callback();
                      }
              
                  )}
          })
    
      }
    });
  
};


app.get("/",function(req, res, next){
    
    if(hasToken(req))
    {
        let msg = "<h1>Have a valid access token.</h1>";
        if (req.query.msg)
        {
            msg += "<br/>"
            msg += req.query.msg;
        }
        res.send(msg);    
    }
    else if(fs.existsSync(dsConfig.refreshTokenFile))
    { 
        console.log("New Refresh Token File Found, getting access token from refresh token");
        getAccessTokenUsingRefreshToken(req, res,(err)=>{
            if(err)
            {
                console.log("Error getting access token from refresh token");
                console.log("Delete the Refresh token file");

                // res.redirect(mustAuthenticate);
            }else
            {
                console.log("After getting access token from refresh token");
                res.redirect("/?msg=Obtained Access Token From Refresh Token");
            }
            
        });
    }else
    {
        console.log("No valid access token found. Saved refresh token not available either ");
        res.send("<h1>You are not authenticated with Docusign.</h1>Click <a href='/ds/login'>here</a> to autheticate");
    }
    
});


app.get("/ds/logout",function(req, res, next)
    {
        internalLogout(req, res, next);
        res.redirect("/");
    }
);


// The functions 
app.post("/sendEnvelope",sendEnvelopeUsingEmbeddedSending);
app.post("/addUser",AddUser);
app.post("/createPermission",createPermission);


/**
 * @swagger
 * /sendEnvelope:
 *  post:
 *    tags:
 *      - Routes
 *    summary: Sending Documents for signing 
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Envelope data
 *        required: true
 *        example: {"document_title":"This is demonstration PDF","document_description":"The description always helps people to understand the content of this documents","startingView": "tagging","envelopeArgs":{"signerEmail": ['krutika.bhatt@somaiya.edu','krutikabhatt222@gmail.com'],"signerName": ['Krutika Bhatt','Diamonds Shine'],"dsReturnUrl": 'http://localhost:3000/ds/callback',"doc2File": './sample-pdf.pdf'}}
 *    responses:
 *      '200':
 *        description: The field has been added successfully 
 *      '404':
 *        description: Not all required fields are provided
 *      '500':
 *        description: Some Internal Error
 */
