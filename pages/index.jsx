import { useState, useEffect } from 'react';
import { useUser } from '@context/user';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { Spinner } from '@components';

const backgroundCombinations = [
  'bg-gradient-to-tr from-red-700 to-red-900',
  'bg-gradient-to-tr from-slate-700 to-slate-900',
  'bg-gradient-to-tr from-emerald-700 to-emerald-900',
  'bg-gradient-to-tr from-blue-700 to-blue-900',
  'bg-gradient-to-tr from-sky-700 to-sky-900',
  'bg-gradient-to-tr from-zinc-700 to-zinc-900',
  'bg-gradient-to-tr from-yellow-700 to-yellow-900',
  'bg-gradient-to-tr from-orange-700 to-orange-900',
  'bg-gradient-to-tr from-green-700 to-green-900',
  'bg-gradient-to-tr from-violet-700 to-violet-900',
  'bg-gradient-to-tr from-teal-700 to-teal-900',
  'bg-gradient-to-tr from-amber-700 to-amber-900',
  'bg-gradient-to-tr from-rose-700 to-rose-900',
  'bg-gradient-to-tr from-indigo-700 to-indigo-900',
  'bg-gradient-to-tr from-fuchsia-700 to-fuchsia-900',
];

const Home = () => {
  const { user, isLoading } = useUser();
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios
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
            <div>
              {collection.map((game) => (
                <p key={game.id}>{game.name}</p>
              ))}
            </div>
          ) : (
            <div>
              No games to show. Wanna add some?{' '}
              {user ? (
                <button
                  onClick={() =>
                    axios.post(`/api/collection?username=${user?.bggUsername}`)
                  }
                >
                  Import your collection!
                </button>
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
