import { useState, useEffect } from 'react';
import { useUser } from '@context/user';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { Spinner } from '@components';

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

    if (!isLoading && user) {
      fetchData();
    }
  }, [user, isLoading]);

  return (
    <div>
      <h1>Home component</h1>
      {isLoading && user ? (
        <Spinner />
      ) : (
        <>
          <h1>{user?.bggUsername}</h1>
          <h2>{user?.email}</h2>
          {user ? (
            <Link href='/logout'>Logout</Link>
          ) : (
            <Link href='/authFlow'>Login</Link>
          )}
          {collection.length > 0 ? (
            <div className='grid grid-cols-4'>
              {collection.map((game) => {
                return (
                  <div
                    key={game.bgg_id}
                    className='grid items-center grid-cols-6'
                  >
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
          ) : (
            <div>
              No games to show. Wanna add some?{' '}
              {user ? (
                <p>Import your collection!</p>
              ) : (
                <Link href='/authFlow'>
                  <a className='cursor-pointer hover:underline'>
                    Login or create an account now
                  </a>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
