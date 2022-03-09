import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useUser } from '@context/user';
import { supabase } from '@utils/supabase';
import Email from './Email';
import Confirmation from './Confirmation';
import BGGUsername from './BGGUsername';

export const AuthComponent = () => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');

  const router = useRouter();

  const { user, isLoading } = useUser();

  const MAX_STEPS = 3;
  const imgUrl =
    'https://images.unsplash.com/photo-1595744043037-68de3376ed59?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2709&q=80';

  useEffect(() => {
    if (user?.bggUsername) {
      router.push('/');
    }

    if (user?.created_at && !user?.bggUsername) {
      setStep(2);
    }
  }, [user, router]);

  const nextStep = () => {
    if (step < MAX_STEPS) {
      setStep((prevStep) => (prevStep += 1));
    }
  };

  const ShownStep = [
    <Email next={nextStep} handleEmail={setEmail} key='email' />,
    <Confirmation key='confirmation' email={email} />,
    <BGGUsername next={nextStep} key='username' />,
  ];

  return (
    <main className='flex flex-col items-center justify-center h-screen space-y-8'>
      <Image
        src='/images/LogoDark.png'
        height={50}
        width={223}
        alt='gamenight Logo'
      />
      <div className=''>{ShownStep[step]}</div>
    </main>
  );
};
