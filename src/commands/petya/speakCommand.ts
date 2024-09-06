import { Context } from 'telegraf';
import axios from 'axios';
import * as https from 'node:https';

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
    console.log(string);

    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    return await axios
      .post(
        'https://chat.mcandylab.ru/chat',
        {
          text: string,
        },
        { httpsAgent: agent },
      )
      .then(({ data }) => {
        console.log(data);
        return data.response;
      })
      .catch((reason) => {
        console.log('Ошибка от c.ai', reason);
        return 'Кажется мой мозг сломался.. скоро его починят';
      });
  }
}
