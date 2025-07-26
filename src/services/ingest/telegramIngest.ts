import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import fs from "fs";
import { env } from '../../config/env';
import { SINCE_DATE } from '../../constants/constants';
import { RawItem } from '../../domain/types';
import { normalizeDate } from "../../utils/utils";
import { logger } from '../../utils/logger';

export class TelegramIngest {
    private channel: string;
    private client: TelegramClient;

  constructor(channel: string) {
    if (!env.TELEGRAM_API_ID || !env.TELEGRAM_API_HASH) {
      throw new Error("Missing TELEGRAM_API_ID or TELEGRAM_API_HASH environment variables.");
    }

    const sessionPath = ".telegram_session";
    const sessionString = fs.existsSync(sessionPath)
      ? fs.readFileSync(sessionPath, "utf8")
      : (env.TELEGRAM_SESSION || "");

    this.channel = channel;
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
      this.saveSession();
    }
  }

  private saveSession() {
    const updatedSession = (this.client.session as StringSession).save();
    fs.writeFileSync(".telegram_session", updatedSession, "utf8");
    logger.info("[Telegram] Session updated and saved to .telegram_session");
  }

  async fetchItems(limit = 10): Promise<RawItem[]> {
    await this.init();

    const channel = await this.client.getEntity(this.channel);
    const messages = await this.client.getMessages(channel, { limit: 50 });

    const items: RawItem[] = messages
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
        author: this.channel,
        publishedAt: msgDate.toISOString(),
      }
    });

    logger.info(`[Telegram] Fetched messages:`, items);
    return items;
  }
}