const http = require("http");
const fs = require("fs");
//const PORT = 8000;
var datetime = new Date();
require("dotenv").config();

const PORT = process.env.PORT;

const myServer = http.createServer((req, res) => {
    const log = datetime+" New Call Received\n";
    fs.appendFile("log.txt",log, () => {
        console.log("New Request Recieved");
        res.end("Hello from server (end)");
    });
});
myServer.listen(PORT, () => console.log('server started on Port#: ${PORT}'));