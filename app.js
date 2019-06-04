const NetSSH = require('./index');
const netssh = new NetSSH();

const password = 'cisco';

const session = netssh.session({
  host: 'devcsr1.ironbowlab.com',
  username: 'admin',
  password: password
});

// CASE: SEND ONE COMMAND TO ONE DEVICE
// netssh.send_command('show run | i hostname', session).then(results => console.log(results));

//CASE: SEND MULTIPLE COMMANDS TO ONE DEVICE
// netssh
//   .send_commands(['show run | i hostname', 'show clock'], session)
//   .then(results => console.log(results));

// CASE: SEND ONE COMMAND TO MULTIPLE DEVICES
const devices = [
  netssh.session({ host: 'devcsr1.ironbowlab.com', username: 'admin', password: password }),
  netssh.session({ host: 'devcsr2.ironbowlab.com', username: 'admin', password: password }),
  netssh.session({ host: 'devcsr3.ironbowlab.com', username: 'admin', password: password }),
  netssh.session({ host: 'prodcsr1.ironbowlab.com', username: 'admin', password: password }),
  netssh.session({ host: 'prodcsr2.ironbowlab.com', username: 'admin', password: password }),
  netssh.session({ host: 'prodcsr3.ironbowlab.com', username: 'admin', password: password })
];

const commands = [
  'show run | i hostname',
  'show clock',
  'show ip route',
  'show ntp status',
  'show version',
  'show ip eigrp neighbors',
  'show cdp neighbors',
  'show lldp neighbors'
];

// netssh.send_to_multi('show run | i hostname', devices).then(output => console.log(output));

// CASE: SEND MULTIPLE COMMANDS TO MULTIPLE DEVICES
// netssh.send_commands_to_multi(commands, devices).then(output => handleOutput(output));

// CASE: SEND CONFIG COMMANDS TO SINGLE DEVICE
// Config commands don't work because of the single-command nature of this ssh lib
// netssh
//   .send_commands(['config t', 'ip route vrf mgmt-vrf 1.1.1.1 255.255.255.255 10.12.100.1'], session)
//   .then(results => console.log(results));

// CASE: SEND MULTIPLE CONFIG COMMANDS TO MULTIPLE DEVICES
// Config commands don't work because of the single-command nature of this ssh lib

// CASE: ONE COMMAND TO RULE THEM ALL
const single = [
  netssh.session({
    host: 'devcsr1.ironbowlab.com',
    username: 'admin',
    password: password
  })
];

netssh.send(commands, single).then(output => netssh.prettyOutput(output));
// netssh.send(commands, devices).then(output => netssh.prettyOutput(output));
