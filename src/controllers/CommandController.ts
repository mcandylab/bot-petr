import { Context, Telegraf } from 'telegraf';

export default class CommandController {
  public async init(bot: Telegraf): Promise<void> {
    bot.command('register', async (context: Context) => {
      await this.execute(context);
    });
  }

  public async execute(context: Context) {
    const COMMANDS: string[] = [''];

    await context.reply('Hello');
  }
}
