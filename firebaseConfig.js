// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvpeCgxLB1wAHvAsySmbHUusogq2SFxBA",
  authDomain: "money-tracker-f6520.firebaseapp.com",
  projectId: "money-tracker-f6520",
  storageBucket: "money-tracker-f6520.appspot.com",
  messagingSenderId: "676362227157",
  appId: "1:676362227157:ios:1326fda354d1592fa0415c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
