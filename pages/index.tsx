import { useState, useEffect } from 'react';
import { useUser } from '@context/user';
import axios from 'axios';

import type { Game } from '@typings';

const Home = () => {
  const { user, isLoading } = useUser();
  const [collection, setCollection] = useState<Game[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data: Game[] = await axios
        .get(`/api/collection?user_id=${user?.id}`)
        .then((res) => res.data);
      setCollection(() => data);
    };

    fetchData();
  }, [user]);

  return (
    <div>
      <h1>Home component</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1>{user?.bggUsername}</h1>
          <h2>{user?.email}</h2>
        </>
      )}
      {collection.map((collection) => {
        return <p key={collection.bgg_id}>{collection.name}</p>;
      })}
    </div>
  );
};

export default Home;
