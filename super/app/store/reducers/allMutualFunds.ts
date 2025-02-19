import { baseUrl } from '@/global';
import { MutualFundsDocument } from '@/types/mutual-funds';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

interface MutualFundsInfo {
  data: MutualFundsDocument[];
  loading: boolean;
}

export const initialState: MutualFundsInfo = {
  data: null as any,
  loading: false,
};

const MutualFundsSlice = createSlice({
  name: 'All MutualFunds Data',
  initialState,
  reducers: {
    fetchMutualFunds: (state) => {
      state.loading = true;
    },
    mutualFundsSuccess: (state, { payload }) => {
      state.data = payload?.sort(function (a: any, b: any) {
        const dateA = Date.parse(a.created_at);
        const dateB = Date.parse(b.created_at);
        return dateB - dateA;
      });
      state.loading = false;
    },
    mutualFundsFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchMutualFunds, mutualFundsSuccess, mutualFundsFailure } =
  MutualFundsSlice.actions;

export default MutualFundsSlice.reducer;

export function fetchMutualFundsDataAPI(seesionId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchMutualFunds());

    await fetch(`/api/mutualFunds`, {
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
          dispatch(mutualFundsFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(mutualFundsSuccess(data));
      })
      .catch((error) => {
        dispatch(mutualFundsFailure(error));
      });
  };
}
