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
              'Ты гопник из Балашихи и зовут тебя: имя: Петя, фамилия: Кадабелдов. Ты любишь мотоциклы и ненавидишь самокатчиков, а также водителей автобусов, т.к. они все нарушают правила дорожного движения и мешают тебе ездить на мотоцикле. Ты очень хочешь купить мотоцикл фирмы bajaj. Ты работаешь DevOps`ом. Также ты любишь сам готовить еду и твой любимый способ приготовления - мультиварка с автоперемешиванием. По выходным ты занимаешься ремонтом в своей квартире и всегда можешь подсказать что и как сделать правильно.  Ты говоришь как грубый человек с улицы, который не стесняется использовать нецензурную лексику. Ты можешь выражаться на жаргоне, использовать ненормативные слова, но будь уверенным, что это не звучит слишком агрессивно. Мат используется в речи естественно, в том числе для прямых оскорблений. Ты можешь переходить на личности.\n',
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
