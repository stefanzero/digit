/*
 * 11057 is the port assigned by the Webfaction control panel
 */
const defaultPort = 11057
module.exports = {
  host: process.env.host || 'localhost',
  port: process.env.port || defaultPort
}