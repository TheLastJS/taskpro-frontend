import { createSlice } from '@reduxjs/toolkit';
import { registerThunk, loginThunk, logoutThunk } from './authOperations';

const initialState = {
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    }
  },
  extraReducers: (builder )=> {
    builder
    .addCase(registerThunk.fulfilled, (state, {payload}) =>{
      state.token = payload.token;
      state.isLoggedIn = true;
      state.isRefreshing = false;
      state.user = payload.user || null;
    })
    .addCase(loginThunk.fulfilled, (state, {payload}) =>{
      state.token = payload.token;
      state.isLoggedIn = true;
      state.isRefreshing = false;
      state.user = payload.user || null;
    })
    .addCase(logoutThunk.fulfilled, () => {
        return initialState;
      })
  }
});

export const { setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;