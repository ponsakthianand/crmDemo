import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface Info {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  created_by_id: string;
  created_by: string;
  customer_id: string;
  customer_name: string;
  createdAt: string;
  updatedAt: string;
  isCompleted: boolean;
  completed_at: string;
  assigned_at: string;
  assigned_by_id: string;
  assigned_by_name: string;
  assignee_by_id: string;
  assignee_by_name: string;
  updated_at: string;
  updated_by: string;
  updated_by_id: string;
  assignHistory: AssignHistory[];
}

export interface AssignHistory {
  assigned_by_id: string;
  assigned_by_name: string;
  assigned_at: string;
  assignee_by_id: string;
  assignee_by_name: string;
}

interface TodosInfo {
  data: Info[];
  loading: boolean;
}

export const initialState: TodosInfo = {
  data: null as any,
  loading: false,
};

const TodosSpecificSlice = createSlice({
  name: 'Todos Specific',
  initialState,
  reducers: {
    fetchTodos: (state) => {
      state.loading = true;
    },
    TodosSuccess: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    TodosFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchTodos, TodosSuccess, TodosFailure } =
  TodosSpecificSlice.actions;

export default TodosSpecificSlice.reducer;

export function fetchTodosSpecificDataAPI(seesionId: string, cus_id: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchTodos());

    await fetch(`/api/customers/${cus_id}/todos`, {
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
          dispatch(TodosFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(TodosSuccess(data));
      })
      .catch((error) => {
        dispatch(TodosFailure(error));
      });
  };
}
