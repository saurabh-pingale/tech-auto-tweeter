import { RawItem } from '../../domain/types';

export interface IngestPort {
  fetchItems(limit: number): Promise<RawItem[]>;
}