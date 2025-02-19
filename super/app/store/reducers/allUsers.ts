import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface UsersData {
  _id: string;
  name: string;
  email: string;
  photo: any;
  created_at: string;
  updated_at: string;
  permission: string;
  role: string;
  company_id: string;
  verified: boolean;
  created_by_id: string;
  created_by_name: string;
  active: boolean;
}

export interface UsersInfo {
  data: UsersData[];
  loading: boolean;
}

export const initialState: UsersInfo = {
  data: null as any,
  loading: false,
};

const UsersSlice = createSlice({
  name: 'All Users Chat Data',
  initialState,
  reducers: {
    fetchUsers: (state) => {
      state.loading = true;
    },
    UsersSuccess: (state, { payload }) => {
      const sortData = payload?.sort(function (a: any, b: any) {
        const dateA = Date.parse(a.created_at);
        const dateB = Date.parse(b.created_at);
        return dateB - dateA;
      });
      state.data = sortData?.map((item: any) => {
        return {
          ...item,
          id: item?._id,
        };
      });
      state.loading = false;
    },
    UsersFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchUsers, UsersSuccess, UsersFailure } = UsersSlice.actions;

export default UsersSlice.reducer;

export function fetchUsersDataAPI(seesionId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchUsers());

    await fetch(`/api/users`, {
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
          dispatch(UsersFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(UsersSuccess(data));
      })
      .catch((error) => {
        dispatch(UsersFailure(error));
      });
  };
}
