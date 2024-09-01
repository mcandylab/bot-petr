interface Answer {
  key: string;
  value: string;
}

const ANSWERS: Answer[] = [
  {
    key: 'да',
    value: 'пизда',
  },
  {
    key: 'нет',
    value: 'пидора ответ',
  },
];

export function getAnswerMessage(key: string): string {
  return ANSWERS.find((answer) => answer.key === key)?.value || '';
}
