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

  private async execute(text: string): Promise<string> {
    try {
      const response = await axios.request({
        method: 'POST',
        url: 'https://chat.mcandylab.ru',
        data: {
          text,
        },
      });

      return response.data;
    } catch (error) {
      console.log('Ошибка OpenAI', error);
      return 'Кажется мой мозг сломался.. скоро его починят';
    }
  }
}
