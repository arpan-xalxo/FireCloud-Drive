
const multer = require('multer')
const firebase = require('./firebase.config')
const  firebaseStorage = require('multer-firebase-storage')


const storage = firebaseStorage({
    credentials: {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    },
    bucketName: 'drive-bdf61.firebasestorage.app',
    unique: true
})

const upload =multer({
    storage:storage
})

module.exports = upload