/* const https = require('https');
require("dotenv").config();
 */
/* const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_ACCESS_TOKEN = process.env.TWITCH_ACCESS_TOKEN; */
const CHANNEL_NAME = 'oriolbn20';
const players = [];
const tmi = require('tmi.js');

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true
  },
  channels: [CHANNEL_NAME]
});


client.connect();
console.log('Connected');

client.on('message', (channel, tags, message, self) => {
  if (self || !message.startsWith('!')) {
    console.log(`${tags['display-name']}: ${message}`);
    if (players.includes(tags['display-name'].toLowerCase())) {
      console.log('Is a player');
    } else {
      console.log('Is not a player');
    }
  } else {
    const args = message.slice(1).split(' ');
    const command = args.shift().toLowerCase();
    runCommand(command, args, tags);
  }
});

function runCommand(command, args, tags) {
  if (command === 'join') {
    if (!players.includes(tags['display-name'].toLowerCase())) {
      if (players.length < 4) {
        players.push(tags['display-name'].toLowerCase());
        console.log('Added player' + tags['display-name'].toLowerCase());
        console.log(players);
      } else {
        console.log('Cannot add more players');
      }
    } else {
      console.log('Player already in list');
    }
  }
}