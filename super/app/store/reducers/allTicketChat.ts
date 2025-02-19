import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface ticketsData {
  _id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  admin_name: string;
  admin: string;
  Customer?: string;
  current_status?: string;
  customer_name?: string;
  close_description?: string;
  closed_by?: string;
  role?: string;
  partner?: string;
  partner_name?: string;
  last_message?: LastMessage;
  customer?: string;
  resoved_date?: string;
  resolved_date?: string;
  category: string;
  priority: string;
  ticketId: string;
  assign: Assign;
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
  message?: string;
  created_time?: string;
}

interface TicketChatsInfo {
  data: ticketsData[];
  loading: boolean;
}

export const initialState: TicketChatsInfo = {
  data: null as any,
  loading: false,
};

const TicketSlice = createSlice({
  name: 'All Ticket Chat Data',
  initialState,
  reducers: {
    fetchTickets: (state) => {
      state.loading = true;
    },
    ticketsSuccess: (state, { payload }) => {
      state.data = payload?.sort(function (a: any, b: any) {
        const dateA = Date.parse(a.created_at);
        const dateB = Date.parse(b.created_at);
        return dateB - dateA;
      });
      state.loading = false;
    },
    ticketsFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchTickets, ticketsSuccess, ticketsFailure } =
  TicketSlice.actions;

export default TicketSlice.reducer;

export function fetchTicketsDataAPI(seesionId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchTickets());

    await fetch(`${baseUrl}/tickets/`, {
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
          dispatch(ticketsFailure());
          // signOut();
        }
      })
      .then((data) => {
        dispatch(ticketsSuccess(data));
      })
      .catch((error) => {
        dispatch(ticketsFailure(error));
      });
  };
}
