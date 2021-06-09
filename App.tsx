/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  PermissionsAndroid,
  Platform,
  FlatList,
  Image,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import FastImage from 'react-native-fast-image';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [photos, setPhotos] = useState([]);
  const [endCursor, setEndCursor] = useState<string>();

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  async function gatPhotos(endCoursor?: string) {
    if (Platform.OS === 'android') {
      await hasAndroidPermission();
    }
    const photo = await CameraRoll.getPhotos({
      first: 30,
      assetType: 'All',
      after: endCoursor,
    });
    setPhotos(photos.concat(photo.edges));
    setEndCursor(photo.page_info.end_cursor);
    console.log(photo);
  }

  useEffect(() => {
    void gatPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const getItemLayout = useCallback(
    (data, index) => ({
      length: 130,
      offset: 130 * index,
      index,
    }),
    [],
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <FlatList
        columnWrapperStyle={{justifyContent: 'space-between'}}
        data={photos}
        numColumns={3}
        maxToRenderPerBatch={12}
        // getItemLayout={getItemLayout}
        windowSize={50}
        updateCellsBatchingPeriod={50}
        initialNumToRender={20}
        // removeClippedSubviews
        onEndReachedThreshold={10}
        onEndReached={() => gatPhotos(endCursor)}
        keyExtractor={item => item.node.image.uri}
        renderItem={photo => (
          <Image
            style={{
              height: 130,
              width: 130,
              marginVertical: 20,
            }}
            // resizeMode={FastImage.resizeMode.contain}
            source={{uri: photo.item.node.image.uri}}
          />
        )}
      />
      {/* <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
        contentContainerStyle={{
          flexDirection: 'column',
        }}>
        {photos?.edges.map(photo => (
          <Image
            style={{
              height: 100,
              width: 100,
              resizeMode: 'cover',
              marginVertical: 20,
            }}
            source={{uri: photo.node.image.uri}}
          />
        ))}
      </ScrollView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
