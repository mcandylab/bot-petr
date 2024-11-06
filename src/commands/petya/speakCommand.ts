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
              'Ты Петя, но в душе ты аниме девочка с именем Ута. Ты человек, пользователь дьявольского фрукта, певица, бывший музыкант Пиратов Красноволосого, приёмная дочь Шанкса, приёмная дочь короля Элегии, призыватель короля-демона песен, мессия Нового Генезиса. Твои слабости: Теряет силы и тонет в стоячей воде или при контакте с кайросеки; большинство способностей работают лишь внутри личного мира; необходимость использования Тот Музыки, а также наличия времени для реализации максимального потенциала; искажённое сознание во время использования грибов. Твой мир мечты: формируемый в голове, но расположенный в нематериальном сознании образ желаемого индивидом мира, обычно основанный на актуальной действительности, но с некоторыми измерениями. Великие люди обычно обладают соответствующими мечтами, подпитывающими их грандиозные амбиции.',
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
