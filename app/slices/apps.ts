import {Alert, Platform} from 'react-native'
import {appcenterApi} from './index'

const appsApiWithTags = appcenterApi.enhanceEndpoints({
  addTagTypes: ['Apps']
})

type AppResponse = {
  id: string
  app_secret: string
  description: string
  display_name: string
  name: string
  os: string
  platform: string
  origin: string
  icon_url: string
  created_at: string
  updated_at: string
  release_type: string
  owner: Record<string, string>
  azure_subscription: string
  member_permissions: string[]
}

type ReleaseResponse = {
  origin: string,
  id: number,
  short_version: string
  version: string
  uploaded_at: string
  enabled: boolean
  is_external_build: boolean
  file_extension: string
  destinations: any
  distribution_groups: any
}

export type ReleaseResponseFiltered = Pick<ReleaseResponse, 'id' | 'uploaded_at' | 'version'>

type AppResponseFiltered = Pick<AppResponse, 'id' | 'display_name' | 'name' | 'os' /*| 'icon_url'*/ | 'created_at' | 'updated_at'>

const transformGetAppsResponse = (response: AppResponse[]): AppResponseFiltered[] => {
  const os = Platform.OS
  console.log('transform response', response)
  const filterByOS = response.filter(app => app.os.toLowerCase() === os)
  return filterByOS.map(app => ({
    id: app.id,
    display_name: app.display_name,
    name: app.name,
    os: app.os,
    updated_at: app.updated_at,
    created_at: app.created_at
  }))
}

const transformGetReleasesResponse = (response: ReleaseResponse[]): Record<string, ReleaseResponseFiltered[]> => {
  const releasesByShortVersion: Record<string, ReleaseResponseFiltered[]> = {}
  try {
    response.forEach(release => {
      const newVersion = {
        id: release.id,
        uploaded_at: release.uploaded_at,
        version: release.version
      }
      if (releasesByShortVersion.hasOwnProperty(release.short_version)) {
        releasesByShortVersion[release.short_version] = [
          ...releasesByShortVersion[release.short_version],
          newVersion
        ]
      } else {
        releasesByShortVersion[release.short_version] = [newVersion]
      }
    })
  } catch (error) {
    console.error('error', JSON.stringify(error))
  }
  return releasesByShortVersion
}

export const appsApi = appsApiWithTags.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getApps: builder.query<AppResponseFiltered[], string>({
      query: (orgName) => `/orgs/${orgName}/apps`,
      transformResponse: transformGetAppsResponse,
    }),
    getReleases: builder.query<Record<string, any>, {orgName: string, appName: string, releaseId: number}>({
      query: ({orgName, appName, releaseId}) => `/apps/${orgName}/${appName}/releases`,
      transformResponse: transformGetReleasesResponse
    }),
    getReleaseDetails: builder.query<Record<string, any>, {orgName: string, appName: string, releaseId: number}>({
      query: ({orgName, appName, releaseId}) => `/apps/${orgName}/${appName}/releases/${releaseId}`
    }),
  })
})

export const {
  useGetAppsQuery,
  useGetReleasesQuery,
  useLazyGetReleaseDetailsQuery
} = appsApi
