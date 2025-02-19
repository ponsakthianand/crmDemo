import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface ticketsData {
  _id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  Customer: string;
  customer_name: string;
  admin: string;
  admin_name: string;
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

    await fetch(`${baseUrl}/tickets/login/`, {
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
          signOut();
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
