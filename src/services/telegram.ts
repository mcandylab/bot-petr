import { Telegraf } from 'telegraf';
import StartController from '../controllers/startController';
import PetyaController from '../controllers/petyaController';
import CommandController from '../controllers/commandController';
import AnswerController from '../controllers/answerController';
import AutoRegistrationController from '../controllers/autoRegistrationController';

export default class Telegram {
  private readonly bot: Telegraf;
  private readonly startController: StartController;
  private readonly petyaController: PetyaController;
  private readonly commandController: CommandController;
  private readonly answerController: AnswerController;
  private readonly autoRegistrationController: AutoRegistrationController;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN as string);
    this.startController = new StartController();
    this.petyaController = new PetyaController();
    this.commandController = new CommandController();
    this.answerController = new AnswerController();
    this.autoRegistrationController = new AutoRegistrationController();
  }

  public async init(): Promise<void> {
    await this.bot.telegram.setMyCommands([
      {
        command: 'commands',
        description: 'Получить список доступных команд',
      },
    ]);

    await this.autoRegistrationController.init(this.bot);
    await this.startController.init(this.bot);
    await this.petyaController.init(this.bot);
    await this.commandController.init(this.bot);
    await this.answerController.init(this.bot);
  }

  public async start(): Promise<void> {
    this.bot.launch().then(() => {
      return;
    });

    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }
}
