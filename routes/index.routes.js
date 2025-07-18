const express = require('express')
const authMiddleware = require('../middlewares/auth')
const firebase = require('../config/firebase.config')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const router = express.Router();
const upload = require('../config/multer.config')
const fileModel = require('../models/files.models')
const userModel = require('../models/user.model');




router.get('/', (req, res) => {
    res.redirect('/user/login');
  });

router.get('/home', authMiddleware, async (req,res)=>{


    try{
        const userFile = await fileModel.find({
        user:req.user.userId
    })

    console.log(userFile)

    // Generate signed URLs for images and PDFs
    const filesWithUrls = await Promise.all(userFile.map(async (file) => {
        let signedUrl = null;
        if (file.mimetype && (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf')) {
            const [url] = await firebase.storage().bucket().file(file.path).getSignedUrl({
                action: 'read',
                expires: Date.now() + 60 * 60 * 1000 // 1 hour
            });
            signedUrl = url;
        } else {
            // fallback for files without mimetype
        }
        return { ...file.toObject(), signedUrl };
    }));
 
    res.render('home',{
        files: filesWithUrls,
        success: req.flash('success'),
        error: req.flash('error'),
        user: req.user
    })

    }
    catch(err){
        console.log(err)
        req.flash('error', 'Server Error');
        res.redirect('/home');
    }

})

router.post('/upload', authMiddleware , upload.single('file'), async (req,res)=>{
    try {
        if (!req.file) {
            req.flash('error', 'No file selected.');
            return res.redirect('/home');
        }
        
        const fileSize = req.file.fileRef?.metadata?.size
    ? Number(req.file.fileRef.metadata.size)
    : null;
    const uploadDate = req.file.fileRef?.metadata?.timeCreated
    ? new Date(req.file.fileRef.metadata.timeCreated)
    : new Date();
    const filename = req.file.fileRef?.metadata?.name || req.file.filename || req.file.path;

    

await fileModel.create({
  path: req.file.path,
  originalname: req.file.originalname,
  filename: filename, // <-- use the correct filename
  size: fileSize,
  mimetype: req.file.mimetype,
  user: req.user.userId,
  uploadDate: uploadDate
});
        req.flash('success', 'File uploaded successfully!');
        res.redirect('/home');
    } catch (err) {
        console.log(err);
        req.flash('error', 'File upload failed.');
        res.redirect('/home');
    }
})

router.post('/delete/:id', authMiddleware, async (req, res) => {
    try {
        const fileId = req.params.id;
        const file = await fileModel.findOne({ _id: fileId, user: req.user.userId });
        if (!file) {
            req.flash('error', 'File not found or unauthorized.');
            return res.redirect('/home');
        }
        // Remove file from Firebase storage
        try {

            await firebase.storage().bucket().file(file.path).delete();

        } catch (firebaseErr) {

            console.log(firebaseErr);
            req.flash('error', 'Failed to remove file from storage.');
            return res.redirect('/home');
            
        }
        await fileModel.deleteOne({ _id: fileId });
        req.flash('success', 'File deleted successfully.');
        res.redirect('/home');
    } catch (err) {
        console.log(err);
        req.flash('error', 'File deletion failed.');
        res.redirect('/home');
    }
});

router.get('/download/:path', authMiddleware, async (req,res)=>{

    const loggedInUserId = req.user.userId
    const path = req.params.path

    const file = await fileModel.findOne({
        user:loggedInUserId,
        path:path
    })

    if(!file){
        return res.status(404).json({
            message:'Unauthorized'
        })
    }

    const signedUrl = await firebase.storage ().bucket().file(path).getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 1000,
        responseDisposition: `attachment; filename="${file.originalname}"`
    })

    res.redirect(signedUrl[0])

})

router.get('/profile', authMiddleware, (req, res) => {
    res.render('profile', {
        user: req.user
    });
});

router.post('/profile/update', authMiddleware, async (req, res) => {
    const { username, email } = req.body;
    const updates = {};
    if (username) updates.username = username.trim();
    if (email) updates.email = email.trim();
    if (!username && !email) {
        req.flash('error', 'Please provide a new username or email.');
        return res.redirect('/profile');
    }
    try {
        // Check for uniqueness
        if (username) {
            const existingUser = await userModel.findOne({ username: updates.username, _id: { $ne: req.user.userId } });
            if (existingUser) {
                req.flash('error', 'Username already taken.');
                return res.redirect('/profile');
            }
        }
        if (email) {
            const existingEmail = await userModel.findOne({ email: updates.email, _id: { $ne: req.user.userId } });
            if (existingEmail) {
                req.flash('error', 'Email already registered.');
                return res.redirect('/profile');
            }
        }
        await userModel.findByIdAndUpdate(req.user.userId, updates);
        req.flash('success', 'Profile updated successfully.');
        res.redirect('/profile');
    } catch (err) {
        console.log(err);
        req.flash('error', 'Failed to update profile.');
        res.redirect('/profile');
    }
});

router.post('/profile/password', authMiddleware, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        req.flash('error', 'Please provide both current and new password.');
        return res.redirect('/profile');
    }
    try {
        const user = await userModel.findById(req.user.userId);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            req.flash('error', 'Current password is incorrect.');
            return res.redirect('/profile');
        }
        if (newPassword.length < 5) {
            req.flash('error', 'New password must be at least 5 characters.');
            return res.redirect('/profile');
        }
        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();
        req.flash('success', 'Password changed successfully.');
        res.redirect('/profile');
    } catch (err) {
        console.log(err);
        req.flash('error', 'Failed to change password.');
        res.redirect('/profile');
    }
});


router.get('/logout', authMiddleware, (req, res) => {
    res.clearCookie('token');
    req.flash('success', 'Logged out successfully.');
    res.redirect('/user/login');
});



module.exports=router;