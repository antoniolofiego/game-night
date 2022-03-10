import { useState, useMemo } from 'react';
import axios from 'axios';
import { Collection } from '@components';
import { useFormik } from 'formik';
import { useQuery } from 'react-query';

const Home = () => {
  const [bggUsername, setBggUsername] = useState('');

  const fetchData = async () => {
    const res = await axios.get(`/api/collection?username=${bggUsername}`);
    return res;
  };

  const { isLoading, data } = useQuery(['collection', bggUsername], fetchData, {
    enabled: bggUsername !== '',
  });

  const formik = useFormik({
    initialValues: {
      username: '',
    },
    onSubmit: (values) => {
      setBggUsername(values.username);
    },
  });

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
            Cell: ({ cell: { value } }) => (
              <p>{value ? value.toFixed(2) : 'NA'}</p>
            ),
          },
          {
            Header: 'Rank',
            accessor: 'rank',
          },
          {
            Header: 'Weight',
            accessor: 'weight',
            Cell: ({ cell: { value } }) => (
              <p>{value ? value.toFixed(2) : 'NA'}</p>
            ),
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
      <form onSubmit={formik.handleSubmit}>
        <input
          className='bg-gray-900'
          type='text'
          placeholder='BGG username'
          id='username'
          name='username'
          onChange={formik.handleChange}
          value={formik.values.username}
        />
        <button type='submit'>Submit</button>
      </form>

      {data && !isLoading ? (
        <Collection.Table
          columns={columns}
          data={data.data.games.filter((game) => game.rank >= 1)}
        />
      ) : null}
    </div>
  );
};

export default Home;
