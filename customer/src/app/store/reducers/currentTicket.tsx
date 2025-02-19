
import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface ticketData {
  _id: string
  title: string
  description: string
  Customer: string
  customer_name: string
  admin_name: string
  partner_name: string
  partner: string
  admin: string
  status: string
  created_at: string
  current_status: string
}

interface TicketInfo {
  data: ticketData;
  loading: boolean;
}

export const initialState: TicketInfo = {
  data: null as any,
  loading: false,
};

const CurrentTicketSlice = createSlice({
  name: 'Current Ticket Data',
  initialState,
  reducers: {
    fetchCurrentTicket: (state) => {
      state.loading = true;
    },
    currentTicketSuccess: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    currentTicketFailure: (state) => {
      state.loading = false;
    },
  },
});

export function fetchCurrentTicketDataAPI(ticketId: string, seesionId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCurrentTicket());

    await fetch(`${baseUrl}/tickets/${ticketId}`, {
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
          dispatch(currentTicketFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(currentTicketSuccess(data));
      })
      .catch((error) => {
        dispatch(currentTicketFailure(error));
      });
  };
}



export const { fetchCurrentTicket, currentTicketSuccess, currentTicketFailure } =
  CurrentTicketSlice.actions;

export default CurrentTicketSlice.reducer;