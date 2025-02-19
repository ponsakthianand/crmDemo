import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface StatisticsOverallInfo {
  totalTodos: number;
  openTodos: number;
  totalLeads: number;
  leadsWithoutCallSchedule: number;
  pendingLeads: number;
  convertedLeads: number;
  totalCustomers: number;
  totalPartners: number;
  clicks: number;
  ordersTotal: number;
  ordersPending: number;
  ordersPaid: number;
  chartData: ChartDaum[];
}

export interface ChartDaum {
  date: string;
  leads: number;
  customers: number;
}

interface StatisticsOverallDataInfo {
  data: StatisticsOverallInfo;
  loading: boolean;
}

export const initialState: StatisticsOverallDataInfo = {
  data: null as any,
  loading: false,
};

const StatisticsOverallSpecificSlice = createSlice({
  name: 'StatisticsOverall Specific',
  initialState,
  reducers: {
    fetchStatisticsOverall: (state) => {
      state.loading = true;
    },
    StatisticsOverallSuccess: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    StatisticsOverallFailure: (state) => {
      state.loading = false;
    },
  },
});

export const {
  fetchStatisticsOverall,
  StatisticsOverallSuccess,
  StatisticsOverallFailure,
} = StatisticsOverallSpecificSlice.actions;

export default StatisticsOverallSpecificSlice.reducer;

export function fetchAllStatisticsOverallDataAPI(
  seesionId: string,
  body?: { startDate: any; endDate: any }
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchStatisticsOverall());

    await fetch(`/api/statistics/overall`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${seesionId}`,
      },
      body: JSON.stringify({
        startDate: body ? body?.startDate : '',
        endDate: body ? body?.endDate : '',
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          dispatch(StatisticsOverallFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(StatisticsOverallSuccess(data));
      })
      .catch((error) => {
        dispatch(StatisticsOverallFailure(error));
      });
  };
}
