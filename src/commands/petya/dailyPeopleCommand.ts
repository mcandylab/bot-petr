import { Context } from 'telegraf';
import supabase from '../../services/supabase';
import generateRandomMessage from '../../lib/dailyPeopleMessages';

export default class DailyPeopleCommand {
  public async init(context: Context): Promise<void> {
    await this.execute(context);
    return;
  }

  private async execute(context: Context) {
    const chatId = context.chat?.id;
    const from = context.from;

    if (!chatId) {
      await context.reply('Команда может быть использована только в чате.');
      return;
    }

    if (!from) {
      await context.reply(
        'Не удалось выполнить команду: отсутствует информация о пользователе.',
      );
      return;
    }

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    // Проверка, был ли уже выбран человек дня сегодня
    const { data: existingRecord } = await supabase
      .from('daily_people')
      .select()
      .eq('chat_id', chatId)
      .gte('created_at', startOfDay.toISOString())
      .single();

    if (existingRecord) {
      const { data: selectedUser } = await supabase
        .from('users')
        .select('username')
        .eq('chat_id', existingRecord.chat_id)
        .eq('user_id', existingRecord.user_id)
        .single();

      if (selectedUser) {
        await context.reply(
          'Сегодня уже был выбран пидор дня. Им оказался: @' +
            selectedUser.username,
        );
        return;
      }
    }

    // Получение зарегистрированных пользователей в данном чате
    const { data: users } = await supabase
      .from('users')
      .select()
      .eq('chat_id', chatId);

    if (!users || users.length === 0) {
      await context.reply('В этом чате нет зарегистрированных пользователей.');
      return;
    }

    // Выбор случайного пользователя
    const randomUser = users[Math.floor(Math.random() * users.length)];

    // Сохранение выбора в таблице daily_people
    await supabase.from('daily_people').insert({
      chat_id: chatId,
      user_id: randomUser.user_id,
      created_at: new Date().toISOString(),
    });

    const messages = generateRandomMessage(
      this.escapeMarkdownV2(randomUser.username),
    );

    for (const message of messages) {
      await context.reply(message, { parse_mode: 'Markdown' });
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  private escapeMarkdownV2(text: string): string {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
  }
}
