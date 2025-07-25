import { env } from './config/env';
import { TwitterIngest } from './services/ingest/twitterIngest';
import { GeminiClient } from './services/llm/geminiClient';
import { TwitterPublisher } from './services/publish/twitterPublisher';
import { ComposeAndPublish } from './usecases/composeAndPublish';

export async function handler(): Promise<void> {
  const ingest = new TwitterIngest();

  const publisher = new TwitterPublisher();

  const llm = new GeminiClient();

  const usecase = new ComposeAndPublish(ingest, llm, publisher);
  await usecase.run(env.TWEET_TOPIC, env.TWEET_MAX_ITEMS);
}

if (require.main === module) {
  handler().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}