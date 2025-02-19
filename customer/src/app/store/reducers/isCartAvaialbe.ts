import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { CartItem } from '../../models/productInterfaces';

interface CartCheckInfo {
  data: CartItem[];
  loading: boolean;
}

export const initialState: CartCheckInfo = {
  data: [],
  loading: false,
};

const isCartSlice = createSlice({
  name: 'Check if cart data avaialbe',
  initialState,
  reducers: {
    fetchProfile: (state) => {
      state.loading = true;
    },
    isCartSuccess: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    isCartFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchProfile, isCartSuccess, isCartFailure } =
  isCartSlice.actions;

export default isCartSlice.reducer;

export function updateCartVailableStatus(items: CartItem[]) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchProfile());
    return dispatch(isCartSuccess(items));
  };
}
