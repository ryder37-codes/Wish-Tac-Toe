const firebaseConfig = {
    apiKey: "AIzaSyC2t38CsWKIiPo895LPbubqGhytzh0CTVg",
    authDomain: "wish-tac-toe.firebaseapp.com",
    databaseURL: "https://wish-tac-toe-default-rtdb.firebaseio.com",
    projectId: "wish-tac-toe",
    storageBucket: "wish-tac-toe.firebasestorage.app",
    messagingSenderId: "760233069096",
    appId: "1:760233069096:web:e542d1524b0a1c1808831d"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
