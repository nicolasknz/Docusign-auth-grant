const docusign = require("docusign-esign");
const fs = require("fs");

const sendEnvelopeUsingEmbeddedSending = async (req, res) => {
  var args = {
    document_title: "This is demonstration PDF",
    document_description:
      "The description always helps people to understand the content of this documents",
    startingView: "tagging",
    envelopeArgs: {
      signerEmail: ["krutika.bhatt@somaiya.edu", "krutikabhatt222@gmail.com"],
      signerName: ["Krutika Bhatt", "Diamonds Shine"],
      dsReturnUrl: "http://localhost:3000/ds-return",
      doc2File: "./sample-pdf.pdf",
    },
  };

  console.log(args);
  args.accessToken = req.cookies["access-token"];
  args.accountId = "47d930d2-005a-446c-ad5d-49b007aa15d4";
  args.basePath = "https://demo.docusign.net/restapi";
  console.log("Args :", args);
  console.log("Hello I m in send Envelope", args);

  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(args.basePath);
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + args.accessToken);
  let envelopesApi = new docusign.EnvelopesApi(dsApiClient);

  args.envelopeArgs.status = "created";

  let envelope = makeEnvelope(args.envelopeArgs);

  let results = await envelopesApi
    .getEnvelope(
      "47d930d2-005a-446c-ad5d-49b007aa15d4",
      "ee9830ba-90f0-4871-8712-58c3a9db78a6"
    )
    .catch((err) => {
      console.log(err);
      return res.status(400).send(err);
    });
  let envelopeId = results.envelopeId;

  let a = await envelopesApi.createEnvelope(args.accountId);
  console.log(a);

  console.log(results, "results");

  console.log(envelopeId);
  let viewRequest = makeSenderViewRequest(args.envelopeArgs);
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

  var doc2b64 = Buffer.from(doc2DocxBytes).toString("base64");
  let doc2 = new docusign.Document.constructFromObject({
    documentBase64: doc2b64,
    name: args.document_title,
    fileExtension: "pdf",
    documentId: "1",
  });

  env.documents = [doc2];

  var Allsigners = [];
  var signerEmail_list = args.signerEmail;
  var signerName_list = args.signerName;
  var recIDs = 1;
  for (var i = 0; i < signerEmail_list.length; i++) {
    var signer1 = docusign.Signer.constructFromObject({
      email: signerEmail_list[i],
      name: signerName_list[i],
      recipientId: recIDs.toString(),
      routingOrder: recIDs.toString(),
    });
    Allsigners.push(signer1);
    recIDs = parseInt(recIDs) + 1;
  }

  console.log("All signers :", Allsigners);
  let recipients = docusign.Recipients.constructFromObject({
    signers: Allsigners,
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
