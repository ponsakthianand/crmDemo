import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface ClicksData {
  _id: string;
  sessionId: string;
  ip: string;
  userAgent: string;
  location: Location;
  pages: Page[];
  referralId: string;
  timestamp: string;
}

export interface Location {
  status?: string;
  data: Data;
}

export interface Data {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

export interface Page {
  url: string;
  domain: string;
  visitTime: string;
  duration: number;
  params: Params;
}

export interface Params {
  rxt: string;
}

interface ClicksInfo {
  data: ClicksData[];
  loading: boolean;
}

export const initialState: ClicksInfo = {
  data: null as any,
  loading: false,
};

const ClicksSlice = createSlice({
  name: 'All Clicks Data',
  initialState,
  reducers: {
    fetchClicks: (state) => {
      state.loading = true;
    },
    clicksSuccess: (state, { payload }) => {
      state.data = payload?.sort(function (a: any, b: any) {
        const dateA = Date.parse(a.created_at);
        const dateB = Date.parse(b.created_at);
        return dateB - dateA;
      });
      state.loading = false;
    },
    clicksFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchClicks, clicksSuccess, clicksFailure } =
  ClicksSlice.actions;

export default ClicksSlice.reducer;

export function fetchClicksDataAPI(
  seesionId: string,
  body?: { startDate: any; endDate: any }
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchClicks());

    await fetch(`/api/clicks`, {
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
          dispatch(clicksFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(clicksSuccess(data));
      })
      .catch((error) => {
        dispatch(clicksFailure(error));
      });
  };
}
