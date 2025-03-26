import { Context } from 'telegraf';

export default class KickCommand {
  public async init(context: Context, userId: string): Promise<void> {
    const chatId = context.chat?.id;

    if (!chatId) {
      await context.reply('Команда может быть использована только в чате.');
      return;
    }

    try {
      await context.telegram.banChatMember(chatId, parseInt(userId));
      await context.reply(`Ну все, как говорится, ариведерчи ёпта, ахаха`);
    } catch (error) {
      await context.reply(
        'Не удалось исключить пользователей. Возможно, у бота недостаточно прав.',
      );
    }
  }
}
