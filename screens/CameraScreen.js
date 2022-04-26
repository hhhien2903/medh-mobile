import React, { useState, useEffect, useRef } from 'react';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View, TouchableOpacity, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import doctorAPI from '../api/doctorAPI';
import { useNavigation } from '@react-navigation/native';
import sharedStore from '../store/sharedStore';
import { manipulateAsync } from 'expo-image-manipulator';
const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const currentUser = sharedStore((state) => state.currentUser);
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        let photo = await cameraRef.current.takePictureAsync({ quality: 0 });

        const manipResult = await manipulateAsync(photo.uri, [
          // { resize: { width: 500, height: 500 } },
        ]);
        const uploadAvatarForm = new FormData();

        uploadAvatarForm.append('file', {
          uri: manipResult.uri,
          name: new Date().getSeconds().toString(),
          type: 'image/jpg',
        });
        console.log(uploadAvatarForm);
        await doctorAPI.uploadAvatar(currentUser.id, uploadAvatarForm);
        // navigation.goBack();
        return photo;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCameraType = () => {
    setType(
      type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
    );
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera ratio="16:9" style={{ flex: 1 }} type={type} ref={cameraRef}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', margin: 30 }}>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'transparent',
              position: 'absolute',
              left: 0,
            }}
            onPress={() => handleCameraType()}
          >
            <MaterialCommunityIcons name="camera-switch" style={{ color: '#fff', fontSize: 40 }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}
            onPress={() => takePicture()}
          >
            <FontAwesome name="camera" style={{ color: '#fff', fontSize: 40 }} />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

export default CameraScreen;
