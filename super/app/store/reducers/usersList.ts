import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface usersData {
  _id: string;
  name: string;
  email: string;
  photo: any[];
  created_at: string;
  updated_at: string;
}

interface UsersInfo {
  data: usersData[];
  loading: boolean;
}

export const initialState: UsersInfo = {
  data: null as any,
  loading: false,
};

const userslice = createSlice({
  name: 'All admin Users list',
  initialState,
  reducers: {
    fetchusers: (state) => {
      state.loading = true;
    },
    usersSuccess: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    usersFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchusers, usersSuccess, usersFailure } = userslice.actions;

export default userslice.reducer;

export function fetchusersDataAPI(seesionId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchusers());

    await fetch(`/api/list/users`, {
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
          dispatch(usersFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(usersSuccess(data));
      })
      .catch((error) => {
        dispatch(usersFailure(error));
      });
  };
}
