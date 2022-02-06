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

  // If user is not logged in, start the user flow as normal
  if (!user) {
    return { props: {} };
  }

  // Collect username if exists
  const { data: bggUsername, error } = await supabase
    .from('profile')
    .select('bggUsername')
    .eq('id', user?.id)
    .single();

  // If the username is set and the account has been confirmed, redirect to the
  if (user && user?.confirmed_at && bggUsername.bggUsername !== null) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
      props: {},
    };
  }

  // If there's an error, show it on the pag
  if (error) {
    return {
      props: { error: error },
    };
  }

  return { props: {} };
};
