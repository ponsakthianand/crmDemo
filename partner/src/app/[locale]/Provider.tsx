'use client'

import { Provider } from 'react-redux'
import { store } from '@/src/app/store'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }, pageProps: any) {
  return <SessionProvider session={pageProps.session}>
    <Provider store={store}>
      {children}
    </Provider>
  </SessionProvider>
}

export default Providers


// import { Provider } from 'react-redux';
// import { SessionProvider } from 'next-auth/react';
// import type { AppProps } from 'next/app';
// import { store } from '../store';

// const MyApp = ({ Component, pageProps }: AppProps) => {
//   return (
//     <SessionProvider session={pageProps.session}>
//       <Provider store={store}>
//         <Component {...pageProps} />
//       </Provider>
//     </SessionProvider>
//   );
// };

// export default MyApp;
