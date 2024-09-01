import { Telegraf } from 'telegraf';
import RegistrationController from '../controllers/registrationController';
import StartController from '../controllers/startController';
import PetyaController from '../controllers/petyaController';

export default class Telegram {
  private readonly bot: Telegraf;
  private readonly startController: StartController;
  private readonly registrationController: RegistrationController;
  private readonly petyaController: PetyaController;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN as string);
    this.startController = new StartController();
    this.registrationController = new RegistrationController();
    this.petyaController = new PetyaController();
  }

  public async init(): Promise<void> {
    await this.startController.init(this.bot);
    await this.registrationController.init(this.bot);
    await this.petyaController.init(this.bot);
  }

  public async start(): Promise<void> {
    this.bot.launch().then(() => {
      return;
    });

    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }
}
