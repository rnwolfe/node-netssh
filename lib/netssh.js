const Device = require('./models/device');
const Session = require('./models/session');

class NetSSH {
  constructor() {
    this.devices = [];
    this.sessions = [];
  }

  session(config) {
    const device = new Device(config);
    const session = new Session(device);
    this.devices.push(device);
    this.sessions.push(session);
    return session;
  }

  connect(session) {
    const device = session.device;
    return session.ssh.connect({
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
    });
  }

  async send_command(command, session) {
    const conn = await this.connect(session);
    const results = await conn.execCommand(command);
    const output = results.stdout;
    await conn.dispose();
    return output;
  }

  async send_commands(commands, session) {
    const output = {};
    await this.asyncForEach(commands, async command => {
      output[command] = await this.send_command(command, session);
    });
    return output;
  }

  async send_commands_to_multi(commands, sessions) {
    const output = {};
    await this.asyncForEach(sessions, async session => {
      const host = session.device.host;
      const results = await this.send_commands(commands, session);
      output[host] = results;
    });
    return output;
  }

  async send(commands, sessions) {
    const output = {};
    await this.asyncForEach(sessions, async session => {
      const host = session.device.host;
      const results = await this.send_commands(commands, session);
      output[host] = results;
    });
    return output;
  }

  async send_to_multi(command, sessions) {
    const output = {};
    await this.asyncForEach(sessions, async session => {
      const results = await this.send_command(command, session);
      const host = session.device.host;
      output[host] = {};
      output[host][command] = results;
    });
    return output;
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  prettyOutput(output) {
    Object.keys(output).forEach(device => {
      console.log(device.toUpperCase());
      const commands = output[device];
      Object.keys(commands).forEach(command => {
        console.log('\t' + command);
        commands[command].split('\n').forEach(line => {
          console.log('\t\t' + line);
        });
      });
      console.log('\n-------------------------------------------------------------------------\n');
    });
  }
}

module.exports = NetSSH;
