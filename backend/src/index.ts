import { env } from './config/env';
import { HackerNewsIngest } from './services/ingest/hackerNewsIngest';
import { TelegramIngest } from './services/ingest/telegramIngest';
// import { TwitterIngest } from './services/ingest/twitterIngest';
import { GeminiClient } from './services/llm/geminiClient';
import { TwitterPublisher } from './services/publish/twitterPublisher';
import { FarcasterPublisher } from './services/publish/farcasterPublisher';
import { MultiPublisher } from './services/publish/multiPublisher';
import { FirestoreDraftStore } from './services/storage/firestoreDraftStore';
import { PostOrGenerate } from './usecases/postOrGenerate';
import { TELEGRAM_CHANNELS } from './constants/constants';
import { MongoUserStore } from './services/storage/mongoUserStore';
import { logger } from './utils/logger';

export async function main(): Promise<void> {
  const userStore = new MongoUserStore();
  const allUsers = await userStore.getAllUsers(); 

  if (!allUsers.length) {
    logger.warn('[Scheduler] No users found in MongoDB. Exiting.');
    return;
  }

  // const twitterIngest = new TwitterIngest();
  const telegramIngest = new TelegramIngest(TELEGRAM_CHANNELS);
  const newsIngest = new HackerNewsIngest();
  const llm = new GeminiClient();
  const drafts = new FirestoreDraftStore();

  for (const user of allUsers) {
    try {
      logger.info(`[Scheduler] Processing user: ${user.screenName} (${user.id})`);

      const twitterPublisher = new TwitterPublisher(user.accessToken, user.accessSecret);
      const farcasterPublisher = new FarcasterPublisher();
      const publisher = new MultiPublisher([twitterPublisher, farcasterPublisher]);

      const usecase = new PostOrGenerate(
        [telegramIngest, newsIngest],
        llm, 
        publisher, 
        drafts
      );

      await usecase.run(Number(env.TWEET_MAX_ITEMS));
    } catch (error) {
      logger.error(`[Scheduler] Failed to process user ${user.screenName}:`, error);
    }
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}