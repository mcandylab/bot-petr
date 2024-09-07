import { Context, Telegraf } from 'telegraf';
import ChoiceCommand from '../commands/petya/choiceCommand';
import InfoCommand from '../commands/petya/infoCommand';
import DailyPeopleCommand from '../commands/petya/dailyPeopleCommand';
import RegistrationCommand from '../commands/petya/registrationCommand';
import WhoCommand from '../commands/petya/whoCommand';
import SpeakCommand from '../commands/petya/speakCommand';
import GuessWordGame from '../commands/petya/guessWordGame';
import * as console from 'node:console';

export default class PetyaController {
  private choiceCommand: ChoiceCommand;
  private infoCommand: InfoCommand;
  private dailyPeopleCommand: DailyPeopleCommand;
  private registrationCommand: RegistrationCommand;
  private whoCommand: WhoCommand;
  private speakCommand: SpeakCommand;
  private guessWordGame: GuessWordGame;

  constructor() {
    this.choiceCommand = new ChoiceCommand();
    this.infoCommand = new InfoCommand();
    this.dailyPeopleCommand = new DailyPeopleCommand();
    this.registrationCommand = new RegistrationCommand();
    this.whoCommand = new WhoCommand();
    this.speakCommand = new SpeakCommand();
    this.guessWordGame = new GuessWordGame();
  }

  public async init(bot: Telegraf) {
    bot.hears(/^[Пп]етя/, async (context: Context) => {
      if (context.text) {
        const text = context.text.substring(4).trim();

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
        } else if (text === 'поле чудес') {
          await this.guessWordGame.init(context);
        } else if (text.startsWith('буква')) {
          const command = text.substring(5).trim();
          if (command && command.length === 1 && /^[а-яА-ЯёЁ]$/.test(command)) {
            await this.guessWordGame.guessWord(context, command);
          }
        } else if (text.startsWith('слово')) {
          const command = text.substring(5).trim();

          const parts = command.split(' ');

          if (parts.length === 1 && /^[а-яА-ЯёЁ]+$/.test(parts[0])) {
            await this.guessWordGame.guessWholeWord(context, command);
          }
        } else if (text.startsWith('инфа')) {
          const command = text.substring(4).trim();
          await this.infoCommand.init(context, command);
        } else if (text === 'удали неактивных') {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          await context.reply(
            'Да не братан, я прошерстил список чувачков, все активные, некого удалять...',
          );
          // await context.reply('Начинаю поиск неактивных...');
          // await new Promise((resolve) => setTimeout(resolve, 3000));
          // await context.reply(
          //   'Ага, попались! В следующий раз будьте активнее!',
          // );
          // await new Promise((resolve) => setTimeout(resolve, 3000));
          // await context.telegram.banChatMember(-1002155745099, 457697191);
          // await new Promise((resolve) => setTimeout(resolve, 3000));
          // await context.telegram.banChatMember(-1002155745099, 566282848);
          // await new Promise((resolve) => setTimeout(resolve, 3000));
          // await context.reply('Хотя для вас уже следующего раза не будет!');
        } else {
          await this.speakCommand.init(context, text);
        }
      }
    });
  }
}
