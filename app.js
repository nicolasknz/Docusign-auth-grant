const axios = require('axios');
var postData = {
 
  "user_name": "test",
  "first_name": "test",
  "last_name": "test",
  "email": "vedant192000@gmail.com",
  "permission_profile": {
    "id": "11972828",
    "name": "DS Sender"
  }
};

let axiosConfig = {
  
  "apiName": "Admin API",
  "basePath": "https://api-d.docusign.net/management",
  "endpoint": "/Management/v2/organizations/d7ec7672-6f8e-4d5a-97ec-b016a829eb5c/accounts/a390f5d4-71f1-4da3-a55d-06939e4521d6/users",
  "headers": {
    "accept": "application/json",
    "Authorization": "Bearer " + "eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAUABwAAo22zDHXZSAgAAOOQwU912UgCAH63q3XiXLBCkDudGRrLOQMVAAEAAAAYAAEAAAAFAAAADQAkAAAAOGJhYTFhMjktZGY2My00MmM4LWEyYzMtNDgyMjFkZmQwYmYzIgAkAAAAOGJhYTFhMjktZGY2My00MmM4LWEyYzMtNDgyMjFkZmQwYmYzMACA-r0tG3TZSDcAL-oDT4F9REmJq5V0D6oPZQ.rfj-FQbkkd3n-KgcQr_nRHMI9nS83DO9fG-WPlmJ3Wgw340Z9wsXYvo49kaRpbLm9MvXOLavozwWR0IYUBf3zsVuNoCy0zXAa6K53SgcwDuz57jfOJHrygKdZFc9dFr47YzGmiLOwWutlskqCcJznd7FOGtJXahWUczoWrdzNWDr5G9Y03IzdWDPSPCyQz9hby1QVEf-EoJurOWjvqieZZGgGQBbzu89FSdqOqih6S75uGP8nddsb3mtqcPZ8lVl104P7JfzkkQwD93OKUWkSpShQnCYadGkPH1JGqzD4_YguiUVqUOoSOuXDWCPZTZwKbHxTN2AQwpRV722zj4G_Q"

  },
  "pathParameters": {
    "accountId": ""
  },
  "queryParameters": {},
  "bodyParameters": {},
  "bodyParametersStringified": "{}",
  "response": {},
  "apiExplorerUrl": "https://developers.docusign.com/docs/admin-api/reference/usermanagement/esignusermanagement/addusers/?explorer=true"

};

axios.post('https://api-d.docusign.net/management/Management/v2/organizations/d7ec7672-6f8e-4d5a-97ec-b016a829eb5c/accounts/a390f5d4-71f1-4da3-a55d-06939e4521d6/users', postData, axiosConfig)
.then((res) => {
  console.log("RESPONSE RECEIVED: ", res.data);
})
.catch((err) => {
  console.log("AXIOS ERROR: ", err);})