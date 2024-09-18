
const { accountInfo } = require('./AccountConfig');

const {write, read} = accountInfo.loggerConfig;

const { createClient } = require('@clickhouse/client');

const client = createClient({
  host: `http://${write.ip}:${write.port}`,
  username: write.userName,
  password: write.password,
  database: write.dataBaseName
})

module.exports = {
  client
}
