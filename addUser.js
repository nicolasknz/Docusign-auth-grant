const docusign = require("docusign-esign");
const docusignAdmin = require('docusign-admin');
const fs = require("fs");
const axios= require("axios");

const AddUser =async(req,res)=>{
    var organizationId = "d7ec7672-6f8e-4d5a-97ec-b016a829eb5c";
    var accountID = "a390f5d4-71f1-4da3-a55d-06939e4521d6";
  
    var body =
      {
        "user_name": "Krutika#123",
        "email": "diamondsshine532@gmail.com",
        "first_name": "Krutika",
        "last_name": "Bhatt",
      }
      
      var post_uri = `https://api-d.docusign.net/management/Management/v2/organizations/${organizationId}/accounts/${accountID}/users`
  
      axios
        .post(post_uri,{
          bodyParameters:{
            NewAccountUserRequest: {
            "user_name": "K12313DE",
            "first_name": "Krutika",
            "email": "krutikabhatt222@gmail.com",
            "last_name": "Bhatt"
          }
        }
      })
        .then(res => console.log(res))
        .catch(err => console.log(err));
  
      res.send("Done");
  }
  
module.exports = {AddUser};