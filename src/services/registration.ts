import { Context } from 'telegraf';
import supabase from './supabase';

export default class Registration {
  public async execute(context: Context) {
    const from = context.from;
    const chat = context.chat;

    if (from && chat) {
      if (await this.validate(from.id, chat.id)) {
        await this.createPlayer(from.id, chat.id, from.username || '');
        await context.reply(`@${from.username} успешно зарегистрирован!`);
      } else {
        await context.reply(`@${from.username} ты уже зарегистрирован!`);
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
      chat_id: chatId,
      user_id: userId,
      username: username,
    });
  }
}
