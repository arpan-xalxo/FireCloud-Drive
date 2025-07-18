# Google Drive Clone

A modern, full-stack cloud storage app built with Node.js, Express, EJS, MongoDB, and Firebase Storage. Upload, preview, search, and manage your files securely—just like Google Drive!

## 🚀 Features
- User authentication (register/login/logout)
- File upload to Firebase Storage
- File listing, download, and delete
- Image and PDF preview
- Responsive, modern UI with dark mode
- Profile page (update info, change password)
- Search and filter files by name/type
- Toast notifications for actions
- Secure JWT-based sessions

## 🛠️ Tech Stack
- Node.js, Express.js
- EJS (server-side rendering)
- MongoDB (Atlas or Railway plugin)
- Firebase Storage (for file uploads)
- Tailwind CSS, Flowbite, Remixicon
- Railway (or Render/Heroku) for deployment

## ⚙️ Environment Variables
Set these in your Railway/Render/Heroku dashboard:

| Variable Name           | Description                        |
|------------------------|------------------------------------|
| `MONGO_URI`            | MongoDB connection string           |
| `JWT_SECRET`           | JWT signing secret                  |
| `SESSION_SECRET`       | Express session secret              |
| `FIREBASE_PROJECT_ID`  | Firebase project ID                 |
| `FIREBASE_PRIVATE_KEY` | Firebase private key (escaped)      |
| `FIREBASE_CLIENT_EMAIL`| Firebase client email               |

## 🔧 Setup & Run Locally
1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/google-drive-clone.git
   cd google-drive-clone
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your variables (see above).
4. Start the app:
   ```bash
   npm start
   ```
5. Visit [http://localhost:3000](http://localhost:3000)

## ☁️ Deployment
- Deploy to [Railway](https://railway.app/) or [Render](https://render.com/).
- Set all environment variables in the dashboard.
- Use MongoDB Atlas or Railway's MongoDB plugin.
- No need to upload Firebase JSON—use env vars as shown in `config/firebase.config.js`.

## 📦 Credits
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Multer Firebase Storage](https://www.npmjs.com/package/multer-firebase-storage)
- [Tailwind CSS](https://tailwindcss.com/)
- [Remixicon](https://remixicon.com/)
- [Flowbite](https://flowbite.com/)

---

**Made with ❤️ by Arpan** 