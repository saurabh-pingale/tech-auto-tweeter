import { TwitterApi } from 'twitter-api-v2';
import { PublishPort } from './PublishPort';
import { env } from '../../config/env';
import { SingleTweet } from '../../domain/types';

export class TwitterPublisher implements PublishPort {
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

  async publish(tweet: SingleTweet): Promise<void> {
    const res = await this.client.v2.tweet(tweet.text);
    console.log('Tweet posted!', 'id:', res.data?.id);
  }
}