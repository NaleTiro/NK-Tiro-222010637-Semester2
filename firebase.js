import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyAZLRZWqWluO7R9o8BeBmczPuM3r0owkaw",
  authDomain: "semester-test2-43e50.firebaseapp.com",
  projectId: "semester-test2-43e50",
  storageBucket: "semester-test2-43e50.firebasestorage.app",
  messagingSenderId: "658706018309",
  appId: "1:658706018309:web:19ebaef3edcc532897ac6c",
  measurementId: "G-RL6BCV82X0"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);az