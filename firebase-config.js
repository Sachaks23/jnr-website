// ============================================================
// CONFIGURATION FIREBASE
// ============================================================
// 1. Va sur https://console.firebase.google.com
// 2. Cree un nouveau projet (ex: "shop2puff")
// 3. Dans "Authentication" > "Sign-in method" > active "Email/Password"
// 4. Dans "Firestore Database" > cree une base en mode production
// 5. Dans les parametres du projet > "Tes applications" > ajoute une app Web
// 6. Copie la config ci-dessous et remplace les valeurs
// ============================================================

const firebaseConfig = {
  apiKey:            "AIzaSyC-sKEshd6lHq_hFDzZqie9L5c8CNPXILc",
  authDomain:        "shop2puff-becef.firebaseapp.com",
  projectId:         "shop2puff-becef",
  storageBucket:     "shop2puff-becef.firebasestorage.app",
  messagingSenderId: "24683755870",
  appId:             "1:24683755870:web:bfabf7950f78384909b7cf"
};

// Initialisation
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();

// Session persistante 30 jours
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Verifie l'expiration de session 30j
function checkSessionExpiry() {
  const loginDate = localStorage.getItem('s2p_login_date');
  if (loginDate) {
    const days = (Date.now() - parseInt(loginDate)) / (1000 * 60 * 60 * 24);
    if (days > 30) {
      auth.signOut();
      localStorage.removeItem('s2p_login_date');
    }
  }
}
checkSessionExpiry();

// ============================================================
// REGLES FIRESTORE (a copier dans Firebase Console > Firestore > Regles)
// ============================================================
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /users/{userId} {
//       allow read, write: if request.auth != null && request.auth.uid == userId;
//       match /orders/{orderId} {
//         allow read, write: if request.auth != null && request.auth.uid == userId;
//       }
//     }
//   }
// }
// ============================================================
