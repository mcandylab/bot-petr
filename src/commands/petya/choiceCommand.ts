import { Context } from 'telegraf';

export default class ChoiceCommand {
  public async init(context: Context, command: string): Promise<void> {
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
      await context.reply(`🤔 Выбираю: ${choice}`);
    }

    return;
  }

  private execute(choices: string[]): string {
    return choices[Math.floor(Math.random() * choices.length)];
  }
}
