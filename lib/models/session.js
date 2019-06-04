const node_ssh = require('node-ssh');

class Session {
  constructor(device) {
    this.device = device;
    this.ssh = new node_ssh();
  }
}

module.exports = Session;
