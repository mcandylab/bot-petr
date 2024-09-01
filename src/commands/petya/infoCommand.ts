import { Context } from 'telegraf';

export default class InfoCommand {
  public async init(context: Context, text: string): Promise<void> {
    // Проверяем, если команда "Петя инфа"
    if (text.toLowerCase().startsWith('петя инфа')) {
      const command = text.substring(10).trim(); // Получаем текст после "Петя инфа"

      if (!command) {
        await context.reply('Вы не предоставили информацию для проверки');
        return;
      }

      // Если команда содержит текст после "Петя инфа", даём рандомный ответ
      const response = this.execute();
      if (context.message) {
        try {
          await context.reply(response, {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            reply_to_message_id: context.message.message_id,
          });
        } catch (error) {
          console.error(
            'Сообщение не было отправлено, так как исходное сообщение, возможно, было удалено:',
            error,
          );
        }
      }
      return;
    }
  }

  private execute(): string {
    const responses = ['Правда', 'Неправда'];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}
