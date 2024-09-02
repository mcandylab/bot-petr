import { Context, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import supabase from '../services/supabase';

export default class AutoRegistrationController {
  public async init(bot: Telegraf): Promise<void> {
    bot.on(message('text'), (context: Context) => {
      if (context.from && context.from.id) {
        this.execute(context);
      }
    });
  }

  private async execute(context: Context) {
    const from = context.from;
    const chat = context.chat;

    if (from && chat) {
      if (await this.validate(from.id, chat.id)) {
        await this.createPlayer(from.id, chat.id, from.username || '');
      }
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
