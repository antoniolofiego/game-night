import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { parseString } from 'xml2js';

const BASE_URL = 'https://www.boardgamegeek.com/xmlapi2';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //TODO: fix typing
  const query = req.body.query;
  const URL = `${BASE_URL}/search?query=${query}&type=boardgame`;

  const transformSearchResults = (searchResults: any) => {
    return searchResults.map((game: any) => {
      const bgg_id = parseInt(game.$.id);
      const name = game.name ? game.name[0].$.value : '';

      return {
        bgg_id,
        name,
      };
    });
  };

  let searchResults: any;

  const fetchSearchResults = async (URL: string) => {
    const response = await axios.get(URL, {
      responseType: 'text',
    });

    try {
      parseString(response.data, (err, result) => {
        searchResults = result?.items.item;
      });

      res.send(transformSearchResults(searchResults));
    } catch (err) {
      console.log(err);
    }
  };

  await fetchSearchResults(URL);
};

export default handler;
