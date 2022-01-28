import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';

import { useUser } from '@context/user';

import type { User } from '@supabase/supabase-js';
import type { Game } from '_types';

type PropType = {
  user: User;
};

const Home: React.FC<PropType> = () => {
  const [collection, setCollection] = useState<Game[] | []>([]);
  const [dataIsLoading, setDataIsLoading] = useState<boolean>(false);

  const { user, login, logout, isLoading } = useUser();

  const refreshCollection = async () => {
    await axios.post('/api/collection?username=cloudalf');
  };

  useEffect(() => {
    const loadData = async () => {
      setDataIsLoading(true);
      const collection = await axios
        .get(`/api/collection?user_id=${user?.id}`)
        .then((res) => res.data);

      setCollection(collection);
      setDataIsLoading(false);
    };

    if (!isLoading && user) {
      loadData();
    }
  }, [isLoading, user]);

  const collectionComponent = collection.map((game, i) => {
    return (
      <div key={game.id}>
        <p>
          {game.name} - {game.weight}
        </p>
      </div>
    );
  });

  const loadingState = <p>Loading...</p>;

  const noGames = <p>No games to show</p>;

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
        <button onClick={refreshCollection}>Refresh collection</button>
        <button onClick={login}>Login</button>
        <button
          onClick={() => {
            setCollection(() => []);
            logout();
          }}
        >
          Logout
        </button>
        <p>{user && user.id}</p>
        <p>{user && user.email}</p>
        {dataIsLoading && loadingState}
        {collection.length === 0 ? noGames : collectionComponent}
      </main>
    </>
  );
};

export default Home;
