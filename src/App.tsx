import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import Layout from './layout/Layout';
import './styles/Layout.css';
import './styles/Component.css';
import ScrollToTop from 'components/common/ScrollToTop';

const App = (props: any) => {
  const queryClient = new QueryClient();

  useEffect(() => {}, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={props.basename}>
        <ScrollToTop />
        <Layout {...props} />
      </BrowserRouter>
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
};
export default App;
