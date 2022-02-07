import { supabase } from '@utils/supabase';

const GamePage = ({ game }) => {
  return (
    <div>
      <p>{game.name}</p>
      <p
        dangerouslySetInnerHTML={{
          __html: game.description.replaceAll('&#10;', '</br>'),
        }}
      />
    </div>
  );
};

export const getStaticPaths = async () => {
  const { data: ids } = await supabase.from('boardgames').select('bgg_id');

  const paths = ids.map((id) => {
    return { params: { bgg_id: id.bgg_id.toString() } };
  });

  return {
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { data: game, error } = await supabase
    .from('boardgames')
    .select('*')
    .eq('bgg_id', params.bgg_id)
    .single();

  return {
    props: {
      game,
    },
  };
};

export default GamePage;
