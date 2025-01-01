const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const UserModel = require("../models/userModels")



const router = express.Router()
const saltRounds = 10;
const encryptKey = "lksjhdhrgfugh234uks"


router.get("/", async (req, res)=>{
    const users = await UserModel.find()
    res.json(users)
})

router.post("/register", (req, res)=>{
    bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
        if(hash){
            try{
                const newUser = await UserModel.create({...req.body, password: hash})
                res.json({message:  "User created successfully"})
            }catch (err){
                console.log(err)
                res.status(400).json({message: "User already exists"})
            }
        }
        else{
            res.status(400).json({message: "Something went wrong"})
        }
    });
})

router.post("/login", async (req, res) => {
    const emailId = req.body.email
    const password = req.body.password
    const user = await UserModel.findOne({email: emailId})
    bcrypt.compare(password, user.password, function(err, result) {
        if(result){
            var token = jwt.sign({ email: emailId }, encryptKey);
            res.json({message:  "Logged in successfully", token: token})
        }else{
            res.status(400).json({message:  "Invalid credentials"})
        }
    });
})

router.post("/check-token", (req, res) => {
    let token = req.body.token
    let user = jwt.verify(token, encryptKey)
    if (user.email){
        res.send("Success")
    }else{
        res.status(401).json({message: "Invalid token"})
    }
})

router.put("/:id", (req, res) => {
    res.send("edit user")
})

router.delete("/:id", async(req, res) => {
    await UserModel.findByIdAndDelete(req.params.id)
    res.send("deleted")
})

module.exports = router
