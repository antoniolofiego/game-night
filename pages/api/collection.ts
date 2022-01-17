import { NextApiRequest, NextApiResponse } from 'next';
import { parseString } from 'xml2js';
import NextCors from 'nextjs-cors';
import axios from 'axios';
import { supabase } from '@utils/supabase';
import { CollectionItem } from '_types/CollectionItem';

const BASE_URL = 'https://www.boardgamegeek.com/xmlapi2';

const setTimeoutAsCallback = (callback: () => any) => {
  setTimeout(callback, 5000);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await NextCors(req, res, {
    methods: ['POST'],
    origin: '*',
    optionsSuccessStatus: 200,
  });

  const username: string = req.query.username as string;
  const method: string = req.method as string;

  // TODO: Implement getCollection function
  const getCollection = async () => {
    res.status(501).send('Functionality not yet implemented');
  };

  const updateCollection = async () => {
    const URL = `${BASE_URL}/collection?username=${username}&own=1`;

    const response = await axios.get(URL, {
      responseType: 'text',
      timeout: 15000,
    });

    switch (response.status) {
      case 202: {
        setTimeoutAsCallback(() => updateCollection());
        break;
      }
      case 429: {
        res.send({ message: 'Too many requests' });
        break;
      }
      case 200: {
        try {
          let ids: string | undefined;

          let collectionResults:
            | {
                bgg_id: number;
                user_id: string;
              }[]
            | undefined;

          parseString(response.data, (err, result) => {
            const collection: CollectionItem[] = result.items.item;
            collectionResults = collection.map((game: CollectionItem) => {
              return {
                bgg_id: parseInt(game.$.objectid),
                user_id: '13dd9166-0347-4962-b75c-7399559cea0b',
              };
            });
          });

          ids = collectionResults?.map((item) => item.bgg_id).join(',');

          try {
            await axios.post(
              `http://localhost:3000/api/update-games?id=${ids}`
            );
          } catch (err) {
            if (err.response?.status) {
              res.status(err.response.status).send({ message: err.message });
              break;
            }

            res.status(500).send(err.message);
            break;
          }

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

          res.status(500);
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
      await getCollection();
      break;
    }
    case 'POST': {
      await updateCollection();
      break;
    }
    default: {
      res.status(405).send({ message: `Method ${method} not supported.` });
    }
  }
};

export default handler;
