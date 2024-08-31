import { Context, Telegraf } from 'telegraf';

export default class Telegram {
  private bot: Telegraf;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN as string);
  }

  public async init(): Promise<void> {
    this.bot.start((ctx: Context) => {
      ctx.reply('Привет ' + ctx.from?.first_name + '!');
    });
  }

  public async start(): Promise<void> {
    this.bot.launch().then(() => {});

    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }
}
