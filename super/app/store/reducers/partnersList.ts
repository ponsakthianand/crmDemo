import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface PartnersData {
  _id: string;
  name: string;
  email: string;
  photo: any[];
  created_at: string;
  updated_at: string;
}

interface PartnersInfo {
  data: PartnersData[];
  loading: boolean;
}

export const initialState: PartnersInfo = {
  data: null as any,
  loading: false,
};

const Partnerslice = createSlice({
  name: 'All Partners list',
  initialState,
  reducers: {
    fetchPartners: (state) => {
      state.loading = true;
    },
    PartnersSuccess: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    PartnersFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchPartners, PartnersSuccess, PartnersFailure } =
  Partnerslice.actions;

export default Partnerslice.reducer;

export function fetchPartnersListAPI(seesionId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchPartners());

    await fetch(`/api/list/partners`, {
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
          dispatch(PartnersFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(PartnersSuccess(data));
      })
      .catch((error) => {
        dispatch(PartnersFailure(error));
      });
  };
}
