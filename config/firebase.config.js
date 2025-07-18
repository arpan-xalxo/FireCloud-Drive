const Firebase = require('firebase-admin')


const firebase = Firebase.initializeApp({

    credential:Firebase.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    storageBucket:"drive-bdf61.firebasestorage.app"

})

module.exports = Firebase