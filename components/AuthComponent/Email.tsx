import { useState } from 'react';
import type { FormEvent } from 'react';
import { useUser } from '@context/user';

type EmailProps = {
  next: () => void;
};

const Email: React.FC<EmailProps> = ({ next }) => {
  const [email, setEmail] = useState('');

  const { login } = useUser();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      login(email);
      next();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='flex w-48 mx-auto my-12'>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className='flex flex-col space-y-5'
      >
        <label>Email</label>
        <input
          type='email'
          name='email'
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          placeholder='your@email.com'
        />
        <button type='submit'>Next</button>
      </form>
    </div>
  );
};

export default Email;
