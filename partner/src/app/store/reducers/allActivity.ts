import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface ActivityData {
  _id: string;
  id: string;
  email: string;
  name: string;
  role: string;
  login_time: string;
  userInfo: UserInfo;
}

export interface UserInfo {
  cpu: Cpu;
  osInfo: OsInfo;
  system: System;
  networkGatewayDefault: string;
}

export interface Cpu {
  manufacturer: string;
  brand: string;
  vendor: string;
  family: string;
  model: string;
  stepping: string;
  revision: string;
  voltage: string;
  speed: number;
  speedMin: number;
  speedMax: number;
  governor: string;
  cores: number;
  physicalCores: number;
  performanceCores: number;
  efficiencyCores: number;
  processors: number;
  socket: string;
  flags: string;
  virtualization: boolean;
  cache: Cache;
}

export interface Cache {
  l1d: number;
  l1i: number;
  l2: number;
  l3: number;
}

export interface OsInfo {
  platform: string;
  release: string;
}

export interface System {
  model: string;
  manufacturer: string;
}

interface ActivityInfo {
  data: ActivityData[];
  loading: boolean;
}

export const initialState: ActivityInfo = {
  data: null as any,
  loading: false,
};

const ActivitySlice = createSlice({
  name: 'All Activity Chat Data',
  initialState,
  reducers: {
    fetchActivity: (state) => {
      state.loading = true;
    },
    ActivitySuccess: (state, { payload }) => {
      state.data = payload?.sort(function (a: any, b: any) {
        const dateA = Date.parse(a.created_at);
        const dateB = Date.parse(b.created_at);
        return dateB - dateA;
      });
      state.loading = false;
    },
    ActivityFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchActivity, ActivitySuccess, ActivityFailure } =
  ActivitySlice.actions;

export default ActivitySlice.reducer;

export function fetchActivityDataAPI(seesionId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchActivity());

    await fetch(`/api/activity`, {
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
          dispatch(ActivityFailure());
          // signOut();
        }
      })
      .then((data) => {
        dispatch(ActivitySuccess(data));
      })
      .catch((error) => {
        dispatch(ActivityFailure(error));
      });
  };
}
