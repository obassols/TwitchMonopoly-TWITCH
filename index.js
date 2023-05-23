const api = require('./api');
const monopoly = require('./monopoly');
const app = require('express')();
const httpServer = require('http').Server(app);
const port = 3000;
const io = require("socket.io")(httpServer, {
  cors: {
    origin: '*',
  }
});

let channelName = 'oriolbn20';
const basePlayers = [
  {
    id: 1,
    name: 'streamer',
    position: 1,
    money: 1500,
    properties: [],
    cards: [],
    role: 'streamer',
    baseBottom: 4,
    baseRight: 4,
    bottom: 4,
    right: 4,
    jail: false,
    jailTime: 0,
  },
  {
    id: 2,
    name: 'Waiting...',
    position: 1,
    money: -1,
    properties: [],
    cards: [],
    role: 'viewer',
    baseBottom: 4,
    baseRight: 1,
    bottom: 4,
    right: 1,
    jail: false,
    jailTime: 0,
  },
  {
    id: 3,
    name: 'Waiting...',
    position: 1,
    money: -1,
    properties: [],
    cards: [],
    role: 'viewer',
    baseBottom: 1,
    baseRight: 4,
    bottom: 1,
    right: 4,
    jail: false,
    jailTime: 0,
  },
  {
    id: 4,
    name: 'Waiting...',
    position: 1,
    money: -1,
    properties: [],
    cards: [],
    role: 'viewer',
    baseBottom: 1,
    baseRight: 1,
    bottom: 1,
    right: 1,
    jail: false,
    jailTime: 0,
  },
];
const baseGame = {
  id: 1,
  taxes: 0,
  turn: 1,
  squares: [],
  players: basePlayers,
  dice: [0, 0],
  actualPlayer: 0,
  actualSquare: null,
  actualCard: null,
  actions: ['roll', 'forfeit'],
  playing: false,
}
let game = JSON.parse(JSON.stringify(baseGame));
api.getSquares(game);

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

io.on("connection", socket => {
  io.emit('game', game);
  console.log('New connection');

  socket.on('getGame', () => {
    io.emit('game', game);
  });

  socket.on('startGame', () => {
    if (!game.playing) {
      game.playing = true;
      game.players = game.players.filter(p => p.money != -1);
      console.log('Game started');
      io.emit('game', game);
    } else {
      console.log('Game already started');
    }
  });

  socket.on('resetGame', () => {
    game = JSON.parse(JSON.stringify(baseGame));
    api.getSquares(game);
    console.log('Game reseted');
  });

  socket.on('kickPlayer', (id) => {
    const player = game.players.find(p => p.id == id);
    if (player) {
      monopoly.forfeit(game, player);
      console.log('Player kicked');
    } else {
      console.log('Player not found');
    }
    io.emit('game', game);
  });

  socket.on('action', (action) => {
    if (game.playing) {
      if (action.player == game.players[game.actualPlayer].name) {
        if (game.actions.includes(action.action)) {
          console.log('Trying action: ' + action.action);
          switch (action.action) {
            case 'roll':
              monopoly.roll(game);
              break;
            case 'pay':
              monopoly.pay(game, game.players[game.actualPlayer]);
              break;
            case 'buy':
              monopoly.buy(game, game.players[game.actualPlayer]);
              break;
            case 'upgrade':
              monopoly.upgrade(game, game.players[game.actualPlayer]);
              break;
            case 'downgrade':
              monopoly.downgrade(game, game.players[game.actualPlayer]);
              break;
            case 'mortgage':
              monopoly.mortgage(game, game.players[game.actualPlayer]);
              break;
            case 'unmortgage':
              monopoly.unmortgage(game, game.players[game.actualPlayer]);
              break;
            case 'jailcard':
              monopoly.jailcard(game, game.players[game.actualPlayer]);
              break;
            case 'skip':
              monopoly.skip(game);
              break;
            case 'forfeit':
              monopoly.forfeit(game, game.players[game.actualPlayer]);
              break;
            default:
              console.log('Action not found');
              break;
          }
        } else {
          console.log('Action not allowed');
        }
      } else {
        console.log('Not your turn');
      }
    } else {
      console.log('Game not started');
    }
  });
});

function updateGame(game) {
  io.emit('game', game);
}

// #region TWITCH

const tmi = require('tmi.js');
const commands = require('./commands');

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true
  },
  channels: [channelName]
});


client.connect();
console.log('Connecting...');

client.on('message', (channel, tags, message, self) => {
  if (self || !message.startsWith('!m')) {
    console.log(`[MESSAGE] ${tags['display-name']}: ${message}`);
  } else {
    const args = message.slice(2).split(' ');
    const command = args.shift().toLowerCase();
    runCommand(command, args, tags);
  }
});

function runCommand(command, args, tags) {
  switch (args[0]) {
    case 'players':
      commands.players(game.players);
      break;
    case 'join':
      commands.join(game, tags);
      io.emit('game', game);
      break;
    case 'leave':
      if (isPlayer(tags)) {
        commands.leave(game, tags);
        io.emit('game', game);
      }
      break;
    case 'roll':
      if (isPlayer(tags) && game.actions.includes('roll')) {
        commands.roll(game, tags);
      }
      break;
    case 'pay':
      if (isPlayer(tags) && game.actions.includes('pay')) {
        commands.pay(game, tags);
      }
      break;
    case 'buy':
      if (isPlayer(tags) && game.actions.includes('buy')) {
        commands.buy(game, tags, args);
      }
      break;
    case 'upgrade':
      if (isPlayer(tags) && game.actions.includes('upgrade')) {
        commands.upgrade(game, tags);
      }
      break;
    case 'downgrade':
      if (isPlayer(tags) && game.actions.includes('downgrade')) {
        commands.downgrade(game, tags);
      }
      break;
    case 'mortgage':
      if (isPlayer(tags) && game.actions.includes('mortgage')) {
        commands.mortgage(game, tags, args);
      }
      break;
    case 'unmortgage':
      if (isPlayer(tags) && game.actions.includes('unmortgage')) {
        commands.unmortgage(game, tags, args);
      }
      break;
    case 'skip':
      if (isPlayer(tags) && game.actions.includes('skip')) {
        commands.skip(game, tags);
      }
      break;
    case 'forfeit':
      if (isPlayer(tags) && game.actions.includes('forfeit')) {
        commands.forfeit(game, tags);
      }
      break;
    default:
      console.log(`[SERVER] Unknown command: !m ${args[0]}`);
      break;
  }
}

function isPlayer(tags) {
  const name = tags['display-name'].toLowerCase();
  console.log('[SERVER] Player: ' + name);
  const player = game.players.filter(p => p.name == name)[0];
  if (player) {
    return true;
  } else {
    console.log('[SERVER] Player not in game');
    return false;
  }
}

// #endregion

module.exports = {
  updateGame,
}