import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@context/user';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { Collection, Spinner } from '@components';

const ArrayValues = ({ values }) => {
  return (
    <div className='flex flex-wrap items-center max-w-xl gap-1'>
      {values.map((genre, idx) => {
        return (
          <span
            key={idx}
            className='px-2 py-1 text-gray-900 rounded-full bg-gray-50'
          >
            {genre}
          </span>
        );
      })}
    </div>
  );
};

const Home = () => {
  const { user, isLoading } = useUser();
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios
        .get(`/api/collection?user_id=${user?.id}`)
        .then((res) => res.data);

      data = data.filter((game) => game.rank !== null);
      setCollection(() => data);
    };

    if (!isLoading && user) {
      fetchData();
    }
  }, [user, isLoading]);

  console.log(collection);

  const columns = useMemo(
    () => [
      {
        Header: 'Collection',
        columns: [
          {
            Header: 'BGG ID',
            accessor: 'bgg_id',
          },
          {
            Header: 'Name',
            accessor: 'name',
          },
          {
            Header: 'Minimum Players',
            accessor: 'minPlayers',
          },
          {
            Header: 'Maximum Players',
            accessor: 'maxPlayers',
          },
          {
            Header: 'Playing Time',
            accessor: 'playingTime',
          },
          {
            Header: 'Rating',
            accessor: 'rating',
          },
          {
            Header: 'Rank',
            accessor: 'rank',
          },
          {
            Header: 'Weight',
            accessor: 'weight',
          },
          {
            Header: 'Mechanics',
            accessor: 'mechanics',
            Cell: ({ cell: { value } }) => <ArrayValues values={value} />,
          },
          {
            Header: 'Categories',
            accessor: 'categories',
            Cell: ({ cell: { value } }) => <ArrayValues values={value} />,
          },
        ],
      },
    ],
    []
  );

  console.log(collection);

  return (
    <div>
      <h1>Home component</h1>
      {isLoading && user ? (
        <Spinner />
      ) : (
        <>
          <h1>{user?.bggUsername}</h1>
          <h2>{user?.email}</h2>
          <button
            onClick={() =>
              axios.post(`/api/collection?username=${user?.bggUsername}`)
            }
          >
            Import your collection!
          </button>

          <div>
            {user ? (
              <Link href='/logout'>Logout</Link>
            ) : (
              <Link href='/authFlow'>Login</Link>
            )}
          </div>
          {collection.length > 0 ? (
            <Collection.Table columns={columns} data={collection} />
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
