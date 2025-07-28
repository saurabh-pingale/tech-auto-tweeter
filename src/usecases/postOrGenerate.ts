import { IngestPort } from '../services/ingest/IngestPort';
import { LLMPort } from '../services/llm/LLMPort';
import { PublishPort } from '../services/publish/PublishPort';
import { DraftStorePort } from '../services/storage/DraftStorePort';
import { RawItem } from '../domain/types';
import { cleanText } from '../utils/textCleaner';
import { logger } from '../utils/logger';

export class PostOrGenerate {
  constructor(
    private readonly ingests: IngestPort[],
    private readonly llm: LLMPort,
    private readonly publisher: PublishPort,
    private readonly drafts: DraftStorePort
  ) {}

  async run(limit: number): Promise<void> {
    const draft= await this.drafts.getOneAndDelete();
    if (draft) {
      logger.info('Found stored draft, publishing it...');
      await this.publisher.publish({ text: draft });
      logger.info('Done! (used stored draft)');
      return;
    }

    logger.info(`No stored drafts. Fetching ${limit} items...`);
    let allItems: RawItem[] = [];
    for (const ingest of this.ingests) {
      const items = await ingest.fetchItems(limit);
      allItems = allItems.concat(items);
    }

    if (!allItems.length) {
      logger.warn('No items fetched, aborting.');
      return;
    }

    allItems = allItems.map(item => ({
      ...item,
      text: cleanText(item.text)
    }))

    this.logFetchedItems(allItems);

    logger.info(`Fetched ${allItems.length} items. Sending to Gemini...`);
    const { tweets } = await this.llm.synthesizeTweet(allItems);
    logger.info(`Generated Tweets: ${tweets} `);

    if (!tweets.length) {
      logger.warn('Gemini returned 0 tweets, aborting.');
      return;
    }

    const [first, ...rest] = tweets;

    logger.info('Gemini tweet #1 (to publish):\n' + first);
    logger.info('Publishing...');
    await this.publisher.publish({ text: first });

    if (rest.length) {
      logger.info(`Saving ${rest.length} drafts to Firestore...`);
      await this.drafts.saveMany(rest);
    }

    logger.info('Done!');
  }

   private logFetchedItems(items: RawItem[]): void {
    console.log('\n--- Fetched Items ---');
    items.forEach((item, idx) => {
      console.log(`${idx + 1}. ${item.text}`);
    });
    console.log('---------------------\n');
  }
}