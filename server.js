const express = require('express')
var cors = require('cors')
const mongoose = require("mongoose")
const dotenv = require('dotenv')

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

const TaskSchema = new mongoose.Schema({
    task: {type: String, default: "empty task"},
});

const Task = mongoose.model('task', TaskSchema);

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

app.get("/", (req, res)=>{
    Task.find()
    .then(taskItems => {
        console.log(taskItems)
        res.json({taskItems, count: taskItems.length})
    })
    .catch(err => {

    })
    // res.json({tasks})
})

app.post("/", (req, res) => {
    console.log(req.body)
    const userTask = req.body.task
    Task.create({task: userTask})
    res.send("Success")
})

app.delete("/task/:id", (req, res) => {
    console.log(req.params.id)
    Task.findByIdAndDelete(req.params.id)
    .then(data=>{
        if (data){
            res.send("Deleted")
        }else{
            res.status(404).json({"message": "Task does not exists."})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(400).json({"message": "Something went wrong"})
    })
})

app.listen(3001, ()=>{
    console.log("Server started on port 3001")
})