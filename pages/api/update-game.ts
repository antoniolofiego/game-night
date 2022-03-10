import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import NextCors from 'nextjs-cors';
import { parseString } from 'xml2js';
import { Game, BGGBoardGame } from '@typings';

const BASE_URL = 'https://www.boardgamegeek.com/xmlapi2';

const parseGame = (game: BGGBoardGame): Game | null => {
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

  const allRanks = game.statistics[0].ratings[0].ranks[0].rank;
  const bgRank = allRanks.filter((rank) => {
    return rank.$.name === 'boardgame';
  })[0].$.value;

  try {
    return {
      bgg_id: parseInt(game.$.id),
      name: game.name[0]?.$.value,
      minPlayers: parseInt(game.minplayers[0]?.$.value) || null,
      maxPlayers: parseInt(game.maxplayers[0]?.$.value) || null,
      thumbnail: game.thumbnail[0] || null,
      image: game.image[0] || null,
      description: game.description[0] || null,
      playingTime: parseInt(game.playingtime[0]?.$.value) || null,
      rating:
        parseFloat(game.statistics[0].ratings[0].average[0].$.value) || null,
      rank: parseInt(bgRank) || null,
      weight:
        parseFloat(game.statistics[0].ratings[0].averageweight[0].$.value) ||
        null,
      mechanics: mechanics || null,
      categories: categories || null,
    };
  } catch (err) {
    console.log(`${game.$.id}: ${err}`);
    return null;
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await NextCors(req, res, {
    methods: ['POST'],
    origin: '*',
    optionsSuccessStatus: 200,
  });

  const ids: string = req.query.id as string;

  const fetchGameData = async () => {
    const URL = `${BASE_URL}/thing?id=${ids}&stats=1`;

    const gameResponse = await axios.get(URL, {
      responseType: 'text',
      timeout: 10000,
    });

    let games: BGGBoardGame[];
    let gameDetails: Game[] = [];

    parseString(gameResponse.data, (err, result) => {
      games = result.items.item;
      games.map((game) => {
        const parsedGame = parseGame(game);
        if (parsedGame) gameDetails.push(parsedGame);
      });
    });

    res.status(200).send(gameDetails);
  };

  await fetchGameData();
};

export default handler;
