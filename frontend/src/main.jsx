import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#0f172a', color: '#f1f5f9', borderRadius: '12px', border: '1px solid #1e293b', fontSize: '14px', fontFamily: 'Sora, sans-serif' },
            success: { iconTheme: { primary: '#0ea5e9', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
