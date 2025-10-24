import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_TOKEN;

const client = twilio(accountSid, authToken);

export default async function sendWhatshAppMessage(to: string, code: string) {
  try {
    const res = await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:${to}`,
      body: code,
    });
    console.log(res);
  } catch (error) {
    console.error("Erreur d'envoie de message whatshapp:", error);
  }
}
