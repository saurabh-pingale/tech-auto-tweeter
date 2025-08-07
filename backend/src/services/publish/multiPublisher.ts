import { PublishPort } from './PublishPort';
import { SingleTweet } from '../../domain/types';

export class MultiPublisher implements PublishPort {
  constructor(private readonly publishers: PublishPort[]) {}

  async publish(tweet: SingleTweet): Promise<void> {
    await Promise.all(
      this.publishers.map((publisher) => publisher.publish(tweet))
    );
  }
}