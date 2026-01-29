export const environment = {
  production: false,
  // URL de ton serveur local (ex: Firebase Functions local ou Express sur port 5000)
  apiUrl: 'http://localhost:5001/demo-no-project/us-central1/api', 
  appName: 'Babito Admin (Dev)',
  firebase: {
    // Clés Firebase pour l'émulateur local - format valide mais dummy
    apiKey: "AIzaSyDummyKeyForEmulator123456789",
    authDomain: "demo-no-project.firebaseapp.com",
    projectId: "demo-no-project",
    storageBucket: "demo-no-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456789"
  }
};