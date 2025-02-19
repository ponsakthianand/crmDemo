import { baseUrl } from '@/global';
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import router from 'next/router';
interface AuthState {
  isAuthenticated: boolean;
  user: any;
  access_token: string | null;
}

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  access_token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.access_token = action.payload.access_token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.access_token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;

export function logoutCall() {
  return async (dispatch: Dispatch) => {
    await fetch(`${baseUrl}/customer/logout`, {
      method: 'POST',
    })
      .then(async (response) => {
        if (response.ok) {
          dispatch(logout());
          router.push('/profile');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
