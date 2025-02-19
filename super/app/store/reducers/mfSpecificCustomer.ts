import { baseUrl } from '@/global';
import { MutualFundsDocument } from '@/types/mutual-funds';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

interface MutualFundssInfo {
  data: MutualFundsDocument[];
  loading: boolean;
}

export const initialState: MutualFundssInfo = {
  data: null as any,
  loading: false,
};

const MutualFundsSpecificSlice = createSlice({
  name: 'Financial Tracker MutualFunds Specific',
  initialState,
  reducers: {
    fetchMutualFunds: (state) => {
      state.loading = true;
    },
    MutualFundsSuccess: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    MutualFundsFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchMutualFunds, MutualFundsSuccess, MutualFundsFailure } =
  MutualFundsSpecificSlice.actions;

export default MutualFundsSpecificSlice.reducer;

export function fetchMutualFundsSpecificDataAPI(
  seesionId: string,
  cus_id: string
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchMutualFunds());
    await fetch(`/api/customers/${cus_id}/mf`, {
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
          dispatch(MutualFundsFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(MutualFundsSuccess(data));
      })
      .catch((error) => {
        dispatch(MutualFundsFailure(error));
      });
  };
}
