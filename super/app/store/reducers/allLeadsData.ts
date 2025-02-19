import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface LeadsInfo {
  _id: string;
  full_Name: string;
  mobile: string;
  mobileTwo: string;
  email: string;
  dob: string;
  age: number;
  annualIncome: string;
  employmentType: string;
  photo: string;
  category: string;
  sub_category: string;
  lead_from: string;
  review_status: string;
  converted: boolean;
  note: string[];
  referral_id: string;
  referral_name: string;
  created_by_id: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
  updated_by_id: string;
  updated_by_name: string;
  updated_history: UpdatedHistory[];
  status: string;
  callSchedule: string;
  callScheduleHistory: CallScheduleHistory[];
  comment: string;
  commentHistory: CommentHistory[];
  isCustomer: boolean;
  customer_id: string;
  customer_name: string;
  street: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  panNumber: string;
  aadharNumber: string;
  filingType: any[];
  loanType: string;
  delayInPayment: boolean;
  insuranceType: any[];
  isKnownCoverage: boolean;
  healthCondition: string;
  differentlyAbled: boolean;
  lifeStyleHabits: string;
  isIncomeTaxFiled: boolean;
  residentialStatus: string;
}

export interface UpdatedHistory {
  updated_at: string;
  updated_by_id: string;
  updated_by_name: string;
  changes: any;
}
export interface CallScheduleHistory {
  callSchedule: string;
  updated_at: string;
  updated_by_id: string;
  updated_by_name: string;
}

export interface CommentHistory {
  comment: string;
  updated_at: string;
  updated_by_id: string;
  updated_by_name: string;
}

interface LeadsDataInfo {
  data: LeadsInfo[];
  loading: boolean;
}

export const initialState: LeadsDataInfo = {
  data: null as any,
  loading: false,
};

const LeadsSpecificSlice = createSlice({
  name: 'Leads Specific',
  initialState,
  reducers: {
    fetchLeads: (state) => {
      state.loading = true;
    },
    LeadsSuccess: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    LeadsFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchLeads, LeadsSuccess, LeadsFailure } =
  LeadsSpecificSlice.actions;

export default LeadsSpecificSlice.reducer;

export function fetchAllLeadsDataAPI(seesionId: string) {
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
          dispatch(LeadsFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(LeadsSuccess(data));
      })
      .catch((error) => {
        dispatch(LeadsFailure(error));
      });
  };
}
