const {Telegraf} = require("telegraf");
const {message} = require("telegraf/filters");

const token = "7136982831:AAH1t650rAzUAIRJbMvcn7nTo2gVwOsXuNo";
const bot = new Telegraf(token);
const webAppUrl = "https://gr-131-abi-test-2.oml.ru/";

const functions = require("firebase-functions");
const cors = require("cors")({origin: true});

bot.start((ctx) => {
  ctx.setChatMenuButton(JSON.stringify({
    type: "web_app",
    text: "🕹️ Open app",
    web_app: {url: webAppUrl},
  }));

  return ctx.reply(`HelloHA ${ctx.update.message.from.first_name} ${ctx.chat.id}!`);
});
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on(message("sticker"), (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));

// bot.on(message("text"), async (ctx) => {
//   await ctx.sendMessage("👍");
// });

// exports.sendMessage = functions.https.onRequest((request, response) => {
//   cors(request, response, () => {
//     const text = request.query.message;
//     const chatId = request.query.chatId;
    
//     if (!text || !chatId) {
//       return response.status(400).send("No message or chatId provided");
//     }
//     // Ваш Telegram chat_id
//     bot.telegram.sendMessage(chatId, decodeURIComponent(text))
//       .then(() => {
//         return response.status(200).send("Message sent");
//       })
//       .catch(error => {
//         console.error(error);
//         return response.status(500).send("Failed to send message");
//       });
//   });
// });

// bot.launch();


bot.on('text', (ctx) => {
  ctx.reply("👍");
});

exports.telegramBotWebhook = functions.https.onRequest((request, response) => {
  // NOTE: 'telegraf' обрабатывает 'response' самостоятельно, поэтому вызываем 'return'
  return bot.handleUpdate(request.body, response).then(() => {
    response.end('ok'); // Важно закончить ответ, чтобы Firebase не ждал
  }).catch((error) => {
    console.error('Error handling update:', error);
    response.status(500).end();
  });
});

exports.sendMessage = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const text = request.query.message;
    const chatId = request.query.chatId;
    
    if (!text || !chatId) {
      return response.status(400).send("No message or chatId provided");
    }
    // Ваш Telegram chat_id
    bot.telegram.sendMessage(chatId, decodeURIComponent(text))
      .then(() => {
        return response.status(200).send("Message sent");
      })
      .catch(error => {
        console.error(error);
        return response.status(500).send("Failed to send message");
      });
  });
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
