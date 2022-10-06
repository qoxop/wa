import * as admin from 'firebase-admin';
import { FIREBASE_JSON } from 'keystore';

if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(FIREBASE_JSON),
    })
  }
  
  export default admin