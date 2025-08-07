import { RawItem, SynthesizedTweet } from '../../domain/types';

export interface LLMPort {
  synthesizeTweet(items: RawItem[]): Promise<SynthesizedTweet>;
}