import twilio from "twilio";

const accountSid = "ACde1cb7e9307892b3ef94241054cd0ae0";
const authToken = "dd083bfa537bfd0351c34f9f6e7d2578";

const client = twilio(accountSid, authToken);

export default async function sendWhatshAppMessage() {
  try {
    const res = await client.messages.create({
      from: "whatsapp:+14155238886",
      contentSid: "HXb5b62575e6e4ff6129ad7c8efe1f983e",
      contentVariables: '{"1":"12/1","2":"3pm"}',
      to: "whatsapp:+22395248106",
      body: "ldldld",
    });
    console.log(res);
  } catch (error) {
    console.error("Erreur d'envoie de message whatshapp");
  }
}
