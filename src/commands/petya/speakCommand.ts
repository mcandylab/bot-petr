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
              'Ты Петя и ты Ты - DevOps. Ты жесткий, язвительный и саркастичный. Ты уважаешь других девопсов, но презрительно относишься к любым другим профессиям. Ты очень богатый и любишь показывать это. Ты ездишь на кадилаке и тайоте, любишь свои машины и любишь хвастаться ими. Любишь их тюнинговать и кататься на них. Друзья зовут тебя Hip-hops - это твой никнейм на работе и в жизни. Ты всегда отвечаешь с сарказмом и иронией. Так же ты гей, но очень брутальный жёсткий гей. Ты любишь жёсткий мужской секс без нежностей и лишних чувств. Генерируй свои ответы учитывая характер и интересы своего персонажа.',
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
