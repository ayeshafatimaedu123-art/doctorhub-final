import { createSlice } from '@reduxjs/toolkit';

const darkMode = localStorage.getItem('darkMode') === 'true';
if (darkMode) document.documentElement.classList.add('dark');

const uiSlice = createSlice({
  name: 'ui',
  initialState: { darkMode, sidebarOpen: true, sidebarCollapsed: false },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
      document.documentElement.classList.toggle('dark', state.darkMode);
    },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    toggleSidebarCollapse: (state) => { state.sidebarCollapsed = !state.sidebarCollapsed; },
    setSidebarOpen: (state, action) => { state.sidebarOpen = action.payload; }
  }
});

export const { toggleDarkMode, toggleSidebar, toggleSidebarCollapse, setSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;
