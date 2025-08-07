import { SingleTweet } from '../../domain/types';

export interface PublishPort {
  publish(tweet: SingleTweet): Promise<void>;
}