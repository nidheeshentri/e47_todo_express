const express = require('express')
var cors = require('cors')
const mongoose = require("mongoose")
const dotenv = require('dotenv')
const taskRoutes = require("./src/routers/userRoutes")

dotenv.config("./.env")

const dbPassword = process.env.DB_PASSWORD

// Create
// Read
// Update
// Delete

mongoose.connect(`mongodb+srv://nidheesh:${dbPassword}@main.sjcjv.mongodb.net/?retryWrites=true&w=majority&appName=main`)
.then(res => {
    console.log("DB connected successfully")
}).catch(err => {
    console.log("DB connection failed")
})

const app = express()



const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    phone: String,
    password: String
})

const User = mongoose.model("user", UserSchema)


app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use(express.json())

app.use((req, res, next)=>{
    console.log("Working")
    next()
})

app.use("", taskRoutes)

let tasks = [
    {
        _id: 1,
        task: "Go to shop",
    },
    {
        _id: 2,
        task: "Buy Tomato",
    },
    {
        _id: 3,
        task: "Buy Chilly",
    },
    {
        _id: 4,
        task: "Pay",
    },
]

app.listen(3001, ()=>{
    console.log("Server started on port 3001")
})
