const express = require('express');
const { connect } = require('mongoose');
const app = express();
const connectDB = require('./config/db');
const path = require("path")
//Route Imports
const UsersRoutes = require('./routes/api/users');
const PostsRoutes = require('./routes/api/posts');
const AuthRoutes = require('./routes/api/auth');
const ProfileRoutes = require('./routes/api/profile');

//Server static assets in production
if(process.env.NODE_ENV === 'production')
{
    //Set Static Folder
    app.use(express.static('client/build'));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}


const PORT = process.env.PORT || 5000

// Connect DB

connectDB();

// Init Middlewares
app.use(express.json({ extended : false}));


//define Routes

app.use('/api/users',UsersRoutes);
app.use('/api/auth',AuthRoutes);
app.use('/api/posts',PostsRoutes);
app.use('/api/profile',ProfileRoutes);

app.listen(PORT, ()=>{
    console.log(`SERVER START ON PORT ${PORT}`)
})