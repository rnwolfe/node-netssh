class Device {
  constructor(config = { host, username, password, type }) {
    const defaults = { type: 'generic' };
    config = { ...config, ...defaults };
    if (!config.host) throw new Error('Hostname is required.');
    if (!config.username) throw new Error('Username is required.');
    if (!config.password) throw new Error('Password is required.');

    this.host = config.host;
    this.username = config.username;
    this.password = config.password;
    this.type = config.type;
  }
}

module.exports = Device;
