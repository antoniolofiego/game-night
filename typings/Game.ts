export type Game = {
  id?: string;
  bgg_id: number;
  name: string;
  minPlayers: number | null;
  maxPlayers: number | null;
  thumbnail: string | null;
  image: string | null;
  description: string | null;
  playingTime: number | null;
  rating: number | null;
  rank: number | null;
  weight: number | null;
  mechanics: string[] | null;
  categories: string[] | null;
};
