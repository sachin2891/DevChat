
const express = require('express');
const connectDb = require('./config/database')
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);



// find the user by email


// singup the user 



// update the user data
// app.patch('/update/:userId', async (req, res) => {


//     const userId = req.params?.userId;
//     const data = req.body;


//     try {
//         const ALLOWED_UPDATES = ["userId", "skills", "photoUrl", 'gender', "about", "age"];
//         const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
//         if (data?.skills.length > 10) {
//             throw new Error("Skills can not be more than 10");
//         }
//         if (!isUpdateAllowed) {
//             throw new Error("update is not allowed");

//         }
//         await User.findByIdAndUpdate({ _id: userId }, data);
//         res.send("User updated successfully");
//     } catch (error) {
//         res.status(405).send("error accure while user update: " + error.message);
//     }



// })
// app.get('/user', async (req, res) => {
//     const email = req.body.email;

//     try {
//         const users = await User.findOne({ email: email });
//         if (!users) {
//             res.send(404).send("user not found")
//         }
//         res.status(200).send(users)


//     } catch (error) {
//         res.status(404).send(error.message)

//     }

// })
// // user deletion by ID
// app.delete('/user', async (req, res) => {
//     const userId = req.body.userId;

//     try {
//         const user = await User.findByIdAndDelete(userId)

//         res.status(200).send("User deleted successfully");


//     } catch (error) {
//         res.status(404).send(error.message)

//     }

// })
// // find all the usersin the db 
// app.get('/feed', async (req, res) => {
//     // const email = req.body.email;

//     try {
//         const users = await User.find({});

//         res.status(200).send(users)

//     } catch (error) {
//         res.status(403).send("user not found in the database", error.message)

//     }

// });

connectDb().then(() => {
    console.log("data base connection established");
    app.listen(8000, () => {
        console.log("listing on port 3000");
    })

}).catch(() => {
    console.error("Database connection failed", err);
});



