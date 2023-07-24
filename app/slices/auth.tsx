import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import * as SecureStore from 'expo-secure-store'
import { Alert } from "react-native"
import {State} from './index'

export interface AuthSlice {
  apiToken: string
  orgName: string
  status: 'idle' | 'loading' | 'failed'
}

const initialState: AuthSlice = {
  apiToken: null,
  orgName: null,
  status: 'idle'
}

const SECURE_STORE_API_TOKEN_KEY = 'apiKey'

export const getTokenAsync = createAsyncThunk<
  { apiToken: string | null, orgName: string | null },
  void,
  {}
>(
  'auth/getToken',
  async () => {
    const secureStoreTokenAndOrgName = await SecureStore.getItemAsync(SECURE_STORE_API_TOKEN_KEY)
    if (secureStoreTokenAndOrgName) {
      return JSON.parse(secureStoreTokenAndOrgName)
    } else {
      return null
    }
  }
)

type SetTokenAsyncThunkConfig = {
  rejectValue: Error
  state: State
}

type SetTokenThunkArgs = {
  apiToken: string
  orgName: string
}

export const setTokenAsync = createAsyncThunk<
  { apiToken: string, orgName: string },
  SetTokenThunkArgs,
  SetTokenAsyncThunkConfig
>(
  'auth/getToken',
  async (tokenAndOrgName) => {
    await SecureStore.setItemAsync(SECURE_STORE_API_TOKEN_KEY, JSON.stringify(tokenAndOrgName))
    return tokenAndOrgName
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTokenAsync.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getTokenAsync.fulfilled, (state, action) => {
        state.status = 'idle'
        state.apiToken = action.payload.apiToken!
        state.orgName = action.payload.orgName!
      })
      /* .addCase(setTokenAsync.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(setTokenAsync.fulfilled, (state, action) => {
        state.status = 'idle'
        state.apiToken = action.payload.apiToken
      }) */
  }
})

export default authSlice.reducer
