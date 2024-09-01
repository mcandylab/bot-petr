import { Context, Telegraf } from 'telegraf';
import ChoiceCommand from '../commands/petya/choiceCommand';
import InfoCommand from '../commands/petya/infoCommand';

export default class PetyaController {
  private choiceCommand: ChoiceCommand;
  private infoCommand: InfoCommand;

  constructor() {
    this.choiceCommand = new ChoiceCommand();
    this.infoCommand = new InfoCommand();
  }

  public async init(bot: Telegraf) {
    bot.hears(/^[Пп]етя/, async (context: Context) => {
      if (context.text) {
        const text = context.text.trim();

        // Проверяем, если команда просто "Петя" или "петя"
        if (text === 'Петя' || text.toLowerCase() === 'петя') {
          await context.reply('Шо');
          return;
        }

        await this.choiceCommand.init(context, text);
        await this.infoCommand.init(context, text);
      }
    });
  }

  public async execute() {}
}
