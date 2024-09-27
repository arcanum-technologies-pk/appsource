const http = require("http");
const fs = require("fs");
const express = require("express");
//const apiCallFromNode = require("./app");
const path = require("path");

const app = express();
const PORT = 8000;
const confDir = "./certf";

function getLatestConfFile(directory) {
  const files = fs.readdirSync(directory);

  const confFiles = files
    .filter(( file ) => file.endsWith(".conf") )
    .map((file) => ({

      file,

      time: fs.statSync(path.join(directory, file)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time); 

  return confFiles.length > 0 ? path.join(directory, confFiles[0].file) : null;
}


function parseConfData(data) {
    const result = {};
    const lines = data.split('\n');
    let currentSection = null;
  
    lines.forEach(line => {
      line = line.trim();
         
      
      if (line.startsWith('[') && line.endsWith(']')) {
        currentSection = line.slice(1, -1); 
        
        result[currentSection] = {};
        
      } else if (line.slice(0, 3) == 'DNS'){
        const [key, value] =  line.split(' =').map(part => part.trim());
        result[currentSection][key] = value.split(',')[0];
       // console.log(value.split(',')[0]);
      }else if (line.slice(0, 10) == 'AllowedIPs'){
        const [key, value] =  line.split(' =').map(part => part.trim());
        result[currentSection][key] = value.split(',')[0];
       // console.log(value.split(',')[0]);
      } else if (line && currentSection) {
        const [key, value] =  line.split(' =').map(part => part.trim());
        result[currentSection][key] = value;
        
      }
    });
    
    return result;
}

app.get('/',(req,res)=>{
    res.send("Server is running !!")
})

app.get('/api/conf', (req, res) => {
    const latestConfFile = getLatestConfFile(confDir);
  
    if (!latestConfFile) {
      return res.status(404).json({ error: 'No .conf files found' });
    }
  
    fs.readFile(latestConfFile, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error reading .conf file' });
      }
  
      const jsonData = parseConfData(data);
      res.json(jsonData);
    });
  });
  
  app.listen(PORT, () => {
    console.log(`Server started on Port# ${PORT}`);
  });


// var datetime = new Date();
// require("dotenv").config();

// const PORT = process.env.PORT;

// const myServer = http.createServer((req, res) => {
//     if(req.url === "/index"){
//     const log = datetime+" New Call Received\n";
//     fs.appendFile("log.txt",log, () => {
//         console.log("New Request Recieved");
//         res.end("Hello from server (end)..");
//     });
//     }else if(req.url === "/app") {
//         const log = datetime+" API Call Received\n";
//         fs.appendFile("log.txt",log, () => {
//             console.log("API called");
//             res.end("API called.....");
//         });
//         /*apiCallFromNode.callApi(function(response){
//             res.write(response);
//             res.end();
//         });*/
//     }
// });
// myServer.listen(PORT, () => console.log("server started on Port#: "+PORT));
