import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const fetchDoctors = createAsyncThunk('doctors/fetchAll', async (params, { rejectWithValue }) => {
  try {
    console.log('[fetchDoctors] params:', params);
    const res = await api.get('/doctors', { params });
    console.log('[fetchDoctors] response:', res?.data);
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchDoctor = createAsyncThunk('doctors/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/doctors/${id}`);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createDoctor = createAsyncThunk('doctors/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/doctors', data);
    toast.success('Doctor profile created!');
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateDoctor = createAsyncThunk('doctors/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/doctors/${id}`, data);
    toast.success('Profile updated!');
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchMyDoctorProfile = createAsyncThunk('doctors/myProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/doctors/my-profile');
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const doctorSlice = createSlice({
  name: 'doctors',
  initialState: { list: [], selected: null, myProfile: null, loading: false, error: null, total: 0, pages: 1 },
  reducers: { clearSelected: (state) => { state.selected = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => { state.loading = true; })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data ?? [];
        state.total = action.payload?.total ?? 0;
        state.pages = action.payload?.pages ?? 1;
      })
      .addCase(fetchDoctors.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchDoctor.fulfilled, (state, action) => { state.selected = action.payload; })
      .addCase(createDoctor.fulfilled, (state, action) => { state.myProfile = action.payload; })
      .addCase(updateDoctor.fulfilled, (state, action) => { state.myProfile = action.payload; })
      .addCase(fetchMyDoctorProfile.fulfilled, (state, action) => { state.myProfile = action.payload; });
  }
});

export const { clearSelected } = doctorSlice.actions;
export default doctorSlice.reducer;
