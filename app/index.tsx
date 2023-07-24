import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, TextInput } from "react-native";
import { Button } from 'react-native-paper'

import { useAppDispatch, useAppSelector } from './hooks/redux'
import { useGetAppsQuery } from "./slices/apps";
import { getTokenAsync, setTokenAsync } from "./slices/auth";


const AuthenticationBlock = () => {
  const [token, setToken] = useState('')
  const [orgName, setOrgName] = useState('')
  const dispatch = useAppDispatch()

  const handleSetToken = async () => {
    await dispatch(setTokenAsync({ apiToken: token, orgName }))
  }

  return (
    <>
      <Text>Please enter your AppCenter API key:</Text>
      <TextInput secureTextEntry={true} placeholder="aaabbbccc" onChange={(event) => setToken(event.nativeEvent.text)} />
      <Text>Please enter your AppCenter organisation name:</Text>
      <TextInput placeholder="aaabbbccc" onChange={(event) => setOrgName(event.nativeEvent.text)} />
      <Button style={{marginTop: 10}} mode="contained" onPress={handleSetToken}>
        <Text>Submit</Text>
      </Button>
    </>
  )
}

const AppsList = ({ orgName }: { orgName: string }): JSX.Element => {
  const { data, isError, error } = useGetAppsQuery(orgName)
  console.log('AppsList data', data, error)

  return (
    <>
      {data?.map(app => (
          <Link href={{ pathname: `/appDetails/${app.display_name}`, params: { ...app } }} style={{marginTop: 15, fontSize: 20, fontWeight: 'bold'}}>
            {app.display_name}
          </Link>
      ))}
    </>
  )
}

export default function Home() {
  const dispatch = useAppDispatch()
  const apiToken = useAppSelector(state => state.auth.apiToken)
  const orgName = useAppSelector(state => state.auth.orgName)

  useEffect(() => {
    const getApiKeyToken = async () => {
      if (!apiToken) {
        await dispatch(getTokenAsync())
      }
    }
    getApiKeyToken()
  }, [])

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        options={{
          title: "Apps",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitle: (props) => <Text style={{fontWeight: 'bold'}}>Apps</Text>
        }}
      />

      {apiToken == null
        ? <AuthenticationBlock />
        : <AppsList orgName={orgName} />
      }

    </View>
  );
}
