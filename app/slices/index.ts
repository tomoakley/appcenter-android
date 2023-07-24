import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthSlice } from './auth'

export interface State {
  auth: AuthSlice
}

export const appcenterApi = createApi({
  reducerPath: 'appcenterApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.appcenter.ms/v0.1/',
    prepareHeaders: (headers, { getState }) => {
      const { auth } = getState() as State
      console.log(auth)
      return new Headers({
        ...headers,
        'X-API-Token': auth.apiToken
      })
    }
  }),
  endpoints: (_) => ({})
})
