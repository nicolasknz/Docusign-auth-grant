const docusign = require("docusign-esign");
const fs = require("fs");


const sendEnvelopeUsingEmbeddedSending = async (req,res) => {
    
    var args={
      document_title :'This is demonstration PDF',
      document_description:'The description always helps people to understand the content of this documents',
        startingView: 'tagging',
        envelopeArgs: {
            signerEmail: ['krutika.bhatt@somaiya.edu','krutikabhatt222@gmail.com'],
            signerName: ['Krutika Bhatt','Diamonds Shine'],
            dsReturnUrl: 'http://localhost:3000/ds-return',
            doc2File: './sample-pdf.pdf'
        }
    }
    
    console.log(args);
    args.accessToken = req.cookies['access-token'];
    args.accountId = req.cookies['AccountID'];
    args.basePath= 'https://demo.docusign.net/restapi';
    // args.accessToken= 'eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQsAAAABAAUABwCA0zE1HHTZSAgAgBNVQ1902UgCAH63q3XiXLBCkDudGRrLOQMVAAEAAAAYAAEAAAAFAAAADQAkAAAAMDgwOWU3MDQtMzFkZC00OWY0LWJjMDEtZjMzYTAzZTYzYmIzIgAkAAAAMDgwOWU3MDQtMzFkZC00OWY0LWJjMDEtZjMzYTAzZTYzYmIzEgABAAAACwAAAGludGVyYWN0aXZlMACApgA0HHTZSDcAL-oDT4F9REmJq5V0D6oPZQ.WZDUaeo_FSVN7aiTzfQwFrj1m6lvPV9G2Nuyj8JBlApi33ojh6Ir7InSkSTM8u_0LwaabnXp8He-4-QdrC3YG1bUnlfaNqOefNDAblZgA2ycrYXMBiZYm_7cB1WMHLX1623nnj33Hb3uU4UAZgHdyr3QW2R_HWRn-523U9vriaVuxoFBrQnkieq2U7UKOjGNaYOHgmswH8gNsC7XJUA9I4GrFAUwR1zQeLIZfn25fPGG1vvgVbEDjS9x-ZDCr11HEHFhPjDEivVvfzrW4PqV6lkXv_tt2UcqHJ2UwftOtW_WHrRDZCdX9tnTGXtqxjMKb1E5ameNcPpIfK1-L14fdA',
    // args.basePath= 'https://demo.docusign.net/restapi',
    // args.accountId= 'a390f5d4-71f1-4da3-a55d-06939e4521d6',
    console.log("Args :",args);
    console.log("Hello I m in send Envelope",args);
  
    let dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(args.basePath);
    dsApiClient.addDefaultHeader("Authorization", "Bearer " + args.accessToken);
    let envelopesApi = new docusign.EnvelopesApi(dsApiClient);
  
    // Step 1. Make the envelope with "created" (draft) status
    args.envelopeArgs.status = "created"; // We want a draft envelope
  
    let envelope = makeEnvelope(args.envelopeArgs);
  
    let results = await envelopesApi.createEnvelope(args.accountId, {
      envelopeDefinition: envelope,
    })
    .catch(err =>{
      console.log(err);
      return res.status(400).send(err);
    })
    let envelopeId = results.envelopeId;

    console.log(envelopeId);
    // Step 2. create the sender view
    let viewRequest = makeSenderViewRequest(args.envelopeArgs);
    // Call the CreateSenderView API
    // Exceptions will be caught by the calling function
    console.log("This make Sender Request is done");
    results = await envelopesApi.createSenderView(args.accountId, envelopeId, {
      returnUrlRequest: viewRequest,
    });

    console.log("In results log");
    
    let url = results.url;
    console.log(`startingView: ${args.startingView}`);
    if (args.startingView === "recipient") {
      url = url.replace("send=1", "send=0");
    }
  
    return res.status(200).json({ envelopeId: envelopeId, redirectUrl: url });
  };

  function makeSenderViewRequest(args) {
    let viewRequest = new docusign.ReturnUrlRequest();
  
    viewRequest.returnUrl = args.dsReturnUrl;
    return viewRequest;
  }
  
  function makeEnvelope(args) {
  
    let doc2DocxBytes, doc3PdfBytes;
  
    doc2DocxBytes = fs.readFileSync(args.doc2File);
 
    let env = new docusign.EnvelopeDefinition();
    env.emailSubject = "Please sign this document set";
  
    // add the documents
    // let doc1 = new docusign.Document(),
    //   doc1b64 = Buffer.from(document1(args)).toString("base64"),
    //   doc2b64 = Buffer.from(doc2DocxBytes).toString("base64");
    //  doc1.documentBase64 = doc1b64;
    // doc1.name = "Order acknowledgement";
    // doc1.fileExtension = "html"; 
    // doc1.documentId = "1"; 
    var doc2b64 = Buffer.from(doc2DocxBytes).toString("base64");
    let doc2 = new docusign.Document.constructFromObject({
      documentBase64: doc2b64,
      name: args.document_title, 
      fileExtension: "pdf",
      documentId: "1",
    });
  
    env.documents = [doc2];
 
    var Allsigners =[];
    var signerEmail_list = args.signerEmail;
    var signerName_list = args.signerName;
    var recIDs = 1;
    for(var i=0;i<signerEmail_list.length;i++){
        var signer1 = docusign.Signer.constructFromObject({
            email: signerEmail_list[i],
            name: signerName_list[i],
            recipientId: recIDs.toString(),
            routingOrder: recIDs.toString(),
        });
        Allsigners.push(signer1);
        recIDs = parseInt(recIDs) + 1;
    }
   
    console.log("All signers :",Allsigners);
    let recipients = docusign.Recipients.constructFromObject({
      signers: Allsigners
    });
    env.recipients = recipients;
  
    env.status = args.status;
  
    return env;
  }
  
  
  function document1(args) {
 
  
    return `
      <!DOCTYPE html>
      <html>
          <head>
            <meta charset="UTF-8">
          </head>
          <body style="font-family:sans-serif;margin-left:2em;">
          <h1 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
              color: darkblue;margin-bottom: 0;"></h1>
          <h2 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
            margin-top: 0px;margin-bottom: 3.5em;font-size: 1em;
            color: darkblue;">${args.document_title}</h2>
         
          <h4>Ordered by ${args.signerName[0]}</h4>
          <p style="margin-top:0em; margin-bottom:0em;">Email: ${args.signerEmail[0]}</p>
          <p style="margin-top:3em;">
          ${args.document_description};
          </p>
          </body>
      </html>
    `;
  }  



module.exports = { sendEnvelopeUsingEmbeddedSending };