import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface PartnersData {
  _id: string;
  name: string;
  email: string;
  role: string;
  photo: any[];
  phone: string;
  created_at: string;
  partner_user_id: string;
  status: string;
  organization_name: string;
  organization_type: string;
  description: string;
  updated_at: string;
  secondary_contact: string;
  gender: string;
  date_of_birth: string;
  address: string;
  annual_income: number;
  source_of_income: string;
  marital_status: string;
  pan_number: string;
  aadhaar_number: string;
  no_of_dependants: string;
  current_city: string;
  educational_qualification: string;
  permanent_address: string;
  nominee_name: string;
  nominee_relationship: string;
  nominee_dob: string;
}

interface PartnersInfo {
  data: PartnersData[];
  loading: boolean;
}

export const initialState: PartnersInfo = {
  data: null as any,
  loading: false,
};

const PartnersSlice = createSlice({
  name: 'All Partners Data',
  initialState,
  reducers: {
    fetchPartners: (state) => {
      state.loading = true;
    },
    partnersSuccess: (state, { payload }) => {
      state.data = payload?.sort(function (a: any, b: any) {
        const dateA = Date.parse(a.created_at);
        const dateB = Date.parse(b.created_at);
        return dateB - dateA;
      });
      state.loading = false;
    },
    partnersFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchPartners, partnersSuccess, partnersFailure } =
  PartnersSlice.actions;

export default PartnersSlice.reducer;

export function fetchPartnersDataAPI(seesionId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchPartners());

    await fetch(`/api/partners`, {
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
          dispatch(partnersFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(partnersSuccess(data));
      })
      .catch((error) => {
        dispatch(partnersFailure(error));
      });
  };
}
