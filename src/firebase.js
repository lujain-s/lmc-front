// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "axios";

const firebaseConfig = {
  apiKey: "AIzaSyDQi-zx1DFIG0X49Um_2-8dBsfw28RBim4",
  authDomain: "lmc-institute-647ba.firebaseapp.com",
  projectId: "lmc-institute-647ba",
  storageBucket: "lmc-institute-647ba.firebasestorage.app",
  messagingSenderId: "286485648728",
  appId: "1:286485648728:web:2434fc972c540bbc52012d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Messaging
const messaging = getMessaging(app);

// Get device token
export const requestForToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BEHmhAa5TCrciUGjLpYzAlz0OZOdijXMXm2ecCGHGbj0SdqVoBkVNti1WGpbGHMXX58Xbf7ckaZ6nnviDwuW89s",
    });
    if (token) {
      console.log("FCM Token:", token);
      // تحقق من التوكن السابق
      const prevToken = localStorage.getItem("firebase_token");
      if (prevToken !== token) {
        // خزنه محلياً
        localStorage.setItem("firebase_token", token);
        // أرسل التوكن إلى السيرفر إذا كان المستخدم مسجلاً
        const userToken = JSON.parse(localStorage.getItem("token"));
        if (userToken) {
          await axios.post(
            "http://127.0.0.1:8000/api/editFirebaseToken",
            { newFirebaseToken: token },
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
      }
    } else {
      console.warn("No registration token available.");
    }
  } catch (error) {
    console.error("An error occurred while retrieving token.", error);
  }
};

// Listen to messages in foreground
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      resolve(payload);
    });
  });
