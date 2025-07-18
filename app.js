const express = require('express');
const userRouter = require('./routes/user.routes')
const dotenv = require('dotenv')
dotenv.config()
const connectToDB = require('./config/db')
connectToDB()
const cookieParser = require('cookie-parser')
const app = express()
const indexRouter = require('./routes/index.routes')
const session = require('express-session');
const flash = require('connect-flash');

app.set('view engine','ejs')

//middleware to read json file in console
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/',indexRouter)
app.use('/user',userRouter)


//error handling on global level last hope 
// process.on('uncaughtException',(err)=>{
//         console.log('Uncaught Exception');
//         console.log(err);
// })


app.listen(3000,()=>{
    console.log('Server is running on port 3000')
})