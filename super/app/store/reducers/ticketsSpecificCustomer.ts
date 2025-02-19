import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface Info {
  _id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  category: string;
  priority: string;
  ticketId: string;
  customer: string;
  customer_name: string;
  partner: string;
  partner_name: string;
  assign: Assign;
  admin: string;
  admin_name: string;
  notification_id: string;
  current_status: string;
  last_message: LastMessage;
}

export interface Assign {
  role: string;
  id: string;
  username: string;
}

export interface LastMessage {
  role: string;
  name: string;
  id: string;
  message: string;
  created_time: string;
}

interface TicketsInfo {
  data: Info[];
  loading: boolean;
}

export const initialState: TicketsInfo = {
  data: null as any,
  loading: false,
};

const TicketsSpecificSlice = createSlice({
  name: 'Tickets Specific',
  initialState,
  reducers: {
    fetchTickets: (state) => {
      state.loading = true;
    },
    TicketsSuccess: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    TicketsFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchTickets, TicketsSuccess, TicketsFailure } =
  TicketsSpecificSlice.actions;

export default TicketsSpecificSlice.reducer;

export function fetchTicketsSpecificDataAPI(seesionId: string, cus_id: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchTickets());

    await fetch(`/api/customers/${cus_id}/tickets`, {
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
          dispatch(TicketsFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(TicketsSuccess(data));
      })
      .catch((error) => {
        dispatch(TicketsFailure(error));
      });
  };
}
