const http = require("http");
const fs = require("fs");
const express = require("express");
const path = require("path");
const axios = require('axios');
const app = express();
const PORT = 8000;
const confDir = "./certf";
const { exec } = require('child_process');
const fileURLToPath = require('url');
const dirname = require('path');

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


  function runCommand() {
    return new Promise((resolve, reject) => {
      exec('wget https://raw.githubusercontent.com/arcanum-technologies-pk/wg-install/refs/heads/main/wireguard-install.sh -O wireguard-install.sh && bash wireguard-install.sh', 
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            return reject('0');
          }
      
          // if (stderr) {
          //   console.error(`Stderr: ${stderr}`);
          //   return resolve('0'+stderr);
          // }
      
          if(stdout) {
            console.log(`Stdout: ${stdout}`);
            //resolve(stdout.toString());
            return resolve('1');
           // return 1;
          }

          //return resolve('1');
        });

        
     /* exec('ls', (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          reject(error);
          return;
        }
  
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          reject(stderr);
          return;
        }
  
        resolve(stdout.toString());
      }); */
/*
      exec('echo "Node.js has permission to run shell commands"', (error, stdout, stderr) => {
        if (error) {
          console.error('Node.js does not have permission to execute shell commands.');
          console.error(`Error: ${error.message}`);
          return;
        }
      
        if (stderr) {
          console.error('There was an issue executing the command:');
          console.error(`Stderr: ${stderr}`);
          return;
        }
      
       // console.log(`Success: ${stdout}`);
       resolve(stdout.toString());
      });
      */
/*
      exec('wget --version', (error, stdout, stderr) => {
        if (error) {
          console.error('`wget` is not installed or not accessible.');
          console.error(`Error: ${error.message}`);
          return;
        }
      
        if (stderr) {
          console.error('`wget` is installed, but there may be an issue:');
          console.error(`Stderr: ${stderr}`);
          return;
        }
      
        console.log('`wget` is installed and accessible:');
        console.log(`Version Info: ${stdout}`);

        resolve(stdout.toString());
      });*/
      //resolve('1');
    });
  }
  
  // Use the function and handle the promise result
  // runCommand()
  //   .then((output) => {
  //     console.log(`${output}`);
  //   })
  //   .catch((error) => {
  //     console.error(`${error}`);
  //   });


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
});

app.get('/api/conf', async (req, res) => {
  const {id} = req.query
  
  if (id === '1'){
    
  try {
    // Wait for runCommand to complete and get its result
    const GenNewConfFile = await runCommand();
    
    if (GenNewConfFile === '1') {
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
    } else if (GenNewConfFile === '0') {
          return res.status(404).json({ error: 'No .conf files generated' });
    } else {
      res.status(500).json({ error: 'Command execution failed (not success nor fail)' });
    }
    
  
  } catch (error) {
    res.status(500).json({ error: 'Command execution failed' });
  }
    } else if (id === '2'){
     /* const url = 'http://68.183.75.173:8000/api/conf?id=2';

      axios.get(url)
    .then(response => {
        console.log(response.data); // Log the JSON data
    })
    .catch(error => {
        console.error('Error fetching data:', error.message);
    });*/
    return res.status(404).json({ error: 'Germany Server not configured yet' });
    } else if (id === '3'){
     /* const url = 'http://165.227.76.23:8000/api/conf?id=3';

      axios.get(url)
    .then(response => {
        console.log(response.data); // Log the JSON data
    })
    .catch(error => {
        console.error('Error fetching data:', error.message);
    });*/
    return res.status(404).json({ error: 'US Server not configured yet' });
    }else{
      return res.status(404).json({ error: 'Invalid location' });
    }
});


/*
app.get('/api/conf', (req, res) => {
  const GenNewConfFile = runCommand();
  console.log(GenNewConfFile);
  if (!GenNewConfFile) {
    return res.status(404).json({ error: 'No .conf files found' });
  }else{
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
  }
  });*/

  app.get('/api/loc', (req, res) => {
    //const {countryName} = req.query
    //console.log(countryName);
   /* if (!GenNewConfFile) {
      return res.status(404).json({ error: 'No .conf files found' });
    }else{
      return res.json({ los: GenNewConfFile });
    }*/
      return res.json([
        {
            "id": '1',
            "country": "Netherlands",
            "city": "Amsterdam",
            "cities": [
                {
                    "id": '100',
                    "country": "Netherlands",
                    "city": "Amsterdam-2"
                }
            ]
        },
        {
            "id": '2',
            "country": "Germany",
            "city": "Frankfurt"
        },
        {
            "id": '3',
            "country": "United States",
            "city": "New York"
        }
    ]);
    });
  /*  var options = {
      host: 'mis.ihc.gov.pk',// host: 'host.com',
       port: '80',
       path: '/ihc.asmx/Juges_MOB_GA',//path: '/WebServiceUtility.aspx/CustomOrderService',
       method: 'POST'
      //  headers: {
      //    'Content-Type': 'application/json; charset=utf-8',
      //    'Content-Length': '11770'
      //  }
     };

    http.request(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
      });
    }).end();

    });*/
  
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
