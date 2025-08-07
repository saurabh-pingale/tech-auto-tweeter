import axios from 'axios';
import { IngestPort } from './IngestPort';
import { RawItem } from '../../domain/types';
import { HACKER_NEWS } from '../../constants/constants';
import { logger } from '../../utils/logger';

export class HackerNewsIngest implements IngestPort {
  async fetchItems(limit: number): Promise<RawItem[]> {
    const { data: storyIds } = await axios.get<number[]>(`${HACKER_NEWS.BASE_URL}/topstories.json`);

    const topIds = storyIds.slice(0, limit);
    const stories = await Promise.all(
      topIds.map(async (id) => {
        const { data } = await axios.get(`${HACKER_NEWS.BASE_URL}/item/${id}.json`);
        return data;
      })
    );

    const items: RawItem[] = stories.map((story) => ({
      id: story.id.toString(),
      text: `${story.title} - ${story.url || ''}`.trim(),
      url: story.url || '',
      author: story.by,
      publishedAt: new Date(story.time * 1000).toISOString(),
    }));

    console.log(`Fetched ${items.length} Hacker News items:`);
    items.forEach((item, index) => {
      logger.info(`${index + 1}. ${item.text}`);
    });

    return items;
  }
}