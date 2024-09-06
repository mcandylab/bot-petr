import { Context, Telegraf } from 'telegraf';
import ChoiceCommand from '../commands/petya/choiceCommand';
import InfoCommand from '../commands/petya/infoCommand';
import DailyPeopleCommand from '../commands/petya/dailyPeopleCommand';
import RegistrationCommand from '../commands/petya/registrationCommand';
import WhoCommand from '../commands/petya/whoCommand';
import SpeakCommand from '../commands/petya/speakCommand';
import * as repl from 'node:repl';

export default class PetyaController {
  private choiceCommand: ChoiceCommand;
  private infoCommand: InfoCommand;
  private dailyPeopleCommand: DailyPeopleCommand;
  private registrationCommand: RegistrationCommand;
  private whoCommand: WhoCommand;
  private speakCommand: SpeakCommand;

  constructor() {
    this.choiceCommand = new ChoiceCommand();
    this.infoCommand = new InfoCommand();
    this.dailyPeopleCommand = new DailyPeopleCommand();
    this.registrationCommand = new RegistrationCommand();
    this.whoCommand = new WhoCommand();
    this.speakCommand = new SpeakCommand();
  }

  public async init(bot: Telegraf) {
    bot.hears(/^[Пп]етя/, async (context: Context) => {
      if (context.text) {
        const text = context.text.substring(4).trim();

        console.log('text: ' + text);

        if (text.startsWith('выбери')) {
          const command = text.substring(6).trim();
          await this.choiceCommand.init(context, command);
        } else if (text.startsWith('кто')) {
          const command = text.substring(3).trim();
          await this.whoCommand.init(context, command);
        } else if (text === 'найди пидора') {
          await this.dailyPeopleCommand.init(context);
        } else if (text === 'регистрация') {
          await this.registrationCommand.init(context);
        } else if (text.startsWith('инфа')) {
          const command = text.substring(4).trim();
          await this.infoCommand.init(context, command);
        } else if (text === 'удали неактивных') {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          await context.reply('Начинаю поиск неактивных...');
          await new Promise((resolve) => setTimeout(resolve, 3000));
          await context.reply(
            'Ага, попались! В следующий раз будьте активнее!',
          );
          await new Promise((resolve) => setTimeout(resolve, 3000));
          await context.telegram.banChatMember(-1002155745099, 457697191);
          await new Promise((resolve) => setTimeout(resolve, 3000));
          await context.telegram.banChatMember(-1002155745099, 566282848);
          await new Promise((resolve) => setTimeout(resolve, 3000));
          await context.reply('Хотя для вас уже следующего раза не будет!');
        } else {
          await this.speakCommand.init(context, text);
        }
      }
    });
  }
}
