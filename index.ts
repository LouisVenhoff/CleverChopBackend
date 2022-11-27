const express = require("express");

const app = express();
const port = 3014;


app.get("/", (req:any, res:any) => {
    console.log("Working");
})

app.get("/api/sendCode/:code", (req:any, res:any) => {
    console.log("Got code Route" + req.params.code);
})

app.listen(port, () => {
    console.log("Listening on Port " + port);
})