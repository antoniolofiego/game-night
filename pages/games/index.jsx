import { useState } from 'react';
import { supabase } from '@utils/supabase';
import { Spinner } from '@components';
import Link from 'next/link';

const Games = ({ games }) => {
  const [gamesList, setGamesList] = useState(games);
  const [isLoading, setIsLoading] = useState(false);
  const [more, setMore] = useState(true);

  const handleLoadMore = async () => {
    if (!more) return;

    setIsLoading(() => true);

    const nextStep = gamesList.length;
    const { data: newGames, error } = await supabase
      .from('boardgames')
      .select('*')
      .order('rank', { ascending: true })
      .range(nextStep, nextStep + 49);

    setGamesList((prevGamesList) => [...prevGamesList, ...newGames]);
    setIsLoading(() => false);

    if (newGames.length < 50) {
      setMore(() => false);
    }
  };

  return (
    <section>
      <div>
        {gamesList.map((game) => {
          return (
            <div key={game.id}>
              <Link href={`/games/${game.bgg_id}`}>
                <a>{game.name}</a>
              </Link>
            </div>
          );
        })}
      </div>
      {isLoading ? <Spinner /> : null}
      {more ? <button onClick={handleLoadMore}>Load more</button> : null}
    </section>
  );
};

export default Games;

export const getStaticProps = async () => {
  const { data: games, error } = await supabase
    .from('boardgames')
    .select('*')
    .order('rank', { ascending: true })
    .range(0, 49);

  return {
    props: {
      games: games,
    },
  };
};
