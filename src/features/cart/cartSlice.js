import { createSlice } from '@reduxjs/toolkit';

// Cart lives in localStorage so it survives a page refresh — there's no
// backend Cart collection by design; a cart only becomes real data (an Order)
// once checkout happens.
const loadCart = () => {
  try {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart(), // array of { _id, title, thumbnail, price, discountPrice }
  },
  reducers: {
    addToCart: (state, action) => {
      const exists = state.items.some((c) => c._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload);
        saveCart(state.items);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((c) => c._id !== action.payload);
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCart([]);
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;