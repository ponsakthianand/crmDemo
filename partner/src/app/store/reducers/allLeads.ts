import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface LeadsData {
  _id: string;
  full_Name: string;
  mobile: string;
  mobileTwo: string;
  email: string;
  category: string;
  review_status: string;
  converted: boolean;
  note: any[];
  status: string;
  callSchedule: string;
  callScheduleHistory: any[];
  isCustomer: boolean;
  created_at: string;
  created_by_name: string;
  updated_at: string;
  updated_by_name: string;
}

interface LeadsInfo {
  data: LeadsData[];
  loading: boolean;
}

export const initialState: LeadsInfo = {
  data: null as any,
  loading: false,
};

const LeadsSlice = createSlice({
  name: 'All Leads Data',
  initialState,
  reducers: {
    fetchLeads: (state) => {
      state.loading = true;
    },
    leadsSuccess: (state, { payload }) => {
      state.data = payload?.sort(function (a: any, b: any) {
        const dateA = Date.parse(a.created_at);
        const dateB = Date.parse(b.created_at);
        return dateB - dateA;
      });
      state.loading = false;
    },
    leadsFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchLeads, leadsSuccess, leadsFailure } = LeadsSlice.actions;

export default LeadsSlice.reducer;

export function fetchLeadsDataAPI(seesionId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchLeads());

    await fetch(`/api/leads`, {
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
          dispatch(leadsFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(leadsSuccess(data));
      })
      .catch((error) => {
        dispatch(leadsFailure(error));
      });
  };
}
