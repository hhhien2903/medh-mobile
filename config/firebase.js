import { OAUTH_ANDROID_CLIENT_ID } from '@env';
import firebase from 'firebase';

const OAuthConfig = {
  androidClientId: OAUTH_ANDROID_CLIENT_ID,
  scopes: ['profile', 'email'],
};

firebaseConfig = {
  apiKey: 'AIzaSyBQC8lln7K8AIaiP1C6DG7sOT8a2r_0Zb8',
  authDomain: 'medh-firebase.firebaseapp.com',
  projectId: 'medh-firebase',
  storageBucket: 'medh-firebase.appspot.com',
  messagingSenderId: '922464656074',
  appId: '1:922464656074:web:3a31c2b0e5de605b047233',
  measurementId: 'G-QN25FBVMXJ',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export { OAuthConfig, firebaseApp };
