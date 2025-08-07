import { IngestPort } from './IngestPort';
import { RawItem } from '../../domain/types';
import { TwitterApi } from 'twitter-api-v2';
import { env } from '../../config/env';
import { SINCE_DATE, TWITTER_ACCOUNTS } from '../../constants/constants';
import { logger } from '../../utils/logger';

export class TwitterIngest implements IngestPort {
  private client: TwitterApi;

  constructor() {
    if (
      !env.TWITTER_APP_KEY ||
      !env.TWITTER_APP_SECRET ||
      !env.TWITTER_ACCESS_TOKEN ||
      !env.TWITTER_ACCESS_SECRET
    ) {
      throw new Error('Twitter credentials missing. Check your .env');
    }

    this.client = new TwitterApi({
      appKey: env.TWITTER_APP_KEY,
      appSecret: env.TWITTER_APP_SECRET,
      accessToken: env.TWITTER_ACCESS_TOKEN,
      accessSecret: env.TWITTER_ACCESS_SECRET
    });
  }

  async fetchItems(limit: number): Promise<RawItem[]> {
    const out: RawItem[] = [];

    for (const account of TWITTER_ACCOUNTS) {
      const user = await this.client.v2.userByUsername(account);
      if (!user?.data?.id) continue;

      const res = await this.client.v2.userTimeline(user.data.id, {
        'tweet.fields': ['created_at', 'author_id'],
        max_results: Math.min(limit, 100),
        exclude: ['retweets', 'replies']
      });

      let count = 0;
      for await (const tweet of res.tweets) {
        if (tweet.created_at && tweet.created_at >= SINCE_DATE) {
          const item = {
            id: tweet.id,
            text: tweet.text,
            author: account,
            publishedAt: tweet.created_at,
          };
          logger.info(`[Twitter] Fetched tweet:`, item);
          out.push(item);
          count++;
          if (count >= limit) break;
        }
      }
    }

    return out;
  }
}