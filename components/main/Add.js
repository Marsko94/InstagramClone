import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { NavigationContainer } from '@react-navigation/native';

export default function Add({navigation}) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');

    })();
  }, []);

  const takePicture = async () => {
      if(camera){
          const data = await camera.takePictureAsync(null);
          console.log(data.uri)
          setImage(data.uri)
      }

  }

  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
    <View style={ styles.cameraContainer }>
        
      <Camera 
      ref={ref => setCamera(ref)}
      style={styles.fixedRatio}
     ratio={'1:1'}
      type={type} />
  
    </View>
      
      <Button
            style={{flex: 0.1,
            alignSelf: 'flex-end',
            alignItems: 'center',
            }}
            title= "flip image"
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={{ font: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
          </Button>
          <Button title="Take picture" onPress={() => takePicture()}/>
          <Button title="Pick Image from gallery" onPress={() => pickImage()}/>
          <Button title="Save" onPress={() => navigation.navigate('Save', {image})}/>
          {image && <Image source={{uri: image}} style={{flex: 1}}/>}
    </View>
  );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        flexDirection: 'row',

    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1,

    }
})