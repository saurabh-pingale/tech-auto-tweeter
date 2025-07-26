import { env } from './config/env';
import { TelegramIngest } from './services/ingest/telegramIngest';
import { TwitterIngest } from './services/ingest/twitterIngest';
import { GeminiClient } from './services/llm/geminiClient';
import { TwitterPublisher } from './services/publish/twitterPublisher';
import { FirestoreDraftStore } from './services/storage/firestoreDraftStore';
import { PostOrGenerate } from './usecases/postOrGenerate';

export async function handler(): Promise<void> {
  const twitterIngest = new TwitterIngest();
  const telegramIngest = new TelegramIngest('aipost');

  const publisher = new TwitterPublisher();

  const llm = new GeminiClient();

  const drafts = new FirestoreDraftStore();

  const usecase = new PostOrGenerate([twitterIngest, telegramIngest], llm, publisher, drafts);
  await usecase.run(env.TWEET_MAX_ITEMS);
}

if (require.main === module) {
  handler().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}