import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from '../../../services/axios';
import history from '../../../services/history';
import { get } from 'lodash';

export const loginRequest = createAsyncThunk('auth/loginRequest',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post('/tokens', payload);
      toast.success('Login feito com Sucesso');
      
      axios.defaults.headers.Authorization = `Bearer ${response.data.token}`;
      
      history.push(payload.prevPath);
      
      return response.data;
    } catch (e) {
      toast.error('Usuario ou senha invalidos');
      return rejectWithValue('Login falhou');
    }
  }
);

export const handlePersistRehydrate = createAsyncThunk( 'auth/handlePersistRehydrate',
  async (payload) => {
    const token = get(payload, 'auth.token', '');
    if (!token) return null;
    
    axios.defaults.headers.Authorization = `Bearer ${token}`;
    return token;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    token: false,
    user: {},
    isLoading: false,
  },
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.token = false;
      state.user = {};
      delete axios.defaults.headers.Authorization;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginRequest.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isLoading = false;
      })
      .addCase(loginRequest.rejected, (state) => {
        state.isLoggedIn = false;
        state.token = false;
        state.user = {};
        state.isLoading = false;
      })
      .addCase(handlePersistRehydrate.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload;
        }
      })
      .addMatcher(
        action => action.type === 'persist/REHYDRATE',
        (state, action) => {
          if (action.payload && action.payload.auth) {
            state.isLoggedIn = action.payload.auth.isLoggedIn;
            state.token = action.payload.auth.token;
            state.user = action.payload.auth.user;
          }
        }
      );
  },
});
export const { logout } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
