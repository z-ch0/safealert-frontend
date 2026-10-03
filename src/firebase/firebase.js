import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdrdAbkzRaku9ZFwvdZhT72X-nxEj_wDU",
  authDomain: "safealert-78e46.firebaseapp.com",
  projectId: "safealert-78e46",
  messagingSenderId: "168109121701",
  appId: "1:168109121701:web:9a7d8def14ae42b102ed4c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });