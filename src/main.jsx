import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { ModalsProvider } from '@mantine/modals';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.jsx';
import { persister, store } from './store/store.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
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
                  },
                }}
              />
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </ModalsProvider>
    </MantineProvider>
  </StrictMode>,
);
