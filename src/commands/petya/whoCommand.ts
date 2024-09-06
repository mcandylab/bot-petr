import { Context } from 'telegraf';
import supabase from '../../services/supabase';

export default class WhoCommand {
  public async init(context: Context, command: string): Promise<void> {
    if (!command) {
      await context.reply('Вы не предоставили текст');
      return;
    }

    await this.execute(context, command);
  }

  private async execute(context: Context, command: string): Promise<void> {
    const chatId = context.chat?.id;

    if (chatId) {
      // Получение зарегистрированных пользователей в данном чате
      const { data: users } = await supabase
        .from('users')
        .select()
        .eq('chat_id', chatId);

      if (!users || users.length === 0) {
        await context.reply(
          'В этом чате нет зарегистрированных пользователей.',
        );
        return;
      }

      // Выбор случайного пользователя
      const randomUser = users[Math.floor(Math.random() * users.length)];

      await context.reply(`@${randomUser.username} - ${command}`);
    }
  }
}
