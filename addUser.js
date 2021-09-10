const docusign = require("docusign-esign");
const docusignAdmin = require('docusign-admin');
const fs = require("fs");
const axios= require("axios");

const createUser = async(req,res) =>{
  try {

    var args = {   
      basePath: "https://api-d.docusign.net/management",
      accessToken : req.cookies['access-token'],
      accountId : req.cookies['AccountID'],
     
    };
    const apiClient = new docusignAdmin.ApiClient();
    apiClient.setBasePath(args.basePath);
    apiClient.addDefaultHeader("Authorization", "Bearer " + args.accessToken);

    var request = {
        user_name : "Krutika123",
        first_name : "NewFirst",
        last_name : "Last",
        email :"krutikabhatt134@gmail.com",
        permission_profile_id :"11976349",
        group_id : "8505838",
        organizationId : "8c2235bc-8a2f-42e4-b4ac-587f4a8c05d8",
    };
    const userData = {
        user_name: request.user_name,
        first_name: request.first_name,
        last_name: request.last_name,
        email: request.email,
    };

    console.log(userData);
    const usersApi = new docusignAdmin.UsersApi(apiClient);
    console.log("The User API done");
    var createUser_Process = await usersApi.createUser(userData, request.organizationId);
    console.log("The Process :",createUser_Process);
    if(createUser_Process.status){
        res.status(200).json({
            message : "The User added succefully",
            data : createUser_Process
        })
    }
    else{
        console.log(createUser_Process);
        res.status(500).send("Eroor");
    }

  } catch (error) {
    console.log(error);
  }
    
}


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