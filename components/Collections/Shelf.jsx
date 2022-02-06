const backgroundCombinations = [
  'bg-gradient-to-tr from-red-700 to-red-900',
  'bg-gradient-to-tr from-slate-700 to-slate-900',
  'bg-gradient-to-tr from-emerald-700 to-emerald-900',
  'bg-gradient-to-tr from-blue-700 to-blue-900',
  'bg-gradient-to-tr from-sky-700 to-sky-900',
  'bg-gradient-to-tr from-zinc-700 to-zinc-900',
  'bg-gradient-to-tr from-yellow-700 to-yellow-900',
  'bg-gradient-to-tr from-orange-700 to-orange-900',
  'bg-gradient-to-tr from-green-700 to-green-900',
  'bg-gradient-to-tr from-violet-700 to-violet-900',
  'bg-gradient-to-tr from-teal-700 to-teal-900',
  'bg-gradient-to-tr from-amber-700 to-amber-900',
  'bg-gradient-to-tr from-rose-700 to-rose-900',
  'bg-gradient-to-tr from-indigo-700 to-indigo-900',
  'bg-gradient-to-tr from-fuchsia-700 to-fuchsia-900',
];

export const Shelf = ({ chunkedCollection }) => {
  return (
    <div className='max-w-4xl m-2 mx-auto bg-red-800 border-4 border-black'>
      <div className='flex flex-wrap gap-2 border-8 border-orange-800'>
        {chunkedCollection.map((chunk, i) => {
          return (
            <div
              key={i}
              className='flex flex-col items-center justify-end flex-grow w-48 px-2 my-2'
            >
              {chunk.map((game) => {
                const backgroundColor =
                  backgroundCombinations[game.bgg_id % 15];

                return (
                  <div
                    key={game.bgg_id}
                    className={`flex justify-center w-48 border min-w-fit items-center basis-16 ${backgroundColor} hover:scale-110 transition-all`}
                  >
                    <p className='mx-2 my-4 text-center'>{game.name}</p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
