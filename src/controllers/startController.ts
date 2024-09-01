import { Context, Telegraf } from 'telegraf';

export default class StartController {
  public async init(bot: Telegraf): Promise<void> {
    bot.start(async (context: Context) => {
      await context.reply('Привет ' + context.from?.first_name + '!');
    });
  }
}
