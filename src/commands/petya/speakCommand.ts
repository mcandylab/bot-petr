import { Context } from 'telegraf';
import axios from 'axios';

export default class SpeakCommand {
  public async init(context: Context, text: string): Promise<void> {
    if (text.toLowerCase().startsWith('петя')) {
      const command = text.substring(4).trim();

      if (!command) {
        await context.reply('Шо');
        return;
      }

      const message = await this.execute(command);
      await context.reply(message);
    }
  }

  private async execute(string: string): Promise<string> {
    return await axios
      .post('https://chat.mcandylab.ru/chat', {
        text: string,
      })
      .then(({ data }) => {
        return data.response;
      })
      .catch(() => {
        console.log('ошибка');
        return '';
      });
  }
}
