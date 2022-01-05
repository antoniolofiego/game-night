import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import NextCors from 'nextjs-cors';
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
	rating: number;
	bgg_rank: number | null;
	weight: number;
	mechanics: string[];
	categories: string[];
};

const parseGame = (game: BoardGame): Game | null => {
	const mechanics = game.link
		.filter((item) => {
			return item.$.type === 'boardgamemechanic';
		})
		.map((mechanic) => mechanic.$.value);

	const categories = game.link
		.filter((link) => {
			return link.$.type === 'boardgamecategory';
		})
		.map((category) => category.$.value);

	const sendMechData = async () => {
		const { error } = await supabase.from('mechanics').upsert(
			mechanics.map((mechanic) => {
				return { name: mechanic };
			}),
			{
				ignoreDuplicates: true,
				onConflict: 'name',
			}
		);
		if (error) {
			console.log(error);
		}
	};

	const sendCategoryData = async () => {
		const { error } = await supabase.from('categories').upsert(
			categories.map((category) => {
				return { name: category };
			}),
			{
				ignoreDuplicates: true,
				onConflict: 'name',
			}
		);
		if (error) {
			console.log(error);
		}
	};

	// TODO: Replace with user ID from auth session
	const sendUserCollectionData = async () => {
		const { error } = await supabase.from('userCollections').upsert(
			{
				bgg_id: parseInt(game.$.id),
				user_id: 'c4814033-4979-4b10-9f0d-cf0b0c6cb4f5',
			},
			{
				ignoreDuplicates: true,
			}
		);
		if (error) {
			console.log(error);
		}
	};

	sendMechData();
	sendCategoryData();
	sendUserCollectionData();

	const allRanks = game.statistics[0].ratings[0].ranks[0].rank;
	const bgRank = allRanks.filter((rank) => {
		return rank.$.name === 'boardgame';
	})[0].$.value;

	try {
		return {
			bgg_id: parseInt(game.$.id),
			name: game.name[0].$.value,
			minPlayers: parseInt(game.minplayers[0]?.$.value),
			maxPlayers: parseInt(game.maxplayers[0]?.$.value),
			thumbnail: game.thumbnail[0],
			image: game.image[0],
			description: game.description[0],
			playingTime: parseInt(game.playingtime[0]?.$.value),
			rating: parseFloat(game.statistics[0].ratings[0].average[0].$.value),
			bgg_rank: parseInt(bgRank),
			weight: parseFloat(
				game.statistics[0].ratings[0].averageweight[0].$.value
			),
			mechanics: mechanics,
			categories: categories,
		};
	} catch (err) {
		return null;
	}
};

const setTimeoutAsCallback = (callback: () => any) => {
	setTimeout(callback, 5000);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await NextCors(req, res, {
		methods: ['POST'],
		origin: '*',
		optionsSuccessStatus: 200,
	});

	const username: string = req.body.username;
	const updated: boolean | null = req.body.updated;

	const URL = `${BASE_URL}/collection?username=${username}&own=1`;

	const recursiveFetch = async (URL: string) => {
		const response = await axios.get(URL, {
			responseType: 'text',
			timeout: 15000,
		});

		switch (response.status) {
			case 202: {
				setTimeoutAsCallback(() => recursiveFetch(URL));
				break;
			}
			case 429: {
				res.send({ message: 'Too many requests' });
				break;
			}
			case 200: {
				try {
					let ids: string | undefined;

					parseString(response.data, (err, result) => {
						const collection: CollectionItem[] = result.items.item;
						ids = collection
							.map((game: CollectionItem) => parseInt(game.$.objectid))
							.join(',');
					});

					const URL = `${BASE_URL}/thing?id=${ids}&stats=1`;

					const gameResponse = await axios.get(URL, {
						responseType: 'text',
						timeout: 10000,
					});

					let games: BoardGame[];
					let gameDetails: Game[] = [];

					parseString(gameResponse.data, (err, result) => {
						games = result.items.item;
						games.map((game) => {
							const parsedGame = parseGame(game);
							if (parsedGame) gameDetails.push(parsedGame);
						});
					});

					const { data, error } = await supabase
						.from('boardgames')
						.upsert(gameDetails, {
							ignoreDuplicates: true,
							onConflict: 'bgg_id',
						});

					if (error) {
						console.log(error);
					}

					if (updated) {
						res.status(200).send(data);
						break;
					}

					res.status(200).send(gameDetails);
					break;
				} catch (err) {
					if (err.response?.status) {
						res.status(err.response.status).send({ message: err.message });
						break;
					}
					res.status(500).send({ message: err.message });
					break;
				}
			}
			default: {
				res.status(500).send(response);
			}
		}
	};

	await recursiveFetch(URL);
};

export default handler;
