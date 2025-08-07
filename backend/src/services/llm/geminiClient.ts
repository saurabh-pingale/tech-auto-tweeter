import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLMPort } from './LLMPort';
import { env } from '../../config/env';
import { GEMINI } from '../../constants/constants';
import { RawItem, SynthesizedTweet } from '../../domain/types';

export class GeminiClient implements LLMPort {
  private genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  private model = this.genAI.getGenerativeModel({ model: GEMINI.MODEL });

  async synthesizeTweet(items: RawItem[]): Promise<SynthesizedTweet> {
    const content = items.map((i, idx) => `${idx + 1}. ${i.text}`).join('\n');

    const prompt = `${GEMINI.SYSTEM_PROMPT}\n\nHere are the content:\n${content}`;

    const res = await this.model.generateContent(prompt);
    const raw = res.response.text().trim();

    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    const safe = jsonStart >= 0 && jsonEnd >= 0 ? raw.slice(jsonStart, jsonEnd + 1) : '{}';

    let parsed: any;
    try {
      parsed = JSON.parse(safe);
    } catch (error) {
      throw new Error(`Gemini returned invalid JSON: ${raw}`)
    }

    if (!parsed?.tweets || !Array.isArray(parsed.tweets) || parsed.tweets.length === 0) {
      throw new Error(`Gemini returned no tweets: ${raw}`);
    }

    const tweets = parsed.tweets.map((tweet: string) => tweet.trim()).filter(Boolean).slice(0, 3);

    return { tweets };
  }
}