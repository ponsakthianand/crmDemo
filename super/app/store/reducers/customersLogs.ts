import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface CustomerLogsData {
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

export interface CustomerLogsInfo {
  data: CustomerLogsData[];
  loading: boolean;
}

export const initialState: CustomerLogsInfo = {
  data: null as any,
  loading: false,
};

const CustomerLogsSlice = createSlice({
  name: 'All CustomerLogs Chat Data',
  initialState,
  reducers: {
    fetchCustomerLogs: (state) => {
      state.loading = true;
    },
    CustomerLogsSuccess: (state, { payload }) => {
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
    CustomerLogsFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchCustomerLogs, CustomerLogsSuccess, CustomerLogsFailure } =
  CustomerLogsSlice.actions;

export default CustomerLogsSlice.reducer;

export function fetchCustomerLogsDataAPI(seesionId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCustomerLogs());

    await fetch(`/api/activity-logs/customers`, {
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
          dispatch(CustomerLogsFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(CustomerLogsSuccess(data));
      })
      .catch((error) => {
        dispatch(CustomerLogsFailure(error));
      });
  };
}
