const Device = require('./models/device');
const Session = require('./models/session');

/**
 * A class to handle the simple execution of commands against network devices.
 *
 * @author Ryan Wolfe <ryan.wolfe@ironbow.com>
 *
 * @example <caption>A single device</caption>
 * const device = [
 *   netssh.session({
 *     host: 'devcsr1.lab.com',
 *     username: 'admin',
 *     password: password
 *   })
 * ];
 *
 * netssh.send(['show clock', 'show ip route'], device).then(output => console.log(output));
 *
 * @example <caption>Multiple devices</caption>
 * const devices = [
 *   netssh.session({ host: 'devcsr1.lab.com', username: 'admin', password: password }),
 *   netssh.session({ host: 'devcsr2.lab.com', username: 'admin', password: password }),
 *   netssh.session({ host: 'devcsr3.lab.com', username: 'admin', password: password }),
 *   netssh.session({ host: 'prodcsr1.lab.com', username: 'admin', password: password }),
 *   netssh.session({ host: 'prodcsr2.lab.com', username: 'admin', password: password }),
 *   netssh.session({ host: 'prodcsr3.lab.com', username: 'admin', password: password })
 * ];
 *
 * netssh.send(['show clock', 'show ip route'], devices).then(output => console.log(output));
 *
 * @class NetSSH
 */
class NetSSH {
  constructor() {
    this.devices = [];
    this.sessions = [];
  }

  /**
   * Creates a session.
   *
   * @param {object} config
   * @param {string} config.host Device hostname or IP address.
   * @param {string} config.username Device username.
   * @param {string} config.password Device password.
   * @returns {object} A session object.
   * @example <caption>A single device</caption>
   * const device = [
   *   netssh.session({
   *     host: 'devcsr1.lab.com',
   *     username: 'admin',
   *     password: password
   *   })
   * ];
   *
   * @example <caption>Multiple devices</caption>
   * const devices = [
   *   netssh.session({ host: 'devcsr1.lab.com', username: 'admin', password: password }),
   *   netssh.session({ host: 'devcsr2.lab.com', username: 'admin', password: password }),
   *   netssh.session({ host: 'devcsr3.lab.com', username: 'admin', password: password }),
   *   netssh.session({ host: 'prodcsr1.lab.com', username: 'admin', password: password }),
   *   netssh.session({ host: 'prodcsr2.lab.com', username: 'admin', password: password }),
   *   netssh.session({ host: 'prodcsr3.lab.com', username: 'admin', password: password })
   * ];
   *
   * @memberof NetSSH
   */
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

  /**
   * Sends commands to a set of sessions.
   *
   * @param {array} commands An array of commands to send.
   * @param {array} sessions An array of session objects.
   * @returns {object} An object containing the results of the commands per-session.
   * @example <caption>A single device</caption>
   *
   * const single = [
   *   netssh.session({
   *     host: 'devcsr1.lab.com',
   *     username: 'admin',
   *     password: password
   *   })
   * ];
   *
   * const commands = [
   *   'show run | i hostname',
   *   'show clock'
   * ];
   *
   * netssh.send(commands, single).then(output => console.log(output));
   *
   * // output
   * { 'devcsr1.lab.com': {
   *     'show run | i hostname': 'hostname devcsr1',
   *     'show clock': '*20:57:32.008 UTC Tue Jun 4 2019'
   * }
   * @memberof NetSSH
   */
  async send(commands, sessions) {
    const output = {};
    await this.asyncForEach(sessions, async session => {
      const host = session.device.host;
      const results = await this.send_commands(commands, session);
      output[host] = results;
    });
    return output;
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
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
