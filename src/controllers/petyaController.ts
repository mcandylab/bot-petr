import { Context, Telegraf } from 'telegraf';
import ChoiceCommand from '../commands/petya/choiceCommand';
import InfoCommand from '../commands/petya/infoCommand';
import DailyPeopleCommand from '../commands/petya/dailyPeopleCommand';
import RegistrationCommand from '../commands/petya/registrationCommand';
import WhoCommand from '../commands/petya/whoCommand';
import SpeakCommand from '../commands/petya/speakCommand';

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
        }

        // await this.infoCommand.init(context, text);
        // await this.dailyPeopleCommand.init(context, text);
        // await this.registrationCommand.init(context, text);
        // await this.whoCommand.init(context, text);
        // await this.speakCommand.init(context, text);
      }
    });
  }
}
