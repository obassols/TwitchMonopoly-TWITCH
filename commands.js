const monopoly = require('./monopoly');

function players(players) {
  if (players.length > 0) {
    console.log('Players: ' + players);
  } else {
    console.log('No players');
  }
}

function join(game, tags) {
  const name = tags['display-name'].toLowerCase();
  if (game.players.filter(p => p.name == name).length == 0) {
    const missingPlayers = game.players.filter(p => p.money == -1).length;
    if (!game.playing && missingPlayers > 0) {
      const player = game.players[game.players.length - missingPlayers];
      player.name = name;
      player.money = 1500;
      console.log('Added player: ' + player.name);
      if (missingPlayers == 1) {
        console.log('Starting game');
        game.playing = true;
      }
    } else {
      console.log('Cannot add more players');
    }
  } else {
    console.log('Player already in list');
  }
}

function leave(game, tags) {
  if (!game.playing) {
    const name = tags['display-name'].toLowerCase();
    const playerIndex = game.players.findIndex(p => p.name == name);
    game.players[playerIndex].name = 'Waiting...';
    game.players[playerIndex].money = -1;
    console.log('Removed player: ' + name);
  } else {
    console.log('Game is already started');
  }
}

function roll(game, tags) {
  const player = isActualPlayer(game, tags);
  if (player) {
    monopoly.roll(game);
  }
}

function pay(game, tags) {
  const player = isActualPlayer(game, tags);
  if (player) {
    monopoly.pay(game, player);
  }
}

function buy(game, tags) {
  const player = isActualPlayer(game, tags);
  if (player) {
    monopoly.buy(game, player);
  }
}

function upgrade(game, tags) {
  const player = isActualPlayer(game, tags);
  if (player) {
    monopoly.upgrade(game, player);
  }
}

function downgrade(game, tags) {
  const player = isActualPlayer(game, tags);
  if (player) {
    monopoly.downgrade(game, player);
  }
}

function mortgage(game, tags) {
  const player = isActualPlayer(game, tags);
  if (player) {
    monopoly.mortgage(game, player);
  }
}

function unmortgage(game, tags) {
  const player = isActualPlayer(game, tags);
  if (player) {
    monopoly.unmortgage(game, player);
  }
}

function jailcard(game, tags) {
  const player = isActualPlayer(game, tags);
  if (player) {
    monopoly.jailcard(game, player);
  }
}

function skip(game, tags) {
  const player = isActualPlayer(game, tags);
  if (player) {
    monopoly.skip(game);
  }
}

function forfeit(game, tags) {
  const player = isActualPlayer(game, tags);
  if (player) {
    game.players = game.players.filter(p => p.id != player.id);
    if (game.actualPlayer > game.players.length - 1) {
      game.actualPlayer = 0;
    }
    console.log('Player forfeit: ' + player.name);
    const index = require('./index');
    index.updateGame(game);
  }
}

function isActualPlayer(game, tags) {
  const player = game.players.filter(p => p.name == tags['display-name'].toLowerCase())[0];
  if (player) {
    console.log('Player: ' + player.name);
    if (game.players[game.actualPlayer].id == player.id) {
      return player;
    } else {
      console.log('Not your turn');
    }
  } else {
    console.log('Player is not in list');
  }
  return null;
}

module.exports = {
  players,
  join,
  leave,
  roll,
  pay,
  buy,
  upgrade,
  downgrade,
  mortgage,
  unmortgage,
  jailcard,
  skip,
  forfeit
};