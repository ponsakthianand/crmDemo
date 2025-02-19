import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface CustomerData {
  _id: string;
  name: string;
  email: string;
  photo: any[];
  created_at: string;
  updated_at: string;
}

interface CustomerInfo {
  data: CustomerData;
  loading: boolean;
}

export const initialState: CustomerInfo = {
  data: null as any,
  loading: false,
};

const profileSlice = createSlice({
  name: 'Profile Data',
  initialState,
  reducers: {
    fetchProfile: (state) => {
      state.loading = true;
    },
    profileSuccess: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    profileFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchProfile, profileSuccess, profileFailure } =
  profileSlice.actions;

export default profileSlice.reducer;

export function fetchProfileDataAPI(seesionId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchProfile());

    await fetch(`/api/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${seesionId}`,
      },
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          dispatch(profileFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(profileSuccess(data));
      })
      .catch((error) => {
        dispatch(profileFailure(error));
      });
  };
}
