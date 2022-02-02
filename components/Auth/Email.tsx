import { useState } from 'react';
import type { FormEvent } from 'react';
import { useUser } from '@context/user';

type EmailProps = {
  next: () => void;
  handleEmail: (email: string) => void;
};

const Email: React.FC<EmailProps> = ({ next, handleEmail }) => {
  const [email, setEmail] = useState('');

  const { login } = useUser();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
    <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col space-y-5'>
      <label>Email</label>
      <input
        type='email'
        name='email'
        value={email}
        onChange={(e) => setEmail(e.target.value.trim())}
        placeholder='your@email.com'
        className='dark:bg-slate-900'
      />
      <button type='submit'>Next</button>
    </form>
  );
};

export default Email;
