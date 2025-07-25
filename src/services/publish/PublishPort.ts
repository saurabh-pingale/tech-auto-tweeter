import { SynthesizedTweet } from '../../domain/types';

export interface PublishPort {
  publish(tweet: SynthesizedTweet): Promise<void>;
}