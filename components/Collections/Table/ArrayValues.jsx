import { useState } from 'react';

export const ArrayValues = ({ values }) => {
  const MAX_VALUES = 3;
  const [shownValues, setShownValues] = useState(values.slice(0, MAX_VALUES));

  const totalValues = values.length;

  return (
    <div className='flex flex-col justify-between'>
      <div className='flex flex-wrap items-center max-w-md gap-1 py-2'>
        {shownValues.map((content, idx) => {
          return (
            <span
              key={idx}
              className='px-2 py-1 text-gray-900 rounded-full bg-gray-50'
            >
              {content}
            </span>
          );
        })}
      </div>
      {totalValues > shownValues.length ? (
        <p onClick={() => setShownValues(values)}>Show more &#9660;</p>
      ) : null}
      {totalValues === shownValues.length && totalValues > MAX_VALUES ? (
        <p onClick={() => setShownValues(values.slice(0, MAX_VALUES))}>
          Show less &#9650;
        </p>
      ) : null}
    </div>
  );
};
