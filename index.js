const express = require('express');
const mineflayer = require('mineflayer');

// 1. Keep-Alive Web Server (for hosting platforms)
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('AFK Bot is alive!');
});

app.listen(PORT, () => {
  console.log(`Web server listening on port ${PORT}`);
});

// 2. Mineflayer Bot Configuration
const botOptions = {
  host: '162.55.241.186',
  port: 14012,
  username: 'Player_Helper',
  checkTimeoutInterval: 60 * 1000 // Extended to 60s to prevent keepalive timeouts
};

function createBot() {
  const bot = mineflayer.createBot(botOptions);

  bot.on('login', () => {
    console.log(`${bot.username} successfully connected to ${botOptions.host}:${botOptions.port}!`);
  });

  // Random movement loop to prevent AFK kicks
  bot.on('spawn', () => {
    setInterval(() => {
      const actions = ['jump', 'sneak', 'left', 'right', 'forward', 'back'];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      
      if (randomAction === 'jump') {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      } else if (randomAction === 'sneak') {
        bot.setControlState('sneak', true);
        setTimeout(() => bot.setControlState('sneak', false), 1000);
      } else {
        bot.setControlState(randomAction, true);
        setTimeout(() => bot.setControlState(randomAction, false), 1000);
      }
    }, 15000);
  });

  // Handle kicks and disconnects with auto-reconnect
  bot.on('kicked', (reason) => {
    console.log(`Bot kicked for reason: ${reason}`);
  });

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting in 10 seconds...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => {
    console.error(`Bot error: ${err.message}`);
  });
}

// Start the bot
createBot();
