const { prefix } = require("./config.json");

module.exports = {
    reset: (client) => client.user.setActivity(`${prefix}help`, { type: 'PLAYING' }),
    listening: (client, text) => client.user.setActivity(text, { type: 'LISTENING' })
};
