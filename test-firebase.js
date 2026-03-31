
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyAlqAnjUALH_PeLV4yrfMIAqtrdv5QJqvQ",
  authDomain: "sotuv-crm.firebaseapp.com",
  projectId: "sotuv-crm",
  storageBucket: "sotuv-crm.firebasestorage.app",
  messagingSenderId: "503309507688",
  appId: "1:503309507688:web:62b647ef0808e54852afdd"
};

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  console.log("Success");
} catch (e) {
  console.error("Error detected:");
  console.error(e);
}
