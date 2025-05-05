import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, CACHE_SIZE_UNLIMITED,serverTimestamp ,getFirestore   } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBaeAJ0njdF8TaUReHw4KSgIQ1RG9Dg21Q",
  authDomain: "innovation-oasis-660c3.firebaseapp.com",
  projectId: "innovation-oasis-660c3",
  storageBucket: "innovation-oasis-660c3.appspot.com",
  messagingSenderId: "770777361308",
  appId: "1:770777361308:web:d69db8b67e88735a3db659",
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  ignoreUndefinedProperties: true,
  experimentalForceLongPolling: true,
});

const auth = getAuth(app);

const storage = getStorage(app);

export { app, auth, db, storage ,serverTimestamp,getFirestore   };
export default app;
