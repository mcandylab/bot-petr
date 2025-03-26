import { Context } from 'telegraf';

export default class KickCommand {
  public async init(context: Context, userId: string): Promise<void> {
    const chatId = context.chat?.id;

    if (!chatId) {
      await context.reply('Команда может быть использована только в чате.');
      return;
    }

    try {
      const messages = [
        'Давайте думать, блять, подсказывайте',
        'Чё вы мозги ебёте',
        'подскажите как блять сделать-то по красоте-то ёб твою мать?',
        'короче вот ты и попался',
      ];

      for (const message of messages) {
        await context.reply(message, { parse_mode: 'Markdown' });
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      await context.telegram.banChatMember(chatId, parseInt(userId));
      await context.reply(`Ну все, как говорится, ариведерчи ёпта, ахаха`);
    } catch (error) {
      await context.reply(
        'Не удалось исключить пользователей. Возможно, у бота недостаточно прав.',
      );
    }
  }
}
