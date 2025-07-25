export interface RawItem {
  id: string;
  text: string;
  url?: string;
  author?: string;
  publishedAt?: string;
}

export interface SynthesizedTweet {
  text: string;
}