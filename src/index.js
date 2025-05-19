import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeProvider } from 'styled-components';
import { useState, useEffect } from 'react';
import { themes } from './theme';

const getInitialTheme = () => {
  // Eğer register sonrası login sayfasına yönlendiyse, dark tema uygula
  const path = window.location.pathname;
  if (path === '/auth/login' && localStorage.getItem('theme') === null) {
    return 'dark';
  }
  return localStorage.getItem('theme') || 'light';
};

const ThemedApp = () => {
  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeProvider theme={themes[theme]}>
      <Provider store={store}>
        <BrowserRouter basename="">
          <App setTheme={setTheme} theme={theme} />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemedApp />
  </React.StrictMode>
);
