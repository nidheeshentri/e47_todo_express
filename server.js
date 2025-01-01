const express = require('express')
var cors = require('cors')
const mongoose = require("mongoose")
const dotenv = require('dotenv')
const taskRoutes = require("./src/routers/taskRoutes")
const userRoutes = require("./src/routers/userRoutes")
const multer = require('multer');
const path = require('path');

dotenv.config("./.env")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Specify folder to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
    }
});

const upload = multer({ storage });

const fs = require('fs');
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

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

const ImagesSchema = new mongoose.Schema({
    url: {type:String}
})


const ImagesModel = mongoose.model("images", ImagesSchema)

const app = express()


app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use(express.json())

app.use((req, res, next)=>{
    console.log("Working")
    next()
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Respond with the image path
    ImagesModel.create({url: `/uploads/${req.file.filename}`})
    .then(res=> {
        console.log("Res", res)
    }).catch(err => {
        console.log("Err", err)
    })
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

app.get("/images", async (req, res) => {
    const images = await ImagesModel.find()
    res.json({images})
})

app.use("", taskRoutes)
app.use("/user", userRoutes)


app.listen(3001, ()=>{
    console.log("Server started on port 3001")
})
