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
      // Формируем username и name
      const username = from.username || '';
      const name = from.first_name + (from.last_name ? ` ${from.last_name}` : '');

      // Проверяем, существует ли пользователь в таблице
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('user_id', from.id)
        .eq('chat_id', chat.id);

      if (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        return;
      }

      if (data && data.length > 0) {
        // Если пользователь найден, обновляем его данные
        const { error: updateError } = await supabase
          .from('users')
          .update({ username, name })
          .eq('user_id', from.id)
          .eq('chat_id', chat.id);

        if (updateError) {
          console.error('Ошибка при обновлении пользователя:', updateError);
        }
      } else {
        // Если пользователя нет, вставляем новую запись
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            user_id: from.id,
            chat_id: chat.id,
            username,
            name,
          });

        if (insertError) {
          console.error('Ошибка при добавлении пользователя:', insertError);
        }
      }
    }
  }
}
