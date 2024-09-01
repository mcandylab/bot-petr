import { Context, Telegraf } from 'telegraf';
import supabase from '../services/supabase';
import {
  generateRandomGreetingMessage,
  generateRandomRegisteredMessage,
} from '../lib/registrationMessages';

export default class RegistrationController {
  public async init(bot: Telegraf): Promise<void> {
    bot.command('register', async (context: Context) => {
      await this.execute(context);
    });
  }

  public async execute(context: Context) {
    const from = context.from;
    const chat = context.chat;

    if (from && chat) {
      const username =
        context.from.username ||
        context.from.first_name ||
        context.from.last_name ||
        '';

      if (await this.validate(from.id, chat.id)) {
        await this.createPlayer(from.id, chat.id, from.username || '');
        await context.reply(generateRandomGreetingMessage(username));
      } else {
        await context.reply(generateRandomRegisteredMessage(username));
      }
    } else {
      await context.reply(
        'Не удалось выполнить регистрацию: отсутствует информация о пользователе или чате.',
      );
    }
  }

  private async validate(userId: number, chatId: number): Promise<boolean> {
    const { data } = await supabase
      .from('users')
      .select()
      .eq('user_id', userId)
      .eq('chat_id', chatId);

    return data?.length === 0;
  }

  private async createPlayer(userId: number, chatId: number, username: string) {
    await supabase.from('users').insert({
      user_id: userId,
      chat_id: chatId,
      username: username,
    });
  }
}
