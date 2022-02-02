import type { AppProps } from 'next/app';

import UserProvider from '@context/user';
import { ThemeProvider } from 'next-themes';

import '@styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute='class'>
      <UserProvider>
        <div className='dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-gray-800'>
          <Component {...pageProps} />
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}
export default MyApp;
