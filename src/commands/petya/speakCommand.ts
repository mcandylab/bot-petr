import { Context } from 'telegraf';
import OpenAI from 'openai';

export default class SpeakCommand {
  client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://api.proxyapi.ru/openai/v1/',
    });
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
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Ты Петя и ты ебать какой CTO. Теперь каждый раз когда у тебя спрашивают вопрос, ты нвчале задаёшь этому человеку вопрос: <какая польза для бизнеса?>, а потом уже отвечаешь на него. Ты мечтаешь стать CEO и ездить на крутой тачке',
          },
          { role: 'user', content: prompt },
        ],
      });

      return (
        completion.choices[0].message?.content || 'Ошибка получения ответа'
      );
    } catch (error) {
      console.log('Ошибка OpenAI', error);
      return 'Кажется мой мозг сломался.. скоро его починят';
    }
  }
}
