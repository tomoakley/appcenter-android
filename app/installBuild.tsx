import { Alert, NativeModules } from "react-native";
import * as FileSystem from 'expo-file-system'

const {ApkInstaller} = NativeModules

const callback = (downloadProgress, setDownloadProgressState) => {
  const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
  setDownloadProgressState(progress)
};

const downloadApk = async (url, fileUri, setDownloadProgressState) => {
  try {
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      fileUri,
      {},
      (downloadProgress) => callback(downloadProgress, setDownloadProgressState)
    )
    const { uri } = await downloadResumable.downloadAsync();
    return uri
  } catch (err) {
    console.error(err)
  }
}

const getApkFileInfoIfExists = async (fileUri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri)
    return fileInfo
  } catch (error) {
    console.error(error)
    return null
  }
}

const installBuild = async (release, setDownloadProgressState) => {
  const fileUri = FileSystem.documentDirectory + release.version + '.apk'
  //const fileInfo = await getApkFileInfoIfExists(fileUri)
  const uri = await downloadApk(release.download_url, fileUri, setDownloadProgressState)
  try {
    //Alert.alert('uri', uri)
    //FileSystem.getContentUriAsync(uri).then(cUri => {
      ApkInstaller.install(uri, 'com.totallymoney.account', `${release.version}.apk`).then((status) => {
        //Alert.alert('package installed', JSON.stringify(status))
      })
    //});
  } catch (e) {
    console.error(e);
  }
}

export default installBuild
