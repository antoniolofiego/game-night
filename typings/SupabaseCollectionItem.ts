import type { Game } from './Game';

export type SupabaseCollectionItem = {
  boardgames: Game;
  shelfOfShame: boolean;
  playCount: number;
};
