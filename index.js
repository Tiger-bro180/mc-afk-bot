const express = require('express');
const mineflayer = require('mineflayer');

// Keeps cloud hosting active
const app = express();
app.get('/', (req, res) => res.send('Bot is online 24/7!'));
app.listen(process.env.PORT || 3000, () => console.log('Web server running.'));

// === YOUR SERVER DETAILS ===
const SERVER_HOST = 'tigersmpforboys.mcsh.io'; 
const SERVER_PORT = 25565;                     
const BOT_USERNAME = 'Player_Helper';         

function createBot() {
  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    version: '1.20.4',
  });

  bot.once('spawn', () => {
    console.log(`${bot.username} joined tigersmpforboys.mcsh.io!`);

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

  bot.on('end', () => {
    console.log('Disconnected. Reconnecting in 10 seconds...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => console.log('Bot error:', err));
}

createBot();
