import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface Info {
  _id: string;
  name: string;
  partner_user_id: string;
  email: string;
  phone: number;
  role: string;
  company_id: string;
  company_name: string;
  password: string;
  salt: string;
  verified: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  created_by_id: string;
  created_by_name: string;
}

interface PartnersInfo {
  data: Info;
  loading: boolean;
}

export const initialState: PartnersInfo = {
  data: null as any,
  loading: false,
};

const PartnerSpecificSlice = createSlice({
  name: 'Partner Specific',
  initialState,
  reducers: {
    fetchPartner: (state) => {
      state.loading = true;
    },
    PartnerSuccess: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    PartnerFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchPartner, PartnerSuccess, PartnerFailure } =
  PartnerSpecificSlice.actions;

export default PartnerSpecificSlice.reducer;

export function fetchPartnerSpecificDataAPI(
  seesionId: string,
  partner_id: string
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchPartner());

    await fetch(`/api/partners/${partner_id}`, {
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
          dispatch(PartnerFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(PartnerSuccess(data));
      })
      .catch((error) => {
        dispatch(PartnerFailure(error));
      });
  };
}
