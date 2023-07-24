import { Fragment, useEffect, useState } from "react";
import { View, FlatList, Pressable, Alert, SectionList, ScrollView } from "react-native";
import { Stack, useSearchParams } from "expo-router";
import {Button, List, Text} from 'react-native-paper'
import { useGetReleasesQuery, useLazyGetReleaseDetailsQuery, ReleaseResponseFiltered } from "../slices/apps";
import { useAppSelector } from '../hooks/redux'
import installBuild from '../installBuild'

const ReleaseDetails = ({item, appName}) => {
  const [showDetails, setShowDetails] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [extraDetails, setExtraDetails] = useState(null)
  const orgName = useAppSelector(state => state.auth.orgName)
  const [trigger, result] = useLazyGetReleaseDetailsQuery()

  const handlePressInstall = async () => {
    const {data} = await trigger({ orgName, appName, releaseId: item.id })
    setExtraDetails(data)
    await installBuild(result.data, setDownloadProgress)
    //Alert.alert('release details', JSON.stringify({result}))
  }

  useEffect(() => {
    (async () => {
      if (showDetails) {
        const {data} = await trigger({ orgName, appName, releaseId: item.id })
        setExtraDetails(data)
      }
    })()
  }, [showDetails])

  return (
    <View style={{marginTop: 20, width: 300}}>
      <View>
        <Pressable onPress={() => setShowDetails(!showDetails)} style={{flexDirection: 'row'}}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>{item.version}</Text>
          <Text style={{fontWeight: 'bold', fontSize: 18, marginLeft: 15, alignSelf: 'center', justifyContent: 'center'}}>{showDetails ? '-' : '+'}</Text>
        </Pressable>
        <Text>Uploaded at: {item.uploaded_at}</Text>
      </View>
      <Button style={{marginTop: 10}} mode="contained" onPress={handlePressInstall}>{downloadProgress === 0 ? `Install ${item.version}` : downloadProgress}</Button>
        {showDetails && extraDetails ? (
          <Text>Release notes: {extraDetails.release_notes}</Text>
        )
          : null
        }
    </View>
  )
}

export default function Details() {
  const params = useSearchParams();
  const orgName = useAppSelector(state => state.auth.orgName)
  const appName = params.name
  const {data} = useGetReleasesQuery({ orgName, appName })

  return (
    <ScrollView style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }} contentContainerStyle={{alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        options={{
          title: appName,
          headerTitle: () => <Text style={{fontWeight: 'bold'}}>{params.display_name}</Text>
        }}
      />
      {data && Object.keys(data || {}).length ? Object.keys(data).map(shortVersion => (
        <Fragment key={shortVersion}>
          <View style={{width: '100%', flex: 1, marginTop: 20}}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>{shortVersion}</Text>
          </View>
          {data[shortVersion].map((release: ReleaseResponseFiltered) => (
            <ReleaseDetails key={release.version} appName={appName} item={release} />
          ))}
        </Fragment>
      )) : (
        <>
            <Text>Data loading...</Text>
        </>
      )}
    </ScrollView>
  );
}
