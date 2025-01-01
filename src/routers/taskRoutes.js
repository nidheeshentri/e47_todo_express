const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
var jwt = require('jsonwebtoken');
const UserModel = require("../models/userModels")

const encryptKey = "lksjhdhrgfugh234uks"

const TaskSchema = new mongoose.Schema({
    task: {type: String, default: "empty task"},
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});

TaskSchema.pre("remove", (next)=>{
    console.log("Item removed")
    next()
})

const Task = mongoose.model('task', TaskSchema);

router.get("/", async (req, res)=>{
    let token = req.headers.authorization
    let userEmail = jwt.verify(token, encryptKey)
    let user = await UserModel.findOne({email: userEmail.email})
    Task.find({userId: user._id})
    .then(taskItems => {
        console.log(taskItems)
        res.json({taskItems, count: taskItems.length})
    })
    .catch(err => {

    })
    // res.json({tasks})
})

router.post("/", async (req, res) => {
    console.log(req.body)
    const userTask = req.body.task
    const token = req.body.token
    let userEmail = jwt.verify(token, encryptKey)
    let user = await UserModel.findOne({email: userEmail.email})
    Task.create({task: userTask, userId: user._id})
    res.send("Success")
})

router.put("/edit-task/:id", async (req, res) => {
    const id = req.params.id
    const taskData = req.body.task
    const taskDoc = await Task.findById(id)
    taskDoc.task = taskData
    taskDoc.save().then(resData => {
        res.send("Success")
    })
})

router.delete("/task/:id", (req, res) => {
    console.log(req.params.id)
    Task.findOneAndDelete({_id:req.params.id})
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

module.exports = router