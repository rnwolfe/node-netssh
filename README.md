# netssh

This is a Node.js module for connecting to network devices and issuing show commands.

Given this was mainly for personal use, and is pretty rudimentary (no configuration mode), it is not published on NPM.

Ultimately, this a simiple wrapper of `node-ssh` which is a Promise-wrapper for `SSH2` in Node.js.

# Docs

[Please view the documentation here](https://rnwolfe.github.io/node-netssh/).

# Usage

You can then send commands to devices using `NetSSH.send()`. `send()` expects two parameters: an **array** of commands, and an **array** of sessions.

Sessions are created using `NetSSH.session()` which expects an object containing a `host`, `username`, and `password`. This returns a session object.

Below are some examples.

## Single Device

```javascript
const NetSSH = require('./');
const netssh = new NetSSH();

const password = 'cisco';

const device = [
  netssh.session({
    host: 'devcsr1.lab.com',
    username: 'admin',
    password: password
  })
];

const command = ['show clock'];

netssh.send(command, device).then(output => console.log(output));
```

## Multiple Devices

```javascript
const NetSSH = require('./');
const netssh = new NetSSH();

const password = 'cisco';

const devices = [
  netssh.session({ host: 'devcsr1.lab.com', username: 'admin', password: password }),
  netssh.session({ host: 'devcsr2.lab.com', username: 'admin', password: password }),
  netssh.session({ host: 'devcsr3.lab.com', username: 'admin', password: password }),
  netssh.session({ host: 'prodcsr1.lab.com', username: 'admin', password: password }),
  netssh.session({ host: 'prodcsr2.lab.com', username: 'admin', password: password }),
  netssh.session({ host: 'prodcsr3.lab.com', username: 'admin', password: password })
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

netssh.send(commands, devices).then(output => console.log(output));
```
