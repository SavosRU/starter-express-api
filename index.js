const express = require('express')
const app = express()
const axios     = require("axios")
// const fetch     = require("node-fetch")

// ***  DETECT of SERVER's IPs **
//====================================================================================
const os = require('os');
const networkInterfaces = os.networkInterfaces();
const nonLocalInterfaces = {};
for (let inet in networkInterfaces) {
  let addresses = networkInterfaces[inet];
  for (let i=0; i<addresses.length; i++) {
    let address = addresses[i];
    if (!address.internal && address.family != "IPv6") {
      if (!nonLocalInterfaces[inet]) {
        nonLocalInterfaces[inet] = [];
      }
      delete address.netmask;
      delete address.family;
      delete address.mac;
      delete address.internal;
      nonLocalInterfaces[inet].push(address);
    }
  }
}
console.log("\n\n***   ***   ***Server's IP adresses:\n",nonLocalInterfaces, "\n***   ***   ***\n\n");
//====================================================================================


app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})
// app.get("/fetch_ips", async (req, res) => {
//     const servers = await fetch("https://2ip.ru/");
//     const data = await servers.text();
//     const dataArray = data.split("\n");
//     let myExtIP = "";
//     dataArray.forEach(element => {
//         if(element.includes("return 'IP адрес:")) {
//             myExtIP = element.replace("return 'IP адрес: ", "").replace("\"\\n\"", "").replace("\"\\n\"", "").replace("' +  + copyInfoText + '© 2ip.io' + ", "");
//             console.log("FETCH() => Element:", myExtIP);
//         }
//     });
//     res.status(200).json({fetch: true, serverExternalIP: myExtIP});
// }); 
app.get("/axios_ips", async (req, res) => {
    const servers = await axios.get("https://2ip.ru/");
    const data = await servers.data;
    const dataArray = data.split("\n");
    let myExtIP = "";
    dataArray.forEach(element => { 
        if(element.includes("return 'IP адрес:")) {
            myExtIP = element.replace("return 'IP адрес: ", "").replace("\"\\n\"", "").replace("\"\\n\"", "").replace("' +  + copyInfoText + '© 2ip.io' + ", "");
            console.log("AXIOS() => Element:", myExtIP);
        }
    });
    res.status(200).json({axios: true, serverExternalIP: myExtIP});
}); 
app.listen(process.env.PORT || 3000)