import { AuthComponent } from '@components';
import { supabase } from '@utils/supabase';

const AuthFlow = ({ error }) => {
  return (
    <>
      {error ? (
        <p>There was an error retrieving your user.</p>
      ) : (
        <AuthComponent />
      )}
    </>
  );
};

export default AuthFlow;

export const getServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return { props: {} };
  }

  const { data: bggUsername, error } = await supabase
    .from('profile')
    .select('bggUsername')
    .eq('id', user?.id)
    .single();

  console.log(bggUsername);

  if (user && user?.confirmed_at && bggUsername.bggUsername !== null) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
      props: {},
    };
  }

  console.log(error);

  if (error) {
    return {
      props: { error },
    };
  }

  return { props: {} };
};