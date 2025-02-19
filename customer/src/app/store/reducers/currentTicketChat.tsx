
import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface ticketsData {
  _id: string
  ticket_id: string
  sender_id: string
  content: string
  receiver_id: any
  created_at: string
  sender_name: string
  receiver_name: any
  files: any[]
}

interface TicketChatsInfo {
  data: ticketsData[];
  loading: boolean;
}

export const initialState: TicketChatsInfo = {
  data: null as any,
  loading: false,
};

const CurrentTicketChatSlice = createSlice({
  name: 'Current Ticket Chat Data',
  initialState,
  reducers: {
    fetchCurrentTicketChat: (state) => {
      state.loading = true;
    },
    currentTicketChatSuccess: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    currentTicketChatFailure: (state) => {
      state.loading = false;
    },
  },
});

export function fetchCurrentTicketChatDataAPI(ticketId: string, seesionId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCurrentTicketChat());

    await fetch(`${baseUrl}/tickets/${ticketId}/messages`, {
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
          dispatch(currentTicketChatFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(currentTicketChatSuccess(data));
      })
      .catch((error) => {
        dispatch(currentTicketChatFailure(error));
      });
  };
}



export const { fetchCurrentTicketChat, currentTicketChatSuccess, currentTicketChatFailure } =
  CurrentTicketChatSlice.actions;

export default CurrentTicketChatSlice.reducer;