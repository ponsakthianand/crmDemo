import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface CustomersData {
  _id: string;
  name: string;
  email: string;
  photo: any[];
  created_at: string;
  updated_at: string;
}

interface CustomersInfo {
  data: CustomersData[];
  loading: boolean;
}

export const initialState: CustomersInfo = {
  data: null as any,
  loading: false,
};

const Customerslice = createSlice({
  name: 'All Customers list',
  initialState,
  reducers: {
    fetchCustomers: (state) => {
      state.loading = true;
    },
    CustomersSuccess: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    CustomersFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchCustomers, CustomersSuccess, CustomersFailure } =
  Customerslice.actions;

export default Customerslice.reducer;

export function fetchCustomersListAPI(seesionId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCustomers());

    await fetch(`/api/list/customers`, {
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
          dispatch(CustomersFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(CustomersSuccess(data));
      })
      .catch((error) => {
        dispatch(CustomersFailure(error));
      });
  };
}
