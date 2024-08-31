export default class Hello {
  public getText(): string {
    return 'Hello ' + process.env.NAME;
  }
}
