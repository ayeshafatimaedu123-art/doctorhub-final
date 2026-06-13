import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const fetchPayments = createAsyncThunk('payments/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/payments', { params });
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const uploadPayment = createAsyncThunk('payments/upload', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/payments', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    toast.success('Payment uploaded! Awaiting verification.');
    return res.data.data;
  } catch (err) { toast.error(err.response?.data?.message); return rejectWithValue(err.response?.data?.message); }
});

export const verifyPayment = createAsyncThunk('payments/verify', async ({ id, action, rejectionReason }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/payments/${id}/verify`, { action, rejectionReason });
    toast.success(`Payment ${action === 'verify' ? 'verified' : 'rejected'}!`);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const paymentSlice = createSlice({
  name: 'payments',
  initialState: { list: [], loading: false, error: null, total: 0 },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => { state.loading = true; })
      .addCase(fetchPayments.fulfilled, (state, action) => { state.loading = false; state.list = action.payload.data; state.total = action.payload.total; })
      .addCase(fetchPayments.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        const idx = state.list.findIndex(p => p._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      });
  }
});

export default paymentSlice.reducer;
