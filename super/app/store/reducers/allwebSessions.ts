import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface WebsessionsData {
  _id: string;
  sessionId: string;
  ip: string;
  userAgent: string;
  location: Location;
  pages: Page[];
  referralId: string;
  timestamp: string;
  updated_at: string;
}

export interface Location {
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
  params: any;
}

interface WebsessionsInfo {
  data: WebsessionsData[];
  loading: boolean;
}

export const initialState: WebsessionsInfo = {
  data: null as any,
  loading: false,
};

const WebsessionsSlice = createSlice({
  name: 'All Websessions Data',
  initialState,
  reducers: {
    fetchWebsessions: (state) => {
      state.loading = true;
    },
    websessionsSuccess: (state, { payload }) => {
      state.data = payload?.sort(function (a: any, b: any) {
        const dateA = Date.parse(a.created_at);
        const dateB = Date.parse(b.created_at);
        return dateB - dateA;
      });
      state.loading = false;
    },
    websessionsFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchWebsessions, websessionsSuccess, websessionsFailure } =
  WebsessionsSlice.actions;

export default WebsessionsSlice.reducer;

export function fetchWebsessionsDataAPI(seesionId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchWebsessions());

    await fetch(`/api/websessions`, {
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
          dispatch(websessionsFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(websessionsSuccess(data));
      })
      .catch((error) => {
        dispatch(websessionsFailure(error));
      });
  };
}
