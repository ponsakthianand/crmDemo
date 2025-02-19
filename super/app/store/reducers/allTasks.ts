import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface TasksDataInfo {
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

interface TasksInfo {
  data: TasksDataInfo[];
  loading: boolean;
}

export const initialState: TasksInfo = {
  data: null as any,
  loading: false,
};

const TasksSpecificSlice = createSlice({
  name: 'Tasks Specific',
  initialState,
  reducers: {
    fetchTasks: (state) => {
      state.loading = true;
    },
    TasksSuccess: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    TasksFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchTasks, TasksSuccess, TasksFailure } =
  TasksSpecificSlice.actions;

export default TasksSpecificSlice.reducer;

export function fetchAllTasksDataAPI(seesionId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchTasks());

    await fetch(`/api/todos`, {
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
          dispatch(TasksFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(TasksSuccess(data));
      })
      .catch((error) => {
        dispatch(TasksFailure(error));
      });
  };
}
