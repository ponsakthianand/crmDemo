import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface CustomersData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
  verified: boolean;
  photo: any;
  ticket_count: number;
  current_city: string;
  partner: Partner;
}

export interface Partner {
  id: string;
  name: string;
  partner_user_id: string;
}

export interface CustomersInfo {
  data: CustomersData[];
  loading: boolean;
}

export const initialState: CustomersInfo = {
  data: null as any,
  loading: false,
};

const CustomersSlice = createSlice({
  name: 'All Customers Chat Data',
  initialState,
  reducers: {
    fetchCustomers: (state) => {
      state.loading = true;
    },
    CustomersSuccess: (state, { payload }) => {
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
    CustomersFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchCustomers, CustomersSuccess, CustomersFailure } =
  CustomersSlice.actions;

export default CustomersSlice.reducer;

export function fetchCustomersDataAPI(seesionId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCustomers());

    await fetch(`/api/customers`, {
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
