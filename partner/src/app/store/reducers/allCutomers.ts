import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface CustomersData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  partner_id: string[];
  created_at: string;
  role: string;
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
  tickets: Tickets;
  verified: boolean;
  partner: Partner;
}

export interface Tickets {
  ticket_id: string;
  status: string;
  created_at: string;
  created_by: string;
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface CustomersInfo {
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
      state.data = payload?.sort(function (a: any, b: any) {
        const dateA = Date.parse(a.created_at);
        const dateB = Date.parse(b.created_at);
        return dateB - dateA;
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
          // signOut();
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
