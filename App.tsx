import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import ProductList from './components/ProductsList';

const App = () => {
  return (
    <Provider store={store}>
      <ProductList />
    </Provider>
  );
};

export default App;
