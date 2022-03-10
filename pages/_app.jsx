import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import '@styles/globals.css';

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider attribute='class'>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
export default MyApp;
