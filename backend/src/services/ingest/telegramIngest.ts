import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { env } from '../../config/env';
import { SINCE_DATE } from '../../constants/constants';
import { RawItem } from '../../domain/types';
import { normalizeDate } from "../../utils/utils";
import { logger } from '../../utils/logger';

export class TelegramIngest {
    private channels: string[];
    private client: TelegramClient;

  constructor(channels: string[] | string) {
    if (!env.TELEGRAM_API_ID || !env.TELEGRAM_API_HASH || !env.TELEGRAM_SESSION) {
      throw new Error("Missing required TELEGRAM env variables.");
    }

    const sessionString = env.TELEGRAM_SESSION;

    this.channels = Array.isArray(channels) ? channels : [channels];
    this.client = new TelegramClient( 
      new StringSession(sessionString), 
      Number(env.TELEGRAM_API_ID), 
      env.TELEGRAM_API_HASH, 
      { connectionRetries: 5 }
    );
  }

  async init() {
    if (this.client.disconnected) {
      await this.client.connect();
      logger.info("[Telegram] Session loaded and client connected.");
    }
  }

  async fetchItems(limit = 10): Promise<RawItem[]> {
    await this.init();
    let allItems: RawItem[] = [];

    for (const channelName of this.channels) { 
      const channel = await this.client.getEntity(channelName);
      const messages = await this.client.getMessages(channel, { limit: 50 });

      const channelItems: RawItem[] = messages
        .filter((m: any) => {
          const msgDate = normalizeDate(m.date);
          return m.message && msgDate.toISOString() >= SINCE_DATE;
        })
        .slice(0, limit)
        .map((m: any) => {
          const msgDate = normalizeDate(m.date);
          return {
          id: m.id.toString(),
          text: m.message,
          author: channelName,
          publishedAt: msgDate.toISOString(),
        }
      });

      allItems = allItems.concat(channelItems);
    }

    logger.info(`[Telegram] Fetched messages from all channels:`, allItems);
    return allItems;
  }
}