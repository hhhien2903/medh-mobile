import {
  OAUTH_ANDROID_CLIENT_ID,
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_APP_ID,
} from '@env';
import firebase from 'firebase';

const OAuthConfig = {
  androidClientId: OAUTH_ANDROID_CLIENT_ID,
  androidStandaloneAppClientId: OAUTH_ANDROID_CLIENT_ID,
  scopes: ['profile', 'email'],
};

firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  appId: FIREBASE_APP_ID,
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export { OAuthConfig, firebaseApp };
