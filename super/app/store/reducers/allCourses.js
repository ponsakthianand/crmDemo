import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const fetchAllCourses = createAsyncThunk("courses/fetchAll", async (token) => {
  const response = await fetch("/api/courses", {
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

const fetchSingleCourse = createAsyncThunk(
  "courses/fetchSingle",
  async ({ token, courseId }) => {
    const response = await fetch(`/api/courses/${courseId}`, {
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

const createCourses = createAsyncThunk(
  "courses/create",
  async ({ token, param }) => {
    const response = await fetch("/api/courses", {
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
const updateCourse = createAsyncThunk(
  "courses/update",
  async ({ token, param, id }) => {
    const response = await fetch(`/api/courses/${id}`, {
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
const deleteCourse = createAsyncThunk(
  "courses/delete",
  async ({ token, id }) => {
    const response = await fetch(`/api/courses/${id}`, {
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
  }
);

const allCourseSelectors = {
  getCourseList: (state) => state.courses.getAllcourses,
  getSinglecourse: (state) => state.courses.getSinglecourse,
  getDeletecourse: (state) => state.courses.deleteCourse,
};

const initialState = {
  getAllcourses: {
    loading: false,
    error: undefined,
    data: [],
  },
  getSinglecourse: {
    loading: false,
    error: undefined,
    data: {},
  },
  deleteCourse: {
    isOpen: false,
    data: "",
    id: "",
  },
};

const allCourseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearcourse: (state) => {
      state.getSinglecourse.data = {};
    },
    deleteCourse: (state, action) => {
      const { open, data, id } = action.payload;
      state.deleteCourse.data = data;
      state.deleteCourse.isOpen = open;
      state.deleteCourse.id = id;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCourses.pending, (state) => {
        state.getAllcourses.loading = true;
        state.getAllcourses.error = undefined;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.getAllcourses.loading = false;
        state.getAllcourses.data = action.payload;
        state.getAllcourses.error = undefined;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.getAllcourses.loading = false;
        state.getAllcourses.error = action.error.message;
      })
      .addCase(fetchSingleCourse.pending, (state) => {
        state.getSinglecourse.loading = true;
        state.getSinglecourse.error = undefined;
      })
      .addCase(fetchSingleCourse.fulfilled, (state, action) => {
        state.getSinglecourse.loading = false;
        state.getSinglecourse.data = action.payload;
        state.getSinglecourse.error = undefined;
      })
      .addCase(fetchSingleCourse.rejected, (state, action) => {
        state.getSinglecourse.loading = false;
        state.getSinglecourse.error = action.error.message;
      });
  },
});

const allCourseAction = allCourseSlice.actions;

export {
  allCourseAction,
  allCourseSelectors,
  fetchAllCourses,
  createCourses,
  fetchSingleCourse,
  updateCourse,
  deleteCourse,
};

export default allCourseSlice.reducer;
