const GREETINGS: string[] = [
  'здарова, заебал! Зарегался, значит, ну всё, не расслабляйся!',
  'опа-на, новый в наших рядах! Готовься, ебнуть может в любой момент',
  'опа, новый, бля! Теперь ты наш!',
  "ты точно хочешь быть в этом списке? Напиши 'Да', если согласен, 'Нет', если передумал",
  'здарова, ебать! Теперь ты в нашей банде!',
  'эй, красавчик, теперь ты с нами!',
  'опа, новый хуй! Теперь ты наш!',
  'сомнительно, но окээээй. Ты в команде!',
  'к тебе вопросов нет, просто лучший, спасибо за регистрацию',
  'ууу, лучше бы ты не регался, буду попускать тебя чаще всего!',
  'кто тебя сюда пустил? в дурку его! Ты в команде!',
  'среди нас появился петух! Поприветствуем!',
  'добро пожаловать, бля, теперь ты с нами!',
  'ну всё, заебись, ты теперь в списке!',
  'зарегался? Теперь держись, хуй знает что будет дальше!',
  'эй, ты теперь в наших рядах, не расслабляйся!',
  'ну что, новый, теперь ты один из нас!',
  'теперь ты с нами, ёпта, никаких поблажек!',
  'зарегистрирован? Ну всё, пиздец тебе!',
  'приветствуем тебя в нашей тусовке, теперь ты наш!',
  'ты в списке, так что не вздумай соскочить!',
  'поздравляю, ты теперь в нашей банде, хули!',
  'теперь ты один из нас, не ссы, выживешь!',
  'зарегался? Отлично, теперь готовься к приключениям!',
  'ну всё, ты в нашей компании, добро пожаловать!',
  'опа, попался! Теперь ты один из нас!',
  'ты теперь в нашем списке, надеюсь, готов к этому!',
  'ну что, братан, теперь ты в нашей команде!',
  'зарегался? Хуй теперь от нас уйдешь!',
  'эй, ты в списке, теперь в нашей движухе!',
  'теперь ты с нами, хули, держись крепче!',
  'добро пожаловать, новый, готовься к веселухе!',
];

const REGISTERED: string[] = [
  'ты уже зарегистрирован!',
  'хули тыкаемся то? зарегистрирован уже',
  'пиздец, зарегистрирован и снова пытается',
  'пиздец, долго ещё будешь пытаться снова зарегистрироваться?',
  'зарегистрирован, ебать, хватит тыкать!',
  'ты чё, бля, регаться по два раза вздумал?',
  'зарегистрирован как положено, больше не надо!',
  'слышь, ты уже в списках, не напрягай меня.',
  'ну куда ж ты, зарегистрирован уже, отстань!',
  'ещё раз нажмешь — опять зарегистрирован будешь.',
  'хватит дурью маяться, ты уже в системе.',
  'не первый раз вижу, регаться второй раз не надо.',
  'чё, забыл? Уже зарегался.',
  'всё, записан, успокойся.',
  'ты уже зарегался, можешь расслабиться.',
  'опять ты? Уже в базе, хорош.',
  'сколько раз говорить? Зарегистрирован ты.',
  'опять? Да сколько можно? Ты уже с нами.',
  'ну серьёзно, ты же уже в списке.',
  'хватит повторяться, ты зарегался ещё раньше.',
  'зарегистрирован по полной программе, больше не надо.',
  'ты в списках, ну чё ты снова лезешь?',
  'ещё раз повторю — зарегистрирован.',
  'сколько можно, ты уже в базе данных!',
  'ты уже в базе, блядь, хватит тыкать!',
  'зарегался, ебать, хватит долбить эту кнопку.',
  'ты уже зарегистрирован, сука, чего тебе еще надо?',
  'да ты, бля, уже давно у нас, хватит долбить!',
  'зарегистрирован, пиздец, хватит тупить.',
  'ты чё, долбоёб? Уже зареган!',
  'ты уже, блядь, в системе, что не так?',
  'ебать, ты уже с нами, хорош тыкать.',
  'ну всё, пиздец, ты зарегался, отъебись!',
  'ты уже в базе, нахуй ещё раз тыкать?',
  'сука, ты уже зареган, хватит доебываться.',
  'ты чё, охуел? Уже в списке!',
  'ты в базе, бля, не тупи.',
  'да ты, блядь, уже у нас, расслабься!',
  'ебать, ты уже в списках, отъебись!',
  'ты уже зареган, ебать, сколько раз повторять?',
  'слышь, ты в базе, завязывай с этим.',
  'ты уже с нами, ебать, успокойся.',
  'да ты, блядь, зареган, чего ещё надо?',
  'сука, ты уже в списке, хорош тыкать.',
  'я вахуе с тебя конечно, успокойся!',
];

export function generateRandomGreetingMessage(username: string): string {
  const getRandomElement = (arr: string[]): string => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  return `@${username} ` + getRandomElement(GREETINGS);
}

export function generateRandomRegisteredMessage(username: string): string {
  const getRandomElement = (arr: string[]): string => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  return `@${username} ` + getRandomElement(REGISTERED);
}
