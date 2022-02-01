import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@context/user';
import Email from './Email';
import Confirmation from './Confirmation';
import BGGUsername from './BGGUsername';

export const AuthComponent = () => {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const { user, isLoading } = useUser();

  useEffect(() => {
    if (user?.bggUsername) {
      router.push('/');
    }

    if (user?.created_at && !user?.bggUsername) {
      setStep(2);
    }
  }, [user, router]);

  const MAX_STEPS = 2;

  const nextStep = () => {
    if (step < MAX_STEPS) {
      setStep((prevStep) => (prevStep += 1));
    }
  };

  const ShownStep = [
    <Email next={nextStep} key='email' />,
    <Confirmation key='confirmation' />,
    <BGGUsername key='username' />,
  ];

  return <>{!isLoading && <div>{ShownStep[step]}</div>}</>;
};
