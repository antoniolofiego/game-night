import { useState, useEffect } from 'react';
import { useUser } from '@context/user';
import Image from 'next/image';
import axios from 'axios';

import type { Game, SupabaseCollectionItem } from '@typings';

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

    if (!isLoading) {
      fetchData();
    }
  }, [user, isLoading]);

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
      <div className='grid grid-cols-4'>
        {collection.map((game) => {
          return (
            <div key={game.bgg_id} className='grid items-center grid-cols-6'>
              <span className='relative w-12 h-12 col-span-1'>
                <Image
                  src={game.thumbnail as string}
                  alt={game.name}
                  className='bg-white/15'
                  objectFit='contain'
                  layout='fill'
                />
              </span>
              <p className='col-span-4 truncate'>{game.name}</p>
              <p className='col-span-1 truncate'>{game.playCount}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
