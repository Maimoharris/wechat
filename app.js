const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const indexRouter=require("./routes/index.js");
const userRouter=require("./routes/user.js");
const chatroomRouter=require("./routes/chatroom.js");
const deleteRouter=require("./routes/delete.js");

app.listen(PORT,()=>{
    console.log(`App Runing on port ${PORT}`);
});

app.get("/",(req,res)=>{
    res.send("Hello Welcome to wechat");
});