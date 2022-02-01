import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@context/user';
import { supabase } from '@utils/supabase';

const BGGUsername: React.FC = () => {
  const [BGGUsername, setBGGUsername] = useState('');
  const router = useRouter();

  const { user } = useUser();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data: userData, error } = await supabase
      .from('profile')
      .update({ bggUsername: BGGUsername })
      .eq('id', user?.id);

    if (error) {
      throw new Error(error.message);
    }

    console.log(userData);
    router.push('/');
  };

  return (
    <div className='flex w-48 mx-auto my-12'>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className='flex flex-col space-y-5'
      >
        <label>BoardGameGeek Username</label>
        <input
          type='text'
          name='username'
          value={BGGUsername}
          onChange={(e) => setBGGUsername(e.target.value.trim())}
          placeholder='Your BGG Username'
        />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default BGGUsername;
