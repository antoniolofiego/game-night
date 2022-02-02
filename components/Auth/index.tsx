import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@context/user';
import Email from './Email';
import Confirmation from './Confirmation';
import BGGUsername from './BGGUsername';
import { RoughNotation, RoughNotationGroup } from 'react-rough-notation';

import Image from 'next/image';

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
    <main className='grid items-center w-full h-screen grid-cols-2'>
      <div className='relative'>
        <div className='absolute inset-0 z-50 flex flex-col items-center justify-center h-screen px-8 mx-auto space-y-4'>
          <RoughNotationGroup show={true}>
            <RoughNotation
              type='highlight'
              strokeWidth={12}
              padding={12}
              order={1}
            >
              <h1 className='text-5xl shadow-xl text-slate-900 font-handwritten'>
                Welcome to GameNight!
              </h1>
            </RoughNotation>
            <RoughNotation
              type='highlight'
              strokeWidth={12}
              padding={12}
              order={2}
            >
              <p className='text-slate-900'>
                You&apos;re almost ready to get your next board game night
                going.
              </p>
            </RoughNotation>
          </RoughNotationGroup>
        </div>
        <div className='relative z-20 w-full h-screen blur-sm'>
          <Image
            src={imgUrl}
            alt='Image of a die on a table'
            layout='fill'
            objectFit='cover'
          />
        </div>
      </div>
      <div className='flex max-w-xs mx-auto md:max-w-md lg:max-w-xl'>
        {ShownStep[step]}
      </div>
    </main>
  );
};
