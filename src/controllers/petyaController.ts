import { Context, Telegraf } from 'telegraf';
import ChoiceCommand from '../commands/petya/choiceCommand';
import InfoCommand from '../commands/petya/infoCommand';
import DailyPeopleCommand from '../commands/petya/dailyPeopleCommand';
import RegistrationCommand from '../commands/petya/registrationCommand';
import WhoCommand from '../commands/petya/whoCommand';
import SpeakCommand from '../commands/petya/speakCommand';
import GuessWordGame from '../commands/petya/guessWordGame';
import DailyPeopleStatsCommand from '../commands/petya/dailyPeopleStatsCommand';
import KickCommand from '../commands/petya/kickCommand';

export default class PetyaController {
  private choiceCommand: ChoiceCommand;
  private infoCommand: InfoCommand;
  private dailyPeopleCommand: DailyPeopleCommand;
  private dailyPeopleStatsCommand: DailyPeopleStatsCommand;
  private registrationCommand: RegistrationCommand;
  private whoCommand: WhoCommand;
  private speakCommand: SpeakCommand;
  private guessWordGame: GuessWordGame;
  private kickCommand: KickCommand;

  constructor() {
    this.choiceCommand = new ChoiceCommand();
    this.infoCommand = new InfoCommand();
    this.dailyPeopleCommand = new DailyPeopleCommand();
    this.dailyPeopleStatsCommand = new DailyPeopleStatsCommand();
    this.registrationCommand = new RegistrationCommand();
    this.whoCommand = new WhoCommand();
    this.speakCommand = new SpeakCommand();
    this.guessWordGame = new GuessWordGame();
    this.kickCommand = new KickCommand();
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
        } else if (text === 'статистика') {
          await this.dailyPeopleStatsCommand.init(context);
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
          const userId = '396620964';
          await this.kickCommand.init(context, userId);
        } else {
          await this.speakCommand.init(context, text);
        }
      }
    });
  }
}
