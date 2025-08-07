import axios from 'axios';
import { PublishPort } from './PublishPort';
import { SingleTweet } from '../../domain/types';
import { env } from '../../config/env';

export class FarcasterPublisher implements PublishPort {
  private readonly signerUuid: string;
  private readonly apiBaseUrl: string;

  constructor() {
    if (!env.FARCASTER_SIGNER_UUID || !env.NEYNAR_API_KEY) {
      throw new Error('Farcaster credentials missing. Check your .env');
    }

    this.signerUuid = env.FARCASTER_SIGNER_UUID;
    this.apiBaseUrl = env.NEYNAR_BASE_URL!;
  }

  private requiredHeader() {
    return {
      'Content-Type': 'application/json',
      'api_key': env.NEYNAR_API_KEY
    };
  }

  async publish(tweet: SingleTweet): Promise<void> {
    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/farcaster/cast`,
        {
          signer_uuid: this.signerUuid,
          text: tweet.text
        },
        { headers: this.requiredHeader() }
      );
      console.log('Farcaster post created!', 'hash:', response.data.cast.hash);
    } catch (error) {
      if (axios.isAxiosError(error)) {
          console.error('Farcaster publish error:', error.response?.data || error.message);
      } else {
        console.error(`Farcaster publish unknown error:`, error);
      }
    }
  }
}