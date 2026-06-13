import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

const user = JSON.parse(localStorage.getItem('user') || 'null');
const token = localStorage.getItem('token');

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Registration failed'); }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Login failed'); }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout');
  } catch {}
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data.user;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: user || null, token: token || null, loading: false, error: null, isAuthenticated: !!token && !!user },
  reducers: {
    clearError: (state) => { state.error = null; },
    updateUser: (state, action) => { state.user = action.payload; localStorage.setItem('user', JSON.stringify(action.payload)); }
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; toast.error(action.payload); };
    builder
      .addCase(register.pending, pending).addCase(register.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.token = action.payload.token; state.isAuthenticated = true; toast.success('Registration successful!'); })
      .addCase(register.rejected, rejected)
      .addCase(login.pending, pending).addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.token = action.payload.token; state.isAuthenticated = true; toast.success(`Welcome back, ${action.payload.user.name.split(' ')[0]}!`); })
      .addCase(login.rejected, rejected)
      .addCase(logout.fulfilled, (state) => { state.user = null; state.token = null; state.isAuthenticated = false; })
      .addCase(getMe.fulfilled, (state, action) => { state.user = action.payload; state.isAuthenticated = true; })
      .addCase(getMe.rejected, (state) => { state.user = null; state.token = null; state.isAuthenticated = false; localStorage.clear(); });
  }
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
