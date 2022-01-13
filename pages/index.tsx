import Head from 'next/head';
import { supabase } from '@utils/supabase';
import { Game } from '_types/Game';

type PropType = {
  collection: Game[];
};

const Home: React.FC<PropType> = ({ collection }) => {
  // console.log(collection);
  return (
    <>
      <Head>
        <title>GameNight</title>
        <meta
          name='description'
          content='The easy way to organize your board game nights'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <h1>GameNight</h1>
        {collection.map((game, i) => {
          return (
            <div key={game.id}>
              <p>{game.name}</p>
              <p>{game.weight}</p>
            </div>
          );
        })}
      </main>
    </>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const { data: userCollection, error } = await supabase
    .from('userCollections')
    .select(`boardgames(*)`)
    .eq('user_id', 'c4814033-4979-4b10-9f0d-cf0b0c6cb4f5');

  console.log(userCollection?.length);

  const parsedCollection = userCollection?.map((game) => game.boardgames);

  return {
    props: {
      collection: parsedCollection,
    },
  };
};
