import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env';
import { LLMPort } from './LLMPort';
import { RawItem, SynthesizedTweet } from '../../domain/types';

const SYSTEM_PROMPT = `
You are a social media assistant. 
Given a list of short texts about technology (tweets), 
write ONE concise tweet (2-3 lines, max 260 characters) summarizing the most interesting/latest technology theme(s). 
- Use plain text (no HTML entities like &amp;).
- Avoid hashtags and emojis unless essential.
- Be factual
`;

export class GeminiClient implements LLMPort {
  private genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  private model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async synthesizeTweet(items: RawItem[]): Promise<SynthesizedTweet> {
    const material = items.map((i, idx) => `${idx + 1}. ${i.text}`).join('\n');

    const prompt = `${SYSTEM_PROMPT}\n\nHere are the items:\n${material}\n\nReturn ONLY the final tweet text.`;

    const res = await this.model.generateContent(prompt);
    const text = res.response.text().trim();
    return { text };
  }
}