const {Telegraf} = require("telegraf");

const token = "7136982831:AAH1t650rAzUAIRJbMvcn7nTo2gVwOsXuNo";
const bot = new Telegraf(token);
const url = 'https://us-central1-test-tg-bot-bbe95.cloudfunctions.net/telegramBotWebhook';

bot.telegram.setWebhook(url).then((result) => {
    console.log("Webhook set to:", url);
    console.log(result);
}).catch(console.error);