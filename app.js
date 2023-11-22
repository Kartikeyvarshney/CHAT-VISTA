const express = require('express')
const app = express();
const http = require('http').createServer(app)
const socket = require('socket.io')
const io = socket(http)
const path = require('path')
const userRoutes = require('./routes/userRoutes');
const { default: mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const {requireAuth,checkuser} = require('./middleware/authMiddleware')
const dotenv = require('dotenv')
dotenv.config();

app.set('views',path.join(__dirname,'views'))
app.set('view engine' , 'ejs') 

app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())
app.use(cookieParser())
const Port = process.env.PORT ||3000
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("Database is connected.")
    http.listen(Port,(error)=>{
        error?console.log(rr.message):console.log(`Server is online http://localhost:${Port}`)
    })
})
.catch((error)=>{
    console.log(error.message)
})

io.on('connection',(socket)=>{
    console.log('A user connected...')
    socket.on('disconnecting',()=>{
        console.log('A user disconnected...')
    })
    socket.on('messageToServer',(msg)=>{
        socket.broadcast.emit('messageFromServer',msg)
    })
})
app.get('*',checkuser)
app.get('/',(req,res)=>{
    res.render('index')
})
app.use(userRoutes)
app.get('/chats',requireAuth,(req,res)=>{
    res.render('chats')
})