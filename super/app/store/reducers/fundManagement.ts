import { FundType } from '@/types/mutual-funds';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface FundManagementState {
  fundTypes: FundType[];
  currentFundType: FundType | null;
  loading: boolean;
  error: string | null;
}

const initialState: FundManagementState = {
  fundTypes: [],
  currentFundType: null,
  loading: false,
  error: null,
};

export const fetchFundTypesAPI = createAsyncThunk(
  'fundManagement/fetchFundTypes',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        '/api/mutualFunds/settings/fund-management',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            token: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch fund types');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // return rejectWithValue(error.message);
    }
  }
);

export const fetchFundTypeAPI = createAsyncThunk(
  'fundManagement/fetchFundType',
  async ({ token, id }: { token: string; id: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/mutualFunds/settings/fund-management/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            token: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch fund type');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // return rejectWithValue(error.message);
    }
  }
);

export const addFundTypeAPI = createAsyncThunk(
  'fundManagement/addFundType',
  async (
    { token, name, id }: { token: string; name: string; id?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        '/api/mutualFunds/settings/fund-management',
        {
          method: id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, id }),
        }
      );

      if (!response.ok) {
        throw new Error(
          id ? 'Failed to update fund type' : 'Failed to add fund type'
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // return rejectWithValue(error.message);
    }
  }
);

export const deleteFundTypeAPI = createAsyncThunk(
  'fundManagement/deleteFundType',
  async ({ token, id }: { token: string; id: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/mutualFunds/settings/fund-management/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            token: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete fund type');
      }

      return id;
    } catch (error) {
      // return rejectWithValue(error.message);
    }
  }
);

export const addFundNameAPI = createAsyncThunk(
  'fundManagement/addFundName',
  async (
    {
      token,
      fundTypeId,
      name,
    }: { token: string; fundTypeId: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `/api/mutualFunds/settings/fund-management/${fundTypeId}/fund-names`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add fund name');
      }

      const data = await response.json();
      return { fundTypeId, fundName: data };
    } catch (error) {
      // return rejectWithValue(error.message);
    }
  }
);

export const editFundNameAPI = createAsyncThunk(
  'fundManagement/editFundName',
  async (
    {
      token,
      fundTypeId,
      fundNameId,
      name,
    }: { token: string; fundTypeId: string; fundNameId: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `/api/mutualFunds/settings/fund-management/${fundTypeId}/fund-names/${fundNameId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            token: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to edit fund name');
      }

      const data = await response.json();
      return { fundTypeId, fundName: data };
    } catch (error) {
      // return rejectWithValue(error.message);
    }
  }
);

export const deleteFundNameAPI = createAsyncThunk(
  'fundManagement/deleteFundName',
  async (
    {
      token,
      fundTypeId,
      fundNameId,
    }: { token: string; fundTypeId: string; fundNameId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `/api/mutualFunds/settings/fund-management/${fundTypeId}/fund-names/${fundNameId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            token: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete fund name');
      }

      return { fundTypeId, fundNameId };
    } catch (error) {
      // return rejectWithValue(error.message);
    }
  }
);

const fundManagementSlice = createSlice({
  name: 'fundManagement',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFundTypesAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFundTypesAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.fundTypes = action.payload;
      })
      .addCase(fetchFundTypesAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFundTypeAPI.fulfilled, (state, action) => {
        state.currentFundType = action.payload;
      })
      .addCase(addFundTypeAPI.fulfilled, (state, action) => {
        if (action.payload.id) {
          const index = state.fundTypes.findIndex(
            (ft) => ft._id === action.payload.id
          );
          if (index !== -1) {
            state.fundTypes[index] = action.payload;
          }
        } else {
          state.fundTypes.push(action.payload);
        }
      })
      .addCase(deleteFundTypeAPI.fulfilled, (state, action) => {
        state.fundTypes = state.fundTypes.filter(
          (ft) => ft._id !== action.payload
        );
      })
      .addCase(addFundNameAPI.fulfilled, (state, action: any) => {
        const { fundTypeId, fundName } = action.payload;
        const fundType = state.fundTypes.find((ft) => ft._id === fundTypeId);
        if (fundType) {
          fundType.fundNames.push(fundName);
        }
        if (state.currentFundType && state.currentFundType._id === fundTypeId) {
          state.currentFundType.fundNames.push(fundName);
        }
      })
      .addCase(editFundNameAPI.fulfilled, (state, action: any) => {
        const { fundTypeId, fundName } = action.payload;
        const fundType = state.fundTypes.find((ft) => ft._id === fundTypeId);
        if (fundType) {
          const index = fundType.fundNames.findIndex(
            (fn) => fn._id === fundName._id
          );
          if (index !== -1) {
            fundType.fundNames[index] = fundName;
          }
        }
        if (state.currentFundType && state.currentFundType._id === fundTypeId) {
          const index = state.currentFundType.fundNames.findIndex(
            (fn) => fn._id === fundName._id
          );
          if (index !== -1) {
            state.currentFundType.fundNames[index] = fundName;
          }
        }
      })
      .addCase(deleteFundNameAPI.fulfilled, (state, action: any) => {
        const { fundTypeId, fundNameId } = action.payload;
        const fundType = state.fundTypes.find((ft) => ft._id === fundTypeId);
        if (fundType) {
          fundType.fundNames = fundType.fundNames.filter(
            (fn) => fn._id !== fundNameId
          );
        }
        if (state.currentFundType && state.currentFundType._id === fundTypeId) {
          state.currentFundType.fundNames =
            state.currentFundType.fundNames.filter(
              (fn) => fn._id !== fundNameId
            );
        }
      });
  },
});

export default fundManagementSlice.reducer;
