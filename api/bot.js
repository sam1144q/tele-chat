const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

// Use your bot token from environment variables for security
const bot = new Telegraf(process.env.BOT_TOKEN);

// /start command
bot.start((ctx) => {
  ctx.reply('Welcome! 👋\nType /help to see what I can do, Sumit.');
});

// /help command
bot.help((ctx) => {
  ctx.reply('/start - Welcome message\n/help - List commands\n/continue - Let’s have a chat!\n/stopwatch - Sample link');
});

// Custom /stopwatch command
bot.command('stopwatch', (ctx) => {
  ctx.reply('🕒 Here is a useful link: https://github.com/');
});

// /continue command with image and inline buttons
bot.command('continue', async (ctx) => {
  await ctx.reply("Let's continue! How do you feel today?");
  
  // Send image with like/dislike buttons
  const imageUrl = 'https://placekitten.com/400/300';
  await ctx.replyWithPhoto(imageUrl, {
    caption: "Do you like this image?",
    ...Markup.inlineKeyboard([
      [Markup.button.callback('👍 Like', 'like')],
      [Markup.button.callback('👎 Dislike', 'dislike')]
    ])
  });
});

// Handle inline button responses
bot.action('like', async (ctx) => {
  await ctx.answerCbQuery('You liked it!');
  await ctx.reply('❤️ Thanks for the like!');
});

bot.action('dislike', async (ctx) => {
  await ctx.answerCbQuery('You disliked it!');
  await ctx.reply('😢 Sorry to hear that.');
});

// Handle user messages (global)
bot.on('text', (ctx) => {
  const text = ctx.message.text.toLowerCase();
  if (text.includes('good') || text.includes('great')) {
    ctx.reply("Awesome! 😊 Keep it up!");
  } else if (text.includes('bad') || text.includes('not good')) {
    ctx.reply("Sorry to hear that. Hope things get better soon! 💪");
  } else {
    ctx.reply("Thanks for sharing! 🤖");
  }
});

// Export the handler for Vercel serverless function
module.exports = (req, res) => {
  if (req.method === 'POST') {
    bot.handleUpdate(req.body)
      .then(() => res.status(200).send('OK'))
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error');
      });
  } else {
    res.status(200).send('Telegram bot webhook is running');
  }
};
