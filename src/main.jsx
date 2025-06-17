// Option 1: Named import (recommended)
import { store } from './app/store';
import ErrorBoundary from './components/ErrorBoundary.jsx';
// Option 2: Default import (also works)
// import store from './app/store';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { Import } from 'lucide-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <ErrorBoundary>

  <Provider store={store}>
    <App />
  </Provider>
      </ErrorBoundary>
);