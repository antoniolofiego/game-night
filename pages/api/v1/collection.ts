import { supabase } from '@utils/supabase';

import axios from 'axios';
import { parseString } from 'xml2js';
import NextCors from 'nextjs-cors';

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Game, CollectionItem, SupabaseCollectionItem } from '@typings';

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
  const user_id: string = req.query.user_id as string;
  const import_only: string | null = req.query.import_only as string;
  const method: string = req.method as string;

  // GET Handler
  const getUserCollection = async () => {
    // If we have a username in the GET handler, throw unallowed error status
    if (username) {
      res.status(406).send({
        message:
          'Use POST method to get a collection by BoardGameGeek username.',
      });
    }

    //
    if (!user_id) {
      res.status(400).send({ message: 'Please, provide a user_id' });
    }

    try {
      const { data, error } = await supabase
        .from('userCollections')
        .select('boardgames(*), shelfOfShame, playCount')
        .eq('user_id', user_id);

      const parsedCollection: Game[] = data?.map(
        (game: SupabaseCollectionItem) => {
          return {
            ...game.boardgames,
            shelfOfShame: game.shelfOfShame,
            playCount: game.playCount,
          };
        }
      ) as Game[];

      if (error) {
        res.status(500).send(error);
      }

      res.status(200).send(parsedCollection);
    } catch (err) {
      console.log(err);
    }
  };

  const createOrUpdateCollection = async () => {
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
        setTimeoutAsCallback(() => createOrUpdateCollection());
        break;
      }
      // If too many requests, wait 2 seconds multiplied by the number of retries and send again up to 3 times
      case 429: {
        const WAIT_UNIT = 2000;
        const fallback = retries * WAIT_UNIT;

        if (retries < 3) {
          setTimeoutAsCallback(() => createOrUpdateCollection(), fallback);
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
                user_id: string | undefined;
              }[]
            | undefined;

          const { user } = await supabase.auth.api.getUserByCookie(req);

          if (!import_only && !user) {
            res.status(403).send({ message: 'Not logged in' });
            break;
          }

          parseString(response.data, (err, result) => {
            const collection: CollectionItem[] = result.items.item;

            // We receive a collection of ids and a single user_id if a user is logged in.
            collectionResults = collection.map((game: CollectionItem) => {
              return {
                bgg_id: parseInt(game.$.objectid),
                user_id: user?.id,
              };
            });
          });

          // To update the boardgames table we need a comma-separated list of game IDs
          ids = collectionResults?.map((item) => item.bgg_id).join(',');
          const idsArray = collectionResults?.map((item) => item.bgg_id) || [];

          try {
            // Call our game parsing endpoint
            await axios.post(`http://localhost:3000/api/update-game?id=${ids}`);
          } catch (err) {
            if (err.response?.status) {
              res.status(err.response.status).send({ message: err.message });
              break;
            }

            res.status(500).send(err.message);
            break;
          }

          // If we want to only import a new set of games (for example to check an unauthenticated user collection) we need to pass the query param import_only
          if (import_only === '1') {
            const { data: games, error } = await supabase
              .from('boardgames')
              .select('*')
              .in('bgg_id', idsArray);

            if (error) {
              res.status(500).send({ message: error.message });
            }

            res.status(200).send(games);
            break;
          }

          // After this point, we assume that the user is logged in and they're trying to update their own collection from BGG
          // If the user is not logged in, we throw an unauthenticated status
          if (!user) {
            res.status(403).send({ message: 'Not logged in' });
            break;
          }

          if (user) {
            // If there are any items in the user collection, we upsert that user's collection in Supabase
            if (collectionResults) {
              const { data, error } = await supabase
                .from('userCollections')
                .upsert(collectionResults, {
                  ignoreDuplicates: true,
                });
              if (error) {
                console.log(error);
              }
              res.status(200).send(data);
              break;
            }

            res.status(500).send({ message: 'Unexpected server error.' });
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
    case 'POST': {
      await createOrUpdateCollection();
      break;
    }
    default: {
      res.status(405).send({ message: `Method ${method} not supported.` });
    }
  }
};

export default handler;
