
const multer = require('multer')
const firebase = require('./firebase.config')
const serviceAccount = require('../drive-bdf61-firebase-adminsdk-fbsvc-e40222e999.json')
const  firebaseStorage = require('multer-firebase-storage')


const storage = firebaseStorage({
    credentials: firebase.credential.cert(serviceAccount),
    bucketName:'drive-bdf61.firebasestorage.app',
    unique:true
})

const upload =multer({
    storage:storage
})

module.exports = upload