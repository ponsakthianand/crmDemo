import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface Info {
  _id: string;
  created_by_id: string;
  created_by: string;
  customer_id: string;
  customer_name: string;
  created_at: string;
  health_status: values;
  overall_health_status: string;
  actualValue: values;
  idealValue: values;
  annualValue: values;
}

export interface values {
  monthly_income: string;
  house_emi_or_rent: string;
  emi: string;
  provisions_expenses: string;
  carbike_expenses: string;
  entertainment_ott_outing: string;
  telephone_wifi: string;
  eb_water: string;
  other_investments: string;
  any_other_monthly_expenses: string;
  lic_insurance_post_office: string;
  term_health_insurance: string;
  bike_car_insurance: string;
  school_fee: string;
  entertainment_ott: string;
  water: string;
  tours_travels: string;
  medical_expenses: string;
  unexpected_emergency: string;
  other_annual_expenses: string;
  any_other_annual_expenses: string;
}

interface FinancialTrackersInfo {
  data: Info[];
  loading: boolean;
}

export const initialState: FinancialTrackersInfo = {
  data: null as any,
  loading: false,
};

const FinancialTrackerSpecificSlice = createSlice({
  name: 'Financial Tracker FinancialTracker Specific',
  initialState,
  reducers: {
    fetchFinancialTracker: (state) => {
      state.loading = true;
    },
    FinancialTrackerSuccess: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    FinancialTrackerFailure: (state) => {
      state.loading = false;
    },
  },
});

export const {
  fetchFinancialTracker,
  FinancialTrackerSuccess,
  FinancialTrackerFailure,
} = FinancialTrackerSpecificSlice.actions;

export default FinancialTrackerSpecificSlice.reducer;

export function fetchFinancialTrackerSpecificDataAPI(
  seesionId: string,
  cus_id: string
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchFinancialTracker());

    await fetch(`/api/customers/${cus_id}/ft`, {
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
          dispatch(FinancialTrackerFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(FinancialTrackerSuccess(data));
      })
      .catch((error) => {
        dispatch(FinancialTrackerFailure(error));
      });
  };
}
