import { Context } from 'telegraf';
import axios from 'axios';

export default class SpeakCommand {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.AI_KEY || '';
  }

  public async init(context: Context, command: string): Promise<void> {
    if (!command) {
      await context.reply('Шо');
      return;
    }

    const message = await this.execute(command);
    await context.reply(message);
    return;
  }

  private async execute(prompt: string): Promise<string> {
    try {
      const response = await axios.request({
        method: 'POST',
        url: 'https://api.chai-research.com/v1/chat/completions',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'X-API_KEY': this.apiKey,
        },
        data: {
          model: 'chai_v1',
          messages: [{ role: 'user', content: prompt }],
        },
      });

      return (
        response.data.choices[0].message?.content || 'Ошибка получения ответа'
      );
    } catch (error) {
      console.log('Ошибка OpenAI', error);
      return 'Кажется мой мозг сломался.. скоро его починят';
    }
  }
}
