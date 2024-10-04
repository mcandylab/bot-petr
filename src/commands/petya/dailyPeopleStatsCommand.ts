import { Context } from 'telegraf';
import supabase from '../../services/supabase';

export default class DailyPeopleStatsCommand {
  public async init(context: Context): Promise<void> {
    await this.execute(context);
    return;
  }

  private async execute(context: Context) {
    const chatId = context.chat?.id;

    if (!chatId) {
      await context.reply('Команда может быть использована только в чате.');
      return;
    }

    // Получение всех записей daily_people для данного чата
    const { data: dailyPeopleData, error: dailyPeopleError } = await supabase
      .from('daily_people')
      .select('user_id')
      .eq('chat_id', chatId);

    if (dailyPeopleError) {
      console.error('Error fetching daily_people data:', dailyPeopleError);
      await context.reply('Произошла ошибка при получении статистики.');
      return;
    }

    if (!dailyPeopleData || dailyPeopleData.length === 0) {
      await context.reply('Статистика пока пуста.');
      return;
    }

    // Подсчет количества выборов для каждого пользователя
    const userCounts: { [key: number]: number } = {};
    for (const record of dailyPeopleData) {
      const userId = record.user_id;
      userCounts[userId] = (userCounts[userId] || 0) + 1;
    }

    // Преобразование результатов в массив и сортировка по количеству выборов
    const statsArray = Object.keys(userCounts)
      .map((userId) => ({
        user_id: parseInt(userId),
        count: userCounts[parseInt(userId)],
      }))
      .sort((a, b) => b.count - a.count);

    // Получение имен пользователей по их user_id
    const userIds = statsArray.map((stat) => stat.user_id);

    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('user_id, username')
      .eq('chat_id', chatId)
      .in('user_id', userIds);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      await context.reply(
        'Произошла ошибка при получении данных пользователей.',
      );
      return;
    }

    const userIdToUsername = new Map<number, string>();
    for (const user of usersData) {
      userIdToUsername.set(user.user_id, user.username);
    }

    // Формирование сообщения со статистикой
    const messageLines: string[] = [];
    let rank = 1;
    for (const stat of statsArray) {
      const username = userIdToUsername.get(stat.user_id);
      if (!username) continue;

      // Создаем строку без экранирования специальных символов
      const line = `${rank}. @${username} — ${stat.count} раз(а)`;

      // Экранируем всю строку
      const escapedLine = this.escapeMarkdownV2(line);

      messageLines.push(escapedLine);
      rank++;
    }

    const message = 'Статистика пидорков:\n\n' + messageLines.join('\n');

    await context.reply(message, { parse_mode: 'MarkdownV2' });
  }

  private escapeMarkdownV2(text: string): string {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
  }
}
