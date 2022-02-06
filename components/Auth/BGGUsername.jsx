import { useState } from 'react';
import { useUser } from '@context/user';
import { supabase } from '@utils/supabase';

const BGGUsername = ({ next }) => {
  const [BGGUsername, setBGGUsername] = useState('');

  const { user, isLoading } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: userData, error } = await supabase
      .from('profile')
      .update({ bggUsername: BGGUsername })
      .eq('id', user?.id);

    if (error) {
      throw new Error(error.message);
    }

    if (!isLoading) {
      next();
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col space-y-5'>
      <label>BoardGameGeek Username</label>
      <input
        type='text'
        name='username'
        value={BGGUsername}
        onChange={(e) => setBGGUsername(e.target.value.trim())}
        placeholder='Your BGG Username'
        className='dark:bg-slate-900'
      />
      <button type='submit'>Submit</button>
    </form>
  );
};

export default BGGUsername;
