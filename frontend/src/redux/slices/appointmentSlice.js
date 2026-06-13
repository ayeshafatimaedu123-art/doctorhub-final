import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const fetchAppointments = createAsyncThunk('appointments/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/appointments', { params });
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchTodayAppointments = createAsyncThunk('appointments/today', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/appointments/today');
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createAppointment = createAsyncThunk('appointments/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/appointments', data);
    toast.success('Appointment booked! Please upload payment.');
    return res.data.data;
  } catch (err) { toast.error(err.response?.data?.message); return rejectWithValue(err.response?.data?.message); }
});

export const updateAppointment = createAsyncThunk('appointments/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/appointments/${id}`, data);
    toast.success('Appointment updated!');
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: { list: [], today: [], selected: null, loading: false, error: null, total: 0 },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => { state.loading = true; })
      .addCase(fetchAppointments.fulfilled, (state, action) => { state.loading = false; state.list = action.payload.data; state.total = action.payload.total; })
      .addCase(fetchAppointments.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchTodayAppointments.fulfilled, (state, action) => { state.today = action.payload; })
      .addCase(createAppointment.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        const idx = state.list.findIndex(a => a._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      });
  }
});

export default appointmentSlice.reducer;
