import { useState } from 'react';
import { useUser } from '@context/user';

const Email = ({ next, handleEmail }) => {
  const [email, setEmail] = useState('');

  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      login(email);
      handleEmail(email);
      next();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col space-y-4'>
      <label>Email</label>
      <input
        type='email'
        name='email'
        value={email}
        onChange={(e) => setEmail(e.target.value.trim())}
        placeholder='your@email.com'
        className='dark:bg-slate-900'
      />
      <button
        className='self-center px-8 py-2 text-gray-900 border border-gray-400 rounded-full shadow shadow-gray-200 bg-gray-50'
        type='submit'
      >
        Next
      </button>
    </form>
  );
};

export default Email;
