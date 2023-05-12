function join(players, tags) {
  if (!players.includes(tags['display-name'].toLowerCase())) {
    if (players.length < 3) {
      players.push(tags['display-name'].toLowerCase());
      console.log('Added player: ' + tags['display-name'].toLowerCase());
      console.log(players);
    } else {
      console.log('Cannot add more players');
    }
  } else {
    console.log('Player already in list');
  }
}

function leave(players, tags) {
  if (players.includes(tags['display-name'].toLowerCase())) {
    players.splice(players.indexOf(tags['display-name'].toLowerCase()), 1);
    console.log('Removed player: ' + tags['display-name'].toLowerCase());
    console.log(players);
  } else {
    console.log('Player not in list');
  }
}

function players(players, tags) {
  if (players.length > 0) {
    console.log('Players: ' + players);
  } else {
    console.log('No players');
  }
}

function buy (players, tags, args) {
  if (players.includes(tags['display-name'].toLowerCase())) {
    console.log('Player is in list');
    console.log('Player: ' + tags['display-name'].toLowerCase());
    console.log('Item: ' + args[0]);
  } else {
    console.log('Player is not in list');
  }
}

function sell (players, tags, args) {
  if (players.includes(tags['display-name'].toLowerCase())) {
    console.log('Player is in list');
    console.log('Player: ' + tags['display-name'].toLowerCase());
    console.log('Item: ' + args[0]);
  } else {
    console.log('Player is not in list');
  }
}


module.exports = {
  join,
  leave,
  players,
  buy,
  sell
};