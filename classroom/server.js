const express = require("express");
const app = express();
const users = require("./routes/user.js");

// app.get("/", (req,res) => {
//     res.send("i am  root");
// });

app.use("/users", users);

app.listen(3000, () =>{
    console.log("server is listening to the port 3000");
});

