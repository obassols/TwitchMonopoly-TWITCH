const request = require('request');
const serverUrl = 'localhost';
const port = 4000;

function getSquares(game) {
  const url = 'http://' + serverUrl + ':' + port + '/square';
  request(url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    game.squares = body;
    console.log('Squares loaded');
    const index = require('./index');
    index.updateGame(game);
  });
}

async function getGameSquares(id) {
  const url = 'http://' + serverUrl + ':' + port + '/square/game/' + id;
  request(url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    game.squares = body;
    console.log('Squares loaded');
    const index = require('./index');
    index.updateGame(game);
  });
}

function getRents(game) {
  console.log('Getting rents');
  console.log(game.actualSquare);
  
  const url = 'http://' + serverUrl + ':' + port + '/square/' + game.actualSquare.id + '/rent';
  request(url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    game.actualSquare.rents = body;
    console.log(game.actualSquare.rents);
    console.log('Rents loaded');

    const index = require('./index');
    index.updateGame(game);
  });
}

function getCard(game, type) {
  const url = 'http://' + serverUrl + ':' + port + '/card/random/' + type;
  request(url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    game.actualCard = body;
    const monopoly = require('./monopoly');
    monopoly.calcCardActions(game);
  });
}

module.exports = {
  getSquares,
  getGameSquares,
  getRents,
  getCard
};