import { Context, Telegraf } from 'telegraf';
import Registration from './registration';
import DailyPeople from './dailyPeople';

export default class Telegram {
  private bot: Telegraf;
  private registration: Registration;
  private dailyPeople: DailyPeople;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN as string);
    this.registration = new Registration();
    this.dailyPeople = new DailyPeople();
  }

  public async init(): Promise<void> {
    await this.bot.telegram.setMyCommands([
      { command: 'start', description: 'Начало работы с ботом' },
      { command: 'register', description: 'Зарегистрироваться в боте' },
      { command: 'pidor', description: 'Выбрать пидора дня' },
    ]);

    this.bot.start((context: Context) => {
      context.reply('Привет ' + context.from?.first_name + '!');
    });

    this.bot.command('register', async (context: Context) => {
      await this.registration.execute(context);
    });

    this.bot.command('pidor', async (context: Context) => {
      await this.dailyPeople.execute(context);
    });
  }

  public async start(): Promise<void> {
    this.bot.launch().then(() => {});

    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }
}
