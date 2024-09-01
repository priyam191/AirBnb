const express = require("express");
const router = express.Router();

router.get("/", (req,res) => {
    res.send("GET for users");
});

router.get("/:id", (req,res) =>{
    res.send("GET for the show users");
});

router.post("/:id", (req,res) =>{
    res.send("POST for the show users");
});


module.exports = router;