node_ssh = require('node-ssh');
// ssh = new node_ssh();

const password = 'cisco';

devices = [
  { host: 'devcsr1.ironbowlab.com', username: 'admin', password: 'cisco', ssh: new node_ssh() },
  { host: 'devcsr2.ironbowlab.com', username: 'admin', password: 'cisco', ssh: new node_ssh() },
  { host: 'devcsr3.ironbowlab.com', username: 'admin', password: 'cisco', ssh: new node_ssh() },
  { host: 'prodcsr1.ironbowlab.com', username: 'admin', password: 'cisco', ssh: new node_ssh() },
  { host: 'prodcsr2.ironbowlab.com', username: 'admin', password: 'cisco', ssh: new node_ssh() },
  { host: 'prodcsr3.ironbowlab.com', username: 'admin', password: 'cisco', ssh: new node_ssh() }
];

let i = 0;
let connections = [];

devices.forEach(device =>
  connections.push(
    device.ssh.connect({
      host: device.host,
      username: device.username,
      port: 22,
      password: device.password,
      tryKeyboard: true,
      onKeyboardInteractive: (name, instructions, instructionsLang, prompts, finish) => {
        if (prompts.length > 0 && prompts[0].prompt.toLowerCase().includes('password')) {
          finish([device.password]);
        }
      }
    })
  )
);

Promise.all(connections)
  .then(results => {
    connections = results;
    console.log('connections theoretically completed..');
    return Promise.all(
      connections.map(conn => {
        return conn.execCommand('show run | i hostname');
      })
    );
  })
  .then(output => output.forEach(out => console.log(out)))
  .then(() => {
    console.log('closing connections');
    return Promise.all(connections.map(conn => conn.dispose()));
  })
  .catch(error => {
    console.error(error);
    console.log('closing connections');
    return Promise.all(connections.map(conn => conn.dispose()));
  });
