export type Game = {
	id?: string;
	bgg_id: number;
	name: string;
	minPlayers: number;
	maxPlayers: number;
	thumbnail: string;
	image: string;
	description: string;
	playingTime: number;
	rating: number;
	bgg_rank: number | null;
	weight: number;
	mechanics: string[];
	categories: string[];
};
