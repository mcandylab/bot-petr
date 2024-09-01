import './config/env';
import Telegram from './services/telegram';

const bot = new Telegram();

bot.init().then(() => {
  bot.start().then(() => {});
});
