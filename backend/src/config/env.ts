import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  GEMINI_API_KEY: z.string().min(1),
  TWITTER_APP_KEY: z.string().optional(),
  TWITTER_APP_SECRET: z.string().optional(),
  TWITTER_ACCESS_TOKEN: z.string().optional(),
  TWITTER_ACCESS_SECRET: z.string().optional(),
  TELEGRAM_API_ID: z.string().optional(),
  TELEGRAM_API_HASH: z.string().optional(),
  TELEGRAM_SESSION: z.string().optional(),
  FARCASTER_SIGNER_UUID: z.string().optional(),
  NEYNAR_API_KEY: z.string().optional(),
  NEYNAR_BASE_URL: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  MONGODB_URI: z.string().optional(),
  TWEET_MAX_ITEMS: z
  .string()
  .transform(Number)
  .or(z.number())
    .default(20)
});

const parsed = schema.parse(process.env);

export const env = {
  GEMINI_API_KEY: parsed.GEMINI_API_KEY,
  TWITTER_APP_KEY: parsed.TWITTER_APP_KEY,
  TWITTER_APP_SECRET: parsed.TWITTER_APP_SECRET,
  TWITTER_ACCESS_TOKEN: parsed.TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_SECRET: parsed.TWITTER_ACCESS_SECRET,
  TELEGRAM_API_ID: parsed.TELEGRAM_API_ID,
  TELEGRAM_API_HASH: parsed.TELEGRAM_API_HASH,
  TELEGRAM_SESSION: parsed.TELEGRAM_SESSION,
  FARCASTER_SIGNER_UUID: parsed.FARCASTER_SIGNER_UUID,
  NEYNAR_API_KEY: parsed.NEYNAR_API_KEY,
  NEYNAR_BASE_URL: parsed.NEYNAR_BASE_URL,
  FIREBASE_PROJECT_ID: parsed.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: parsed.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: parsed.FIREBASE_PRIVATE_KEY,
  MONGODB_URI: parsed.MONGODB_URI,
  TWEET_MAX_ITEMS:
    typeof parsed.TWEET_MAX_ITEMS === 'number'
      ? parsed.TWEET_MAX_ITEMS
      : Number(parsed.TWEET_MAX_ITEMS)
};