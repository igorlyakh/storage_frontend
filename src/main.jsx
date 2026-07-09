import '@mantine/charts/styles.css';
import { createTheme, DirectionProvider, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/nprogress/styles.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.jsx';
import './i18n/config.js';
import { persister, store } from './store/store.js';

const theme = createTheme({
  defaultRadius: 'md',
  primaryShade: 6,
  shadows: {
    xs: '0 1px 2px rgba(15, 23, 42, 0.06)',
    sm: '0 2px 8px rgba(15, 23, 42, 0.08)',
    md: '0 8px 24px rgba(15, 23, 42, 0.1)',
    lg: '0 16px 40px rgba(15, 23, 42, 0.12)',
  },
  components: {
    Paper: {
      defaultProps: { shadow: 'xs' },
    },
    Card: {
      defaultProps: { shadow: 'sm', radius: 'lg' },
    },
    Button: {
      defaultProps: { radius: 'md' },
    },
    Badge: {
      defaultProps: { radius: 'sm' },
    },
    Modal: {
      defaultProps: { radius: 'lg', shadow: 'lg' },
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SpeedInsights />
    <Analytics />
    <DirectionProvider>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <Provider store={store}>
            <PersistGate
              loading={null}
              persistor={persister}
            >
              <BrowserRouter>
                <App />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: '#242020',
                      color: '#ffffff',
                      borderRadius: 10,
                    },
                  }}
                />
              </BrowserRouter>
            </PersistGate>
          </Provider>
        </ModalsProvider>
      </MantineProvider>
    </DirectionProvider>
  </StrictMode>,
);
