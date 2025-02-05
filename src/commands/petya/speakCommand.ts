import { Context } from 'telegraf';
import axios from 'axios';

export default class SpeakCommand {
  public async init(context: Context, command: string): Promise<void> {
    if (!command) {
      await context.reply('Шо');
      return;
    }

    const message = await this.execute(command, context);
    await context.reply(message);
    return;
  }

  private async execute(text: string, context: Context): Promise<string> {
    let prefix = '[';

    if (context.from) {
      // Формируем префикс из first_name и last_name, если они есть
      if (context.from.first_name) {
        prefix += context.from.first_name;
      }
      if (context.from.last_name) {
        prefix += ` ${context.from.last_name}`;
      }
      if (prefix) {
        prefix += ']: ';
      }
    }

    const finalText = prefix + text;

    try {
      const response = await axios.request({
        method: 'POST',
        url: 'https://mcandylab-bot-ai-647b.twc1.net',
        data: {
          text: finalText,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Ошибка OpenAI', error);
      return 'Кажется мой мозг сломался.. скоро его починят';
    }
  }
}
