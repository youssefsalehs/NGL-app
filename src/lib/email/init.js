import { MailJetProvider } from "../../pkg/email/mailJet.js";
import { env } from "../config/env.js";
export const mailjetProvider = new MailJetProvider({
  apiKey: env.mailJet.apiKey,
  apiSecret: env.mailJet.secretKey,
  fromEmail: env.mailJet.fromEmail,
  fromName: env.mailJet.fromName,
});
