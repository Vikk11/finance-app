const admin = require("firebase-admin");
const { initializeApp: initializeClientApp } = require("firebase/app");
const {
    getAuth,
    signInWithCustomToken,
} = require("firebase/auth");
const fs = require("fs");
require("dotenv").config();

const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
};

const clientApp = initializeClientApp(firebaseConfig);
const auth = getAuth(clientApp);

const firebaseUids = [
    process.env.FIREBASE_UID_1,
    process.env.FIREBASE_UID_2,
    process.env.FIREBASE_UID_3,
];

if (firebaseUids.some(uid => !uid)) {
    console.error("Error: One or more Firebase UIDs are not set.");
    process.exit(1);
  }

  async function generateToken(uid) {
    try {
        const customToken = await admin.auth().createCustomToken(uid);
        console.log(`Custom token created for UID ${uid}`);

        const userCredential = await signInWithCustomToken(auth, customToken);
        const idToken = await userCredential.user.getIdToken();

        fs.appendFileSync("test-token.txt", idToken + "\n");
        console.log("ID token saved to test-token.txt\n");
    } catch (error) {
        console.error("Error generating token:", error);
    }
}

(async () => {
    for (const uid of firebaseUids) {
        await generateToken(uid);
    }

    await auth.signOut();
})();

