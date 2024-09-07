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

  public async guessWord(ctx: Context, letter: string): Promise<void> {
    if (ctx.from && ctx.chat) {
      const { data: game } = await this.checkStartedGame(ctx);

      if (!game) {
        await ctx.reply('Активная игра не найдена. Начните новую игру.');
        return;
      }

      const word = game.word;
      let mask = game.mask;
      let found = false;

      for (let i = 0; i < word.length; i++) {
        if (word[i].toLowerCase() === letter.toLowerCase()) {
          mask = mask.substring(0, i) + word[i] + mask.substring(i + 1);
          found = true;
        }
      }

      if (found) {
        await supabase.from('guess_words').update({ mask }).eq('id', game.id);

        if (mask === word) {
          await supabase
            .from('guess_words')
            .update({ mask, is_finished: true })
            .eq('id', game.id);

          await ctx.reply(`Поздравляем! Вы угадали слово: ${word}`);
        } else {
          await ctx.reply(`Правильно! Обновленное слово: ${mask}`);
        }
      } else {
        await ctx.reply(`Буквы "${letter}" нет в слове.`);
      }
    }
  }

  public async guessWholeWord(
    ctx: Context,
    guessedWord: string,
  ): Promise<void> {
    if (ctx.from && ctx.chat) {
      const { data: game } = await this.checkStartedGame(ctx);

      if (!game) {
        await ctx.reply('Активная игра не найдена. Начните новую игру.');
        return;
      }

      const word = game.word;

      if (guessedWord.toLowerCase() === word.toLowerCase()) {
        await supabase
          .from('guess_words')
          .update({ mask: word, is_finished: true })
          .eq('id', game.id);

        const winner = ctx.from.username
          ? `@${ctx.from.username}`
          : ctx.from.first_name;
        await ctx.reply(`Поздравляем, ${winner}! Угаданное слово: ${word}`);
      } else {
        await ctx.reply(`Слово "${guessedWord}" не совпадает с загаданным.`);
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
