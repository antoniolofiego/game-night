import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@context/user';

const Logout = () => {
  const router = useRouter();
  const { logout } = useUser();

  useEffect(() => {
    logout();
    router.push('/');
  }, [logout, router]);

  return <div>Logging out...</div>;
};

export default Logout;
