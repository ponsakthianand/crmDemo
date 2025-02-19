import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface FianacialTrackersData {
  _id: string;
  created_by_id: string;
  created_by: string;
  customer_id: string;
  customer_name: string;
  created_at: string;
  actualValue: dataStructure;
  idealValue: dataStructure;
  annualValue: dataStructure;
}

export interface dataStructure {
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

interface FianacialTrackersInfo {
  data: FianacialTrackersData[];
  loading: boolean;
}

export const initialState: FianacialTrackersInfo = {
  data: null as any,
  loading: false,
};

const FianacialTrackerSlice = createSlice({
  name: 'All FianacialTracker Chat Data',
  initialState,
  reducers: {
    fetchFianacialTrackers: (state) => {
      state.loading = true;
    },
    FianacialTrackersSuccess: (state, { payload }) => {
      state.data = payload?.sort(function (a: any, b: any) {
        const dateA = Date.parse(a.created_at);
        const dateB = Date.parse(b.created_at);
        return dateB - dateA;
      });
      state.loading = false;
    },
    FianacialTrackersFailure: (state) => {
      state.loading = false;
    },
  },
});

export const {
  fetchFianacialTrackers,
  FianacialTrackersSuccess,
  FianacialTrackersFailure,
} = FianacialTrackerSlice.actions;

export default FianacialTrackerSlice.reducer;

export function fetchFianacialTrackersDataAPI(seesionId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchFianacialTrackers());

    await fetch(`/api/ft`, {
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
          dispatch(FianacialTrackersFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(FianacialTrackersSuccess(data));
      })
      .catch((error) => {
        dispatch(FianacialTrackersFailure(error));
      });
  };
}
