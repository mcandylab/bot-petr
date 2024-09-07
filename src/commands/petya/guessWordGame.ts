import { Context } from 'telegraf';
import supabase from '../../services/supabase';
import GetRandomWord from '../../lib/getRandomWord';

export default class GuessWordGame {
  public async init(context: Context): Promise<void> {
    if (context.chat) {
      const { data: currentGame } = await this.checkStartedGame(context);

      if (currentGame) {
        await context.reply(
          '<b>Игра уже запущена!</b>\nНеугаданное слово: ' +
            currentGame.mask +
            '\n\n' +
            'Угадать букву через команду: Петя буква * \n' +
            'Угадать слово через команду: Петя слово *****',
          { parse_mode: 'HTML' },
        );
      } else {
        const word = GetRandomWord.execute();
        const mask = Array(word.length).fill('*').join('');

        await supabase.from('guess_words').insert({
          chat_id: context.chat.id,
          word,
          mask,
          is_finished: false,
        });

        await context.reply(
          `<b>Игра началась!</b>\nЗагаданное слово: ${mask}.\nКоличество букв: ${word.length}` +
            '\n\n' +
            'Угадать букву через команду: Петя буква * \n' +
            'Угадать слово через команду: Петя слово *****',
          {
            parse_mode: 'HTML',
          },
        );
      }
    }
  }

  private async checkStartedGame(context: Context) {
    if (context.chat) {
      return supabase
        .from('guess_words')
        .select()
        .eq('chat_id', context.chat.id)
        .eq('is_finished', false)
        .single();
    }

    return { data: null };
  }
}
