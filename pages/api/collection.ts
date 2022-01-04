import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { parseString } from 'xml2js';
import { supabase } from '@utils/supabase';
import { BoardGame } from '_types/BoardGame';
import { CollectionItem } from '_types/CollectionItem';
const BASE_URL = 'https://www.boardgamegeek.com/xmlapi2';

type Game = {
	bgg_id: number;
	name: string;
	minPlayers: number;
	maxPlayers: number;
	thumbnail: string;
	image: string;
	description: string;
	playingTime: number;
	mechanics: string;
	categories: string;
};

const parseGame = (game: BoardGame): Game => {
	const mechanics = game.link
		.filter((item) => {
			return item.$.type === 'boardgamemechanic';
		})
		.map((mechanic) => mechanic.$.value)
		.join('|');

	const categories = game.link
		.filter((link) => {
			return link.$.type === 'boardgamecategory';
		})
		.map((category) => category.$.value)
		.join('|');

	return {
		bgg_id: parseInt(game.$.id),
		name: game.name[0].$.value,
		minPlayers: parseInt(game.minplayers[0]?.$.value),
		maxPlayers: parseInt(game.maxplayers[0]?.$.value),
		thumbnail: game.thumbnail[0],
		image: game.image[0],
		description: game.description[0],
		playingTime: parseInt(game.playingtime[0]?.$.value),
		mechanics: mechanics,
		categories: categories,
	};
};

const setTimeoutAsCallback = (callback: () => any) => {
	setTimeout(callback, 1000);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const username = req.body.username;
	const URL = `${BASE_URL}/collection?username=${username}&own=1`;

	let collection: number[];

	const recursiveFetch = async (URL: string) => {
		const response = await axios.get(URL, {
			responseType: 'text',
			timeout: 15000,
		});

		if (response.status === 202) {
			setTimeoutAsCallback(() => recursiveFetch(URL));
		} else if (response.status === 429) {
			res.send({ message: 'Too many requests' });
		} else if (response.status === 200) {
			try {
				parseString(response.data, (err, result) => {
					collection = result?.items?.item.map((game: CollectionItem) =>
						parseInt(game.$.objectid)
					);
				});

				let gameDetails: Game[] = [];

				const ids = collection.join(',');

				const URL = `${BASE_URL}/thing?id=${ids}`;

				const gameResponse = await axios.get(URL, {
					responseType: 'text',
					timeout: 15000,
				});

				let games: BoardGame[];

				parseString(gameResponse.data, (err, result) => {
					games = result.items.item;
					games.map((game) => {
						gameDetails.push(parseGame(game));
					});
				});

				const { error } = await supabase
					.from('boardgames')
					.upsert(gameDetails, {
						ignoreDuplicates: true,
						onConflict: 'bgg_id',
					});

				if (error) {
					console.log(error);
				} else {
					console.log('Sent to Supabase');
				}

				res.send(gameDetails);
			} catch (err) {
				res.status(err.response.status).send({ message: err.message });
			}
		} else {
			res.status(response.status).send(response);
		}
	};

	await recursiveFetch(URL);
};

export default handler;
