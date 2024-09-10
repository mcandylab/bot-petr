import { Context, Telegraf } from 'telegraf';
import supabase from '../services/supabase';
import { getAnswerMessage } from '../lib/answerMessages';

export default class AnswerController {
  public async init(bot: Telegraf): Promise<void> {
    bot.hears(
      /^(д[аa]|[dд][аa]|Д[АA]|[DД][АA])$/i,
      async (context: Context) => {
        await this.execute(context, 'да');
      },
    );

    bot.hears(
      /^(н[еe][тt]|[nн][еe][тt]|Н[ЕE][ТT]|[NН][ЕE][ТT])$/i,
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
            `${getAnswerMessage(message)}! Счет ${count}:0 🎉`,
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
          await context.reply(`${getAnswerMessage(message)}! Счет 1:0 🎉`, {
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
    }
  }
}
