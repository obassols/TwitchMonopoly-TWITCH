const https = require('https');
require("dotenv").config();

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_ACCESS_TOKEN = process.env.TWITCH_ACCESS_TOKEN;
const CHANNEL_NAME = 'oriolbn20';
const NUM_MESSAGES = 100;

const options = {
  hostname: 'api.twitch.tv',
  path: `/v5/chat/${CHANNEL_NAME}/comments?client_id=${TWITCH_CLIENT_ID}&video_id=&content_offset_seconds=&cursor=&limit=${NUM_MESSAGES}`,
  headers: {
    'Authorization': `Bearer ${TWITCH_ACCESS_TOKEN}`,
    'Client-ID': TWITCH_CLIENT_ID
  }
};

https.get(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
    console.log(data);
  });

/*   res.on('end', () => {
    const messages = JSON.parse(data).comments;
    for (let i = 0; i < messages.length; i++) {
      console.log(`${messages[i].created_at} - ${messages[i].commenter.display_name}: ${messages[i].message}`);
    }
  }); */

}).on('error', (err) => {
  console.error(`Error: ${err.message}`);
});