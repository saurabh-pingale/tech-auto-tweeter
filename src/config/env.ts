import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  GEMINI_API_KEY: z.string().min(1),
  TWITTER_APP_KEY: z.string().optional(),
  TWITTER_APP_SECRET: z.string().optional(),
  TWITTER_ACCESS_TOKEN: z.string().optional(),
  TWITTER_ACCESS_SECRET: z.string().optional(),
  TWEET_TOPIC: z.string().default('technology'),
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
  TWEET_TOPIC: parsed.TWEET_TOPIC,
  TWEET_MAX_ITEMS:
    typeof parsed.TWEET_MAX_ITEMS === 'number'
      ? parsed.TWEET_MAX_ITEMS
      : Number(parsed.TWEET_MAX_ITEMS)
};