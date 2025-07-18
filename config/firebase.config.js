const Firebase = require('firebase-admin')
const serviceAccount = require('../drive-bdf61-firebase-adminsdk-fbsvc-e40222e999.json')


const firebase = Firebase.initializeApp({

    credential:Firebase.credential.cert(serviceAccount),
    storageBucket:"drive-bdf61.firebasestorage.app"

})

module.exports = Firebase