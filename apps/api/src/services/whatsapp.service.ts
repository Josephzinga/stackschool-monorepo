import twilio from 'twilio';
import { createServiceError } from '../utils/api-errors';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_TOKEN;

const client = twilio(accountSid, authToken);

export default async function sendWhatsAppMessage(to: string, message: string) {
  try {
    /*  const res = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_MESSAGE_FROM!}`,
      to: `whatsapp:${to}`,
      body: code,
    });
    console.log('Received message', res);*/
    console.log('Message send to', to, message);
  } catch (error) {
    createServiceError("Erreur d'envoie de message whatsapp:", 500, error);
  }
}
