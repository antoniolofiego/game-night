type ConfirmationProps = {
  email: string;
};

const Confirmation: React.FC<ConfirmationProps> = ({ email }) => {
  return (
    <div>
      <p>
        We sent an email to <span className='font-bold underline'>{email}</span>{' '}
        with a confirmation link.
      </p>
      <p className='font-bold'>Click it to continue.</p>
    </div>
  );
};

export default Confirmation;
