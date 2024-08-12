import { createSlice } from '@reduxjs/toolkit';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface CartActionPayload {
  id: number;
}

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [] as Product[],
    cart: [] as Product[]
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    addToCart: (state, action) => {
      const product = state.products.find(p => p.id === action.payload.id);
      if (product && !state.cart.some(item => item.id === product.id)) {
        state.cart.push(product);
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload.id);
    }
  }
});

export const { setProducts, addToCart, removeFromCart } = productSlice.actions;
export default productSlice.reducer;
