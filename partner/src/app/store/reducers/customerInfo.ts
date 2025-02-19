import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface Info {
  _id: string;
  name: string;
  email: string;
  photo: any;
  partner_id: string;
  partner_name: string;
  partner_user_id: string;
  phone: string;
  role: string;
  company_id: string;
  company_name: string;
  password: string;
  salt: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
  created_by_id: string;
  created_by_name: string;
  current_city: string;
  gender: string;
  secondary_contact: string;
  date_of_birth: string;
  address: string;
  annual_income: number;
  source_of_income: string;
  marital_status: string;
  pan_number: string;
  aadhaar_number: string;
  no_of_dependants: string;
  educational_qualification: string;
  permanent_address: string;
  nominee_name: string;
  nominee_relationship: string;
  nominee_dob: string;
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
  name: 'All Customer Specific',
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
          // signOut();
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
