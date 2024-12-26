const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

const TaskSchema = new mongoose.Schema({
    task: {type: String, default: "empty task"},
});

TaskSchema.pre("remove", (next)=>{
    console.log("Item removed")
    next()
})

const Task = mongoose.model('task', TaskSchema);

router.get("/", (req, res)=>{
    Task.find()
    .then(taskItems => {
        console.log(taskItems)
        res.json({taskItems, count: taskItems.length})
    })
    .catch(err => {

    })
    // res.json({tasks})
})

router.post("/", (req, res) => {
    console.log(req.body)
    const userTask = req.body.task
    Task.create({task: userTask})
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