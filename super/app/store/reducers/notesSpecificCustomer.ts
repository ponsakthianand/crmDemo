import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface Info {
  _id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by_id: string;
  created_by: string;
  customer_id: string;
  customer_name: string;
  versions: Version[];
  updated_by: string;
  updated_by_id: string;
}

export interface Version {
  title: string;
  content: string;
  updated_at: string;
  created_by_id: string;
  created_by: string;
}

interface NotesInfo {
  data: Info[];
  loading: boolean;
}

export const initialState: NotesInfo = {
  data: null as any,
  loading: false,
};

const NotesSpecificSlice = createSlice({
  name: 'Notes Specific',
  initialState,
  reducers: {
    fetchNotes: (state) => {
      state.loading = true;
    },
    NotesSuccess: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    NotesFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchNotes, NotesSuccess, NotesFailure } =
  NotesSpecificSlice.actions;

export default NotesSpecificSlice.reducer;

export function fetchNotesSpecificDataAPI(seesionId: string, cus_id: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchNotes());

    await fetch(`/api/customers/${cus_id}/notes`, {
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
          dispatch(NotesFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(NotesSuccess(data));
      })
      .catch((error) => {
        dispatch(NotesFailure(error));
      });
  };
}
