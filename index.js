const express = require('express')
const app = express()

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
app.all("/ips", async (req, res) => {
    res.status(200).json(nonLocalInterfaces);
}); 
app.listen(process.env.PORT || 3000)