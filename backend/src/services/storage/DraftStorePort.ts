export interface DraftStorePort {
  getOneAndDelete(): Promise<string | null>;
  saveMany(texts: string[]): Promise<void>;
}