import { IngestPort } from './IngestPort';
import { RawItem } from '../../domain/types';
import { TwitterApi } from 'twitter-api-v2';
import { env } from '../../config/env';

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

  async fetchItems(topic: string, limit: number): Promise<RawItem[]> {
    const query = `${topic} lang:en -is:retweet -is:reply`;
    
    const res = await this.client.v2.search(query, {
      max_results: Math.min(limit, 100),
      'tweet.fields': ['created_at', 'author_id', 'lang'],
    });

    const out: RawItem[] = [];
    for await (const tweet of res) {
      out.push({
        id: tweet.id,
        text: tweet.text,
        author: tweet.author_id,
        publishedAt: tweet.created_at ?? undefined,
      });
      if (out.length >= limit) break;
    }

    return out;
  }
}