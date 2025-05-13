import { createSlice } from '@reduxjs/toolkit';
import { registerThunk, loginThunk, logoutThunk } from './authOperations';

const initialState = {
  token: null,
  isLoggedIn: false,
  isRefreshing: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: (builder )=> {
    builder
    .addCase(registerThunk.fulfilled, (state, {payload}) =>{
      state.token = payload.payload.token;
      state.isLoggedIn = true;
      state.isRefreshing = false;
    })
    .addCase(loginThunk.fulfilled, (state, {payload}) =>{
      state.token = payload.payload.token;
      state.isLoggedIn = true;
      state.isRefreshing = false;
    })
    .addCase(logoutThunk.fulfilled, () => {
        return initialState;
      })

}
});

export const authReducer = authSlice.reducer;