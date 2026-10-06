import { OAuth2Client } from "google-auth-library";
import { AppError } from "../../pkg/error/error.js";
import { env } from "../config/env.js";

const client = new OAuth2Client({
  client_id: env.google.webClientId,
});
export async function verifyGoogleToken(idToken) {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    throw new AppError("invalid google token.", 403);
  }
}
