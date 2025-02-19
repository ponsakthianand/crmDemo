import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface Info {
  _id: string;
  name: string;
  email: string;
  phone: string;
  partner_id: string[];
  created_at: string;
  role: string;
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
  password: string;
  old_passwords: OldPassword[];
  pending_changes: PendingChanges;
  verified: boolean;
  updated_at: string;
  photo: any[];
  tickets: string[];
}

export interface OldPassword {
  password: string;
  expires_at: string;
}

export interface PendingChanges {
  name: string;
  email: string;
  phone: string;
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
  updated_at: string;
}

interface CustomersInfo {
  data: Info;
  loading: boolean;
}

export const initialState: CustomersInfo = {
  data: null as any,
  loading: false,
};

const CustomerSpecificSlice = createSlice({
  name: 'Customer Specific',
  initialState,
  reducers: {
    fetchCustomer: (state) => {
      state.loading = true;
    },
    CustomerSuccess: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    CustomerFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchCustomer, CustomerSuccess, CustomerFailure } =
  CustomerSpecificSlice.actions;

export default CustomerSpecificSlice.reducer;

export function fetchCustomerSpecificDataAPI(
  seesionId: string,
  cus_id: string
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCustomer());

    await fetch(`/api/customers/${cus_id}`, {
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
          dispatch(CustomerFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(CustomerSuccess(data));
      })
      .catch((error) => {
        dispatch(CustomerFailure(error));
      });
  };
}
