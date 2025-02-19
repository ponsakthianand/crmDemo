import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface CustomerData {
  _id: string;
  name: string;
  email: string;
  verified: boolean;
  role: string;
  phone: string;
  created_at: string;
  partner_user_id: string;
  status: string;
  organization_name: any;
  organization_type: any;
  description: any;
  updated_at: string;
  secondary_contact: any;
  gender: any;
  date_of_birth: any;
  address: any;
  annual_income: any;
  source_of_income: any;
  marital_status: any;
  pan_number: any;
  aadhaar_number: any;
  no_of_dependants: any;
  current_city: any;
  educational_qualification: any;
  permanent_address: any;
  nominee_name: any;
  nominee_relationship: any;
  nominee_dob: any;
}

interface CustomerInfo {
  data: CustomerData;
  loading: boolean;
}

export const initialState: CustomerInfo = {
  data: null as any,
  loading: false,
};

const profileSlice = createSlice({
  name: 'Profile Data',
  initialState,
  reducers: {
    fetchProfile: (state) => {
      state.loading = true;
    },
    profileSuccess: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    profileFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchProfile, profileSuccess, profileFailure } =
  profileSlice.actions;

export default profileSlice.reducer;

export function fetchProfileDataAPI(seesionId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchProfile());

    await fetch(`/api/profile`, {
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
          dispatch(profileFailure());
          // signOut();
        }
      })
      .then((data) => {
        dispatch(profileSuccess(data));
      })
      .catch((error) => {
        dispatch(profileFailure(error));
      });
  };
}
