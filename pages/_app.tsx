import type { AppProps } from 'next/app';

import UserProvider from '@context/user';
import { ThemeProvider } from 'next-themes';

import '@styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute='class'>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ThemeProvider>
  );
}
export default MyApp;
