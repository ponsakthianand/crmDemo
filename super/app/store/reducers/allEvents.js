import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const fetchAllEvents = createAsyncThunk("events/fetchAll", async (token) => {
  const response = await fetch("/api/events", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
});

const fetchSingleEvent = createAsyncThunk(
  "events/fetchSingle",
  async ({ token, eventId }) => {
    const response = await fetch(`/api/events/${eventId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  }
);

const createEvents = createAsyncThunk(
  "events/create",
  async ({ token, param }) => {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...param, title: param?.title || "untitled" }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  }
);
const updateEvent = createAsyncThunk(
  "events/update",
  async ({ token, param, id }) => {
    const response = await fetch(`/api/events/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...param, title: param?.title || "untitled" }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  }
);
const deleteEvent = createAsyncThunk("events/delete", async ({ token, id }) => {
  const response = await fetch(`/api/events/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
});

const allEventSelectors = {
  getEventList: (state) => state.events.getAllEvents,
  getSingleEvent: (state) => state.events.getSingleEvent,
  getDeleteEvent: (state) => state.events.deleteEvent,
};

const initialState = {
  getAllEvents: {
    loading: false,
    error: undefined,
    data: [],
  },
  getSingleEvent: {
    loading: false,
    error: undefined,
    data: {},
  },
  deleteEvent: {
    isOpen: false,
    data: "",
    id: "",
  },
};

const allEventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearEvent: (state) => {
      state.getSingleEvent.data = {};
    },
    deleteEvent: (state, action) => {
      const { open, data, id } = action.payload;
      state.deleteEvent.data = data;
      state.deleteEvent.isOpen = open;
      state.deleteEvent.id = id;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEvents.pending, (state) => {
        state.getAllEvents.loading = true;
        state.getAllEvents.error = undefined;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.getAllEvents.loading = false;
        state.getAllEvents.data = action.payload;
        state.getAllEvents.error = undefined;
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.getAllEvents.loading = false;
        state.getAllEvents.error = action.error.message;
      })
      .addCase(fetchSingleEvent.pending, (state) => {
        state.getSingleEvent.loading = true;
        state.getSingleEvent.error = undefined;
      })
      .addCase(fetchSingleEvent.fulfilled, (state, action) => {
        state.getSingleEvent.loading = false;
        state.getSingleEvent.data = action.payload;
        state.getSingleEvent.error = undefined;
      })
      .addCase(fetchSingleEvent.rejected, (state, action) => {
        state.getSingleEvent.loading = false;
        state.getSingleEvent.error = action.error.message;
      });
  },
});

const allEventAction = allEventSlice.actions;

export {
  allEventAction,
  allEventSelectors,
  fetchAllEvents,
  createEvents,
  fetchSingleEvent,
  updateEvent,
  deleteEvent,
};

export default allEventSlice.reducer;
