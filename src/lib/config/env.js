import { config } from "dotenv";
config();
import { z } from "zod";
const schema = z.object({
  PORT: z.string().default("5000"),
  MONGODB_URL: z.string(),
  EMAIL_HOST: z.string(),
  EMAIL_USER: z.string().trim().toLowerCase(),
  EMAIL_PASS: z.string(),
  JWT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  REDIS_PORT: z.string().default("6379"),
  REDIS_HOST: z.string(),
  REDIS_PASSWORD: z.string(),
  UPSTASH_REDIS_REST_URL: z.string(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
});

const parsed = schema.parse(process.env);

export const env = {
  db: {
    url: parsed.MONGODB_URL,
  },
  redis: {
    host: parsed.REDIS_HOST,
    password: parsed.REDIS_PASSWORD,
    port: Number(parsed.REDIS_PORT),
    url: parsed.UPSTASH_REDIS_REST_URL,
    token: parsed.UPSTASH_REDIS_REST_TOKEN,
  },
  google: {
    webClientId: parsed.GOOGLE_CLIENT_ID,
  },
  nodemailer: {
    host: parsed.EMAIL_HOST,
    user: parsed.EMAIL_USER,
    password: parsed.EMAIL_PASS,
  },
  jwt: {
    secret: parsed.JWT_SECRET,
  },
  port: Number(parsed.PORT),
};
