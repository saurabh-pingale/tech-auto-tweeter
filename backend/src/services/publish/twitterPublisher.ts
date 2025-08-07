import { TwitterApi } from 'twitter-api-v2';
import { PublishPort } from './PublishPort';
import { env } from '../../config/env';
import { SingleTweet } from '../../domain/types';

export class TwitterPublisher implements PublishPort {
  private client: TwitterApi;

  constructor(accessToken: string, accessSecret: string) {
    if ( !env.TWITTER_APP_KEY || !env.TWITTER_APP_SECRET ) {
      throw new Error('Twitter credentials missing. Check your .env');
    }

    this.client = new TwitterApi({
      appKey: env.TWITTER_APP_KEY,
      appSecret: env.TWITTER_APP_SECRET,
      accessToken: accessToken,
      accessSecret: accessSecret
    });
  }

  async publish(tweet: SingleTweet): Promise<void> {
    try {
      const user = await this.client.v2.me();
      console.log('Authenticated as:', user.data.username);

      const res = await this.client.v2.tweet(tweet.text);
      console.log('Tweet posted!', 'id:', res.data?.id);
    } catch (error) {
      console.error('Tweet posting failed:', error);
      throw error;
    }
  }
}