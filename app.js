const NetSSH = require('./index');
const netssh = new NetSSH();

const password = 'cisco';

const single = [
  netssh.session({
    host: 'devcsr1.ironbowlab.com',
    username: 'admin',
    password: password
  })
];

const multiple = [
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

netssh.send(commands, single).then(output => console.log(output));
netssh.send(commands, multiple).then(output => netssh.prettyOutput(output));
