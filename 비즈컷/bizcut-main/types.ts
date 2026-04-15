
export type ShopCategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
  promptPrefix: string;
};

export type AppStep = 'CATEGORY' | 'UPLOAD' | 'GENERATING' | 'RESULT';

export interface GenerationResult {
  imageUrl: string;
  originalUrl?: string;
}
