import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: "insta-clone-557b6.firebaseapp.com",
	projectId: "insta-clone-557b6",
	storageBucket: "insta-clone-557b6.appspot.com",
	messagingSenderId: "632184198645",
	appId: "1:632184198645:web:3989ef4e6dc9b02fda3cbc",
	measurementId: "G-5SB9GEP430",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, app };
