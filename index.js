const Discord = require("discord.js");

const { error } = require('./utils/message');

const { commands } = require('./commands');
const { getQueue } = require('./queue');
const presence = require('./presence');

const { prefix, token } = require("./config.json");

// Global variables

const client = new Discord.Client();

// Discord connection events

client.once('ready', () => {
    console.log('Ready!');
    presence.reset(client);
});

client.once('reconnecting', () => console.log('Reconnecting!'));

client.once('disconnect', () => console.log('Disconnect!'));

// Discord messages events

client.on('message', async msg => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;

    const command = msg.content.substr(prefix.length).split(' ')[0];
    const serverQueue = await getQueue(msg.guild.id);

    if (Object.keys(commands).indexOf(command) === -1) {
        msg.channel.send(error(`Je ne connais pas la commande \`${command}\` :man_shrugging:`));
        return;
    }

    await commands[command].run(msg, serverQueue);
});

// Discord connection

client.login(token);
