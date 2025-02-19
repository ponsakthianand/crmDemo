import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface PartnerLogsData {
  _id: string;
  id: string;
  email: string;
  name: string;
  role: string;
  permission: string;
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

export interface PartnerLogsInfo {
  data: PartnerLogsData[];
  loading: boolean;
}

export const initialState: PartnerLogsInfo = {
  data: null as any,
  loading: false,
};

const PartnerLogsSlice = createSlice({
  name: 'All PartnerLogs Chat Data',
  initialState,
  reducers: {
    fetchPartnerLogs: (state) => {
      state.loading = true;
    },
    PartnerLogsSuccess: (state, { payload }) => {
      const sortData = payload?.sort(function (a: any, b: any) {
        const dateA = Date.parse(a.created_at);
        const dateB = Date.parse(b.created_at);
        return dateB - dateA;
      });
      state.data = sortData?.map((item: any) => {
        return {
          ...item,
          id: item?._id,
        };
      });
      state.loading = false;
    },
    PartnerLogsFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchPartnerLogs, PartnerLogsSuccess, PartnerLogsFailure } =
  PartnerLogsSlice.actions;

export default PartnerLogsSlice.reducer;

export function fetchPartnerLogsDataAPI(seesionId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchPartnerLogs());

    await fetch(`/api/activity-logs/partners`, {
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
          dispatch(PartnerLogsFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(PartnerLogsSuccess(data));
      })
      .catch((error) => {
        dispatch(PartnerLogsFailure(error));
      });
  };
}
