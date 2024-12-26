const express = require('express')
var cors = require('cors')
const mongoose = require("mongoose")
const dotenv = require('dotenv')
const taskRoutes = require("./src/routers/taskRoutes")
const userRoutes = require("./src/routers/userRoutes")

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


app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use(express.json())

app.use((req, res, next)=>{
    console.log("Working")
    next()
})

app.use("", taskRoutes)
app.use("/user", userRoutes)


app.listen(3001, ()=>{
    console.log("Server started on port 3001")
})
