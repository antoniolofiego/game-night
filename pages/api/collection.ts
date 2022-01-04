import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { parseString } from 'xml2js';
import { supabase } from '@utils/supabase';

const BASE_URL = 'https://www.boardgamegeek.com/xmlapi2';

const setTimeoutAsCallback = (callback: () => any) => {
	setTimeout(callback, 1000);
};

export interface GameAPIResponse {
	$: $;
	name?: NameEntity[] | null;
	yearpublished?: string[] | null;
	image?: string[] | null;
	thumbnail?: string[] | null;
	status?: StatusEntity[] | null;
	numplays?: string[] | null;
	comment?: string[] | null;
}
export interface $ {
	objecttype: string;
	objectid: string;
	subtype: string;
	collid: string;
}
export interface NameEntity {
	_: string;
	$: $1;
}
export interface $1 {
	sortindex: string;
}
export interface StatusEntity {
	$: $2;
}
export interface $2 {
	own: string;
	prevowned: string;
	fortrade: string;
	want: string;
	wanttoplay: string;
	wanttobuy: string;
	wishlist: string;
	preordered: string;
	lastmodified: string;
}

type Game = {
	bgg_id: number;
	name: string;
	image_url: string;
	thumbnail_url: string;
};

const transformCollection = (collection: GameAPIResponse[]): Game[] => {
	return collection.map((game: GameAPIResponse) => {
		const name = game.name ? game.name[0]._ : '';
		const image_url = game.image ? game.image[0] : '';
		const thumbnail_url = game.thumbnail ? game.thumbnail[0] : '';

		return {
			bgg_id: parseInt(game.$.objectid),
			name,
			image_url,
			thumbnail_url,
		};
	});
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const username = req.body.username;
	const URL = `${BASE_URL}/collection?username=${username}&own=1`;

	let collection: GameAPIResponse[];

	const recursiveFetch = async (URL: string) => {
		const response = await axios.get(URL, {
			responseType: 'text',
		});

		if (response.status === 202) {
			setTimeoutAsCallback(() => recursiveFetch(URL));
		} else if (response.status === 200) {
			try {
				parseString(response.data, (err, result) => {
					collection = result?.items?.item;
				});

				const parsedCollection = transformCollection(collection);

				const { error } = await supabase
					.from('boardgames')
					.upsert(parsedCollection, {
						ignoreDuplicates: true,
						onConflict: 'bgg_id',
					});

				if (error) {
					console.log(error);
				}

				res.send(parsedCollection);
			} catch (err) {
				console.log(err);
				setTimeoutAsCallback(() => recursiveFetch(URL));
			}
		} else {
			console.log('error: ', response.status);
		}
	};

	await recursiveFetch(URL);
};

export default handler;
