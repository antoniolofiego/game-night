import axios from 'axios';
import { parseString } from 'xml2js';
import NextCors from 'nextjs-cors';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Game, CollectionItem } from '@typings';

const BASE_URL = 'https://www.boardgamegeek.com/xmlapi2';
const DEFAULT_TIMEOUT = 5000;

const setTimeoutAsCallback = (
  callback: () => any,
  timeout = DEFAULT_TIMEOUT
) => {
  setTimeout(callback, timeout);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await NextCors(req, res, {
    methods: ['POST'],
    origin: '*',
    optionsSuccessStatus: 200,
  });

  const username: string = req.query.username as string;
  const method: string = req.method as string;

  if (!username) {
    res.status(400).send('Invalid username');
  }

  const getUserCollection = async () => {
    const URL = `${BASE_URL}/collection?username=${username}&own=1`;

    let retries = 0;

    // Collect response from collection endpoint on BGG
    const response = await axios.get(URL, {
      responseType: 'text',
      timeout: 15000,
    });

    switch (response.status) {
      // If request is accepted and queued, retry the query after 5 seconds
      case 202: {
        setTimeoutAsCallback(() => getUserCollection());
        break;
      }
      // If too many requests, wait 2 seconds multiplied by the number of retries and send again up to 3 times
      case 429: {
        const WAIT_UNIT = 2000;
        const fallback = retries * WAIT_UNIT;

        if (retries < 3) {
          setTimeoutAsCallback(() => getUserCollection(), fallback);
          retries += 1;
        }

        break;
      }
      case 200: {
        try {
          let ids: string | undefined;

          let collectionResults:
            | {
                bgg_id: number;
                username: string | undefined;
              }[]
            | undefined;

          parseString(response.data, (err, result) => {
            const collection: CollectionItem[] = result.items.item;

            // We receive a collection of ids
            collectionResults = collection.map((game: CollectionItem) => {
              return {
                bgg_id: parseInt(game.$.objectid),
                username: username,
              };
            });
          });

          // To update the boardgames table we need a comma-separated list of game IDs
          ids = collectionResults?.map((item) => item.bgg_id).join(',');

          try {
            // Call our game parsing endpoint
            const { data } = await axios.post<Game[]>(
              `http://localhost:3000/api/update-game?id=${ids}`
            );

            res.status(200).send({ username: username, games: data });
          } catch (err) {
            if (err.response?.status) {
              res.status(err.response.status).send({ message: err.message });
              break;
            }

            res.status(500).send(err.message);
            break;
          }

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

  switch (method) {
    case 'GET': {
      await getUserCollection();
      break;
    }
    default: {
      res.status(405).send({ message: `Method ${method} not supported.` });
    }
  }
};

export default handler;
