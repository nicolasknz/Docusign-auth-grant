const docusign = require("docusign-esign");
const docusignAdmin = require('docusign-admin');
const fs = require("fs");
const { default: axios } = require("axios");

const createPermission = async(req,res) =>{
    try {
      var args = {
        accessToken: 'eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQsAAAABAAUABwAAXKGdYXHZSAgAAJzEq6Rx2UgCADDPogj6pptPmA0PrJ0H2Q4VAAEAAAAYAAEAAAAFAAAADQAkAAAANTgyODY1ZjMtMjFkOC00ZmVjLWFhZDAtMzZhODBhYTVhNmY5IgAkAAAANTgyODY1ZjMtMjFkOC00ZmVjLWFhZDAtMzZhODBhYTVhNmY5EgABAAAACwAAAGludGVyYWN0aXZlMAAAL3CcYXHZSDcAteWixfJc9k-du0PogldJZg.tvSZcNrScStwqg8e4kvr4BiCL8Xb0s2eAaRVzy71u_8UjJJdNiMTPqZ2hOJvYZ0Uq39MiiHlJkjj_7rZnbFZexcRwGiT3eDHQNkZGRncZnwlyjvcB5VRno4SA1QNwvsVSgXtW7aQxLrYD7cmAf1v0N7l6hmm-WgWC5bkUfAkJErcx7wwXNMvWKd3xB2j20uTQ0ri72RxJQbFVdYBQgvMoPhiCZg0PfCRRQUmIcOsSdVZrQSEG2S7GapdIS2w5Ke2tVUpBkgovktMgG23W6SudKLBc4oLbxxU6Hr3oD5msNLp9Pfg9meU3NAQdJBT7zgLwFEdM5qTuh2HMhYaYf1x8Q',
        basePath: 'https://demo.docusign.net/restapi',
        accountId: '56bd0a66-8a94-447e-a289-b517553420fa',
      };
      const apiClient = new docusign.ApiClient();
      apiClient.setBasePath(args.basePath);
      apiClient.addDefaultHeader("Authorization", "Bearer " + args.accessToken);
      let accountsApi = new docusign.AccountsApi(apiClient);
  
      const requestBody = {
        permissionProfile: {
          permissionProfileName: "Authors",
          settings: {
            useNewDocuSignExperienceInterface: 0,
            allowBulkSending: "true",
            allowEnvelopeSending: "true",
            allowSignerAttachments: "true",
            allowTaggingInSendAndCorrect: "true",
            allowWetSigningOverride: "true",
            allowedAddressBookAccess: "personalAndShared",
            allowedTemplateAccess: "share",
            enableRecipientViewingNotifications: "true",
            enableSequentialSigningInterface: "true",
            receiveCompletedSelfSignedDocumentsAsEmailLinks: "false",
            signingUiVersion: "v2",
            useNewSendingInterface: "true",
            allowApiAccess: "true",
            allowApiAccessToAccount: "true",
            allowApiSendingOnBehalfOfOthers: "true",
            allowApiSequentialSigning: "true",
            enableApiRequestLogging: "true",
            allowDocuSignDesktopClient: "false",
            allowSendersToSetRecipientEmailLanguage: "true",
            allowVaulting: "false",
            allowedToBeEnvelopeTransferRecipient: "true",
            enableTransactionPointIntegration: "false",
            powerFormRole: "admin",
            vaultingMode: "none"
            }
          }
      };
  
      results = await accountsApi.createPermissionProfile(args.accountId, requestBody)
      if(results){
        return res.status(200).json({
          permissionProfileId : results.permissionProfileId,
          permissionProfileName : results.permissionProfileName,
          data : results
        });
      }
      else{
        return res.status(500).send("There is error");
      }
    } catch (error) {
      console.log(error);
    }
}

module.exports = {createPermission};