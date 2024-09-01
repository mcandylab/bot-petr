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

        try {
          await context.reply(
            `@${context.from.username}  ${getAnswerMessage(message)}! Счет ${count}:0 🎉`,
            {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              reply_to_message_id: context.message.message_id,
            },
          );
        } catch (error) {
          console.error(
            'Сообщение не было отправлено, так как исходное сообщение, возможно, было удалено:',
            error,
          );
        }
      } else {
        await supabase.from('answers').insert({
          chat_id: context.chat.id,
          user_id: context.from.id,
          message,
          count: 1,
        });

        try {
          await context.reply(
            `@${context.from.username}  ${getAnswerMessage(message)}! Счет 1:0 🎉`,
            {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              reply_to_message_id: context.message.message_id,
            },
          );
        } catch (error) {
          console.error(
            'Сообщение не было отправлено, так как исходное сообщение, возможно, было удалено:',
            error,
          );
        }
      }
    }
  }
}
