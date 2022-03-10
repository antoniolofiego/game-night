import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@context/user';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { Collection, Spinner } from '@components';

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
  }, [user, isLoading, collection]);

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
            Cell: ({ cell: { value } }) => <p>{value.toFixed(2)}</p>,
          },
          {
            Header: 'Rank',
            accessor: 'rank',
          },
          {
            Header: 'Weight',
            accessor: 'weight',
            Cell: ({ cell: { value } }) => <p>{value.toFixed(2)}</p>,
          },
          {
            Header: 'Mechanics',
            accessor: 'mechanics',
            Cell: ({ cell: { value } }) => (
              <Collection.ArrayValues values={value} />
            ),
          },
          {
            Header: 'Categories',
            accessor: 'categories',
            Cell: ({ cell: { value } }) => (
              <Collection.ArrayValues values={value} />
            ),
          },
        ],
      },
    ],
    []
  );

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
