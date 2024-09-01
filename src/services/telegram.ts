import { Context, Telegraf } from 'telegraf';
import Registration from './registration';

export default class Telegram {
  private bot: Telegraf;
  private registration: Registration;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN as string);
    this.registration = new Registration();
  }

  public async init(): Promise<void> {
    this.bot.start((context: Context) => {
      context.reply('Привет ' + context.from?.first_name + '!');
    });

    this.bot.command('register', async (context: Context) => {
      await this.registration.execute(context);
    });
  }

  public async start(): Promise<void> {
    this.bot.launch().then(() => {});

    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }
}
