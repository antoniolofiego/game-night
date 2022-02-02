import axios from 'axios';
import { useRouter } from 'next/router';

import { useUser } from '@context/user';

const ImportBGGCollection = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();

  return <div></div>;
};

export default ImportBGGCollection;
