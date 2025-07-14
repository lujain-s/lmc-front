importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDQi-zx1DFIG0X49Um_2-8dBsfw28RBim4",
  authDomain: "lmc-institute-647ba.firebaseapp.com",
  projectId: "lmc-institute-647ba",
  storageBucket: "lmc-institute-647ba.firebasestorage.app",
  messagingSenderId: "286485648728",
  appId: "1:286485648728:web:2434fc972c540bbc52012d",
});

const messaging = firebase.messaging();
