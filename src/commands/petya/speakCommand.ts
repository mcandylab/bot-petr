import { Context } from 'telegraf';
import axios from 'axios';

export default class SpeakCommand {
  public async init(context: Context, command: string): Promise<void> {
    if (!command) {
      await context.reply('Шо');
      return;
    }

    const message = await this.execute(command);
    await context.reply(message);
    return;
  }

  private async execute(string: string): Promise<string> {
    return await axios
      .post('https://chat.mcandylab.ru/chat', {
        text: string,
      })
      .then(({ data }) => {
        return data.response;
      })
      .catch((reason) => {
        console.log('Ошибка от c.ai', reason);
        return '';
      });
  }
}
