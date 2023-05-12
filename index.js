const app = require('express')();
const httpServer = require('http').Server(app);
const port = 3000;

let game = {
  id: 1,
  taxes: 0,
  turn: 1,
  players: [],
  squares: [],
  dice: 0,
  actualPlayer: null,
  actualSquare: null,
  actualCard: null,
}

const io = require("socket.io")(httpServer, {
  cors: {
    origin: '*',
  }
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

io.on("connection", socket => {
  console.log('New connection');
  io.emit('players', game.players);

  socket.on('getPlayers', () => {
    io.emit('players', game.players);
  });

  socket.on('getGame', () => {
    io.emit('game', game);
  });

  socket.on('setGame', (newGame) => {
    game = newGame;
    console.log('Game updated');
    console.log(game);
    io.emit('game', game);
  });
});



// #region TWITCH

const CHANNEL_NAME = 'oriolbn20';
const tmi = require('tmi.js');
const commands = require('./commands');

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true
  },
  channels: [CHANNEL_NAME]
});


client.connect();
console.log('Connecting...');

client.on('message', (channel, tags, message, self) => {
  if (self || !message.startsWith('!m')) {
    console.log(`${tags['display-name']}: ${message}`);
  } else {
    const args = message.slice(2).split(' ');
    const command = args.shift().toLowerCase();
    runCommand(command, args, tags);
  }
});

function runCommand(command, args, tags) {
  switch (command) {
    case 'players':
      commands.players(game.players, tags);
      break;
    case 'join':
      commands.join(game.players, tags);
      io.emit('players', game.players);
      io.emit('game', game);
      break;
    case 'leave':
      if (isPlayer(tags)) {
        commands.leave(game.players, tags);
        io.emit('players', game.players);
        io.emit('game', game);
      }
      break;
    case 'roll':
      if (isPlayer(tags)) {
        commands.roll(game.players, tags);
      }
      break;
    case 'buy':
      if (isPlayer(tags)) {
        commands.buy(game.players, tags, args);
      }
      break;
    case 'sell':
      if (isPlayer(tags)) {
        commands.sell(game.players, tags, args);
      }
      break;
    default:
      console.log(`[SERVER] Unknown command: ${command}`);
      break;
  }
}

function isPlayer(tags) {
  if (game.players.includes(tags['display-name'].toLowerCase())) {
    return true;
  } else {
    console.log('[SERVER] Player not in list');
    return false;
  }
}

// #endregion