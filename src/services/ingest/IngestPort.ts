import { RawItem } from '../../domain/types';

export interface IngestPort {
  fetchItems(topic: string, limit: number): Promise<RawItem[]>;
}