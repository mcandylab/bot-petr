import { Context, Telegraf } from 'telegraf';
import supabase from '../services/supabase';
import { getAnswerMessage } from '../lib/answerMessages';

export default class AnswerController {
  public async init(bot: Telegraf): Promise<void> {
    bot.hears(/^(да|ДА|Да|дА)$/i, async (context: Context) => {
      await this.execute(context, 'да');
    });

    bot.hears(
      /^(нет|НЕТ|Нет|нЕт|НЕт|нЕТ|НеТ|неТ)$/i,
      async (context: Context) => {
        await this.execute(context, 'нет');
      },
    );
  }

  public async execute(context: Context, message: string) {
    if (context.chat && context.from) {
      const { data: answer } = await supabase
        .from('answers')
        .select()
        .eq('chat_id', context.chat.id)
        .eq('user_id', context.from.id)
        .eq('message', message)
        .single();

      if (answer) {
        const count = answer.count + 1;

        await supabase.from('answers').update({ count }).eq('id', answer.id);

        await context.reply(
          `@${context.from.username}  ${getAnswerMessage(message)}! Счет ${count}:0 🎉`,
        );
      } else {
        await supabase.from('answers').insert({
          chat_id: context.chat.id,
          user_id: context.from.id,
          message,
          count: 1,
        });

        await context.reply(
          `@${context.from.username}  ${getAnswerMessage(message)}! Счет 1:0 🎉`,
        );
      }
    }
  }
}
