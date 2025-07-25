import { IngestPort } from '../services/ingest/IngestPort';
import { LLMPort } from '../services/llm/LLMPort';
import { PublishPort } from '../services/publish/PublishPort';
import { logger } from '../utils/logger';
import { RawItem } from '../domain/types';

export class ComposeAndPublish {
  constructor(
    private readonly ingest: IngestPort,
    private readonly llm: LLMPort,
    private readonly publisher: PublishPort
  ) {}

  async run(topic: string, limit: number): Promise<void> {
    logger.info(`Fetching ${limit} items about "${topic}"...`);
    const items = await this.ingest.fetchItems(topic, limit);

    if (!items.length) {
      logger.warn('No items fetched, aborting.');
      return;
    }

    this.logFetchedItems(items);

    logger.info(`Fetched ${items.length} items. Sending to Gemini...`);
    const synthesized = await this.llm.synthesizeTweet(items);

    logger.info('Gemini-generated Tweet:');
    console.log(`\n---\n${synthesized.text}\n---\n`);

    logger.info('Publishing...');
    await this.publisher.publish(synthesized);

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