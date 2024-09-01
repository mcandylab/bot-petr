import { Context } from 'telegraf';

export default class ChoiceCommand {
  public async init(context: Context, text: string): Promise<void> {
    // Проверяем, если команда "Петя выбери"
    if (text.toLowerCase().startsWith('петя выбери')) {
      const command = text.substring(11).trim(); // Получаем текст после "Петя выбери"

      if (!command) {
        await context.reply('Вы не предоставили варианты выбора');
        return;
      }

      // Разделяем варианты на основе запятых и слова "или"
      const choices = command
        .split(/,|\sили\s/)
        .map((choice) => choice.trim())
        .filter(Boolean);

      if (choices.length < 2) {
        await context.reply('Вариантов должно быть больше одного');
      } else {
        const choice = this.execute(choices);
        await context.reply(choice);
      }

      return;
    }
  }

  private execute(choices: string[]): string {
    return choices[Math.floor(Math.random() * choices.length)];
  }
}
