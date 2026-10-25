/*
 * REDUX TOOLKIT (FEE topic: global state / intro to Redux Toolkit)
 * This store holds only the UI state of the task list: search text,
 * filters, sort order and the toast message. The tasks themselves stay in
 * FocusApp (saved to localStorage), so existing behaviour is unchanged.
 *   createSlice -> defines the state + the "reducers" that may change it
 *   dispatch(action) -> the only way components change this state
 */
import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchTerm: "",
  statusFilter: "All",
  categoryFilter: "All",
  sortBy: "newest",
  toastMessage: ""
};

const focusUiSlice = createSlice({
  name: "focusUi",
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
    setCategoryFilter(state, action) {
      state.categoryFilter = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    showToast(state, action) {
      state.toastMessage = action.payload;
    },
    clearToast(state) {
      state.toastMessage = "";
    }
  }
});

export const {
  setSearchTerm,
  setStatusFilter,
  setCategoryFilter,
  setSortBy,
  showToast,
  clearToast
} = focusUiSlice.actions;

export const focusUiStore = configureStore({
  reducer: {
    focusUi: focusUiSlice.reducer
  }
});
