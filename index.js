const express = require('express');
const mineflayer = require('mineflayer');

// Keeps cloud hosting active
const app = express();
app.get('/', (req, res) => res.send('Bot is online 24/7!'));
app.listen(process.env.PORT || 3000, () => console.log('Web server running.'));

// === YOUR SERVER DETAILS ===
const SERVER_HOST = 'tigersmpforboys.mcsh.io'; 
const SERVER_PORT = 14012; // Your actual server port from the console log
const BOT_USERNAME = 'Player_Helper';         

function createBot() {
  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    auth: 'offline',
    version: '1.20.4' // Paper 1.20.4 confirmed in server console
  });

  bot.once('spawn', () => {
    console.log(`${bot.username} joined ${SERVER_HOST}!`);

    // HUMAN-LIKE ANTI-AFK
    setInterval(() => {
      if (!bot.entity) return;

      const action = Math.floor(Math.random() * 3);

      if (action === 0) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 400);
      } else if (action === 1) {
        bot.setControlState('sneak', true);
        setTimeout(() => bot.setControlState('sneak', false), 800);
      } else {
        const yaw = (Math.random() * 3.14) - 1.57;
        const pitch = (Math.random() * 1) - 0.5;
        bot.look(yaw, pitch, true);
      }
    }, 15000);
  });

  bot.on('end', (reason) => {
    console.log(`Disconnected (${reason}). Reconnecting in 10 seconds...`);
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => console.log('Bot error:', err.message));
}

createBot();
