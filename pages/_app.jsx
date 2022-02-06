import UserProvider from '@context/user';
import { ThemeProvider } from 'next-themes';

import '@styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute='class'>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ThemeProvider>
  );
}
export default MyApp;
