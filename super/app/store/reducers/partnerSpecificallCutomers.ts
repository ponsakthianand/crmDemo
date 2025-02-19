import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface PartnersCustomersData {
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

export interface PartnersCustomersInfo {
  data: PartnersCustomersData[];
  loading: boolean;
}

export const initialState: PartnersCustomersInfo = {
  data: null as any,
  loading: false,
};

const PartnersCustomersSlice = createSlice({
  name: 'All PartnersCustomers Chat Data',
  initialState,
  reducers: {
    fetchPartnersCustomers: (state) => {
      state.loading = true;
    },
    PartnersCustomersSuccess: (state, { payload }) => {
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
    PartnersCustomersFailure: (state) => {
      state.loading = false;
    },
  },
});

export const {
  fetchPartnersCustomers,
  PartnersCustomersSuccess,
  PartnersCustomersFailure,
} = PartnersCustomersSlice.actions;

export default PartnersCustomersSlice.reducer;

export function fetchPartnersCustomersDataAPI(
  seesionId: string,
  partner_id: string
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchPartnersCustomers());

    await fetch(`/api/partners/${partner_id}/customers`, {
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
          dispatch(PartnersCustomersFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(PartnersCustomersSuccess(data));
      })
      .catch((error) => {
        dispatch(PartnersCustomersFailure(error));
      });
  };
}
