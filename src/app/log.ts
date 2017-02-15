export class Log {

  static i(...messages: any[]): void {
    console.info(messages);
  }

  static d(message: string, ...others: any[]): void {
    console.debug(message, others);
  }

  static w(...messages: any[]): void {
    console.warn(messages);
  }

  static e(...messages: any[]): void {
    console.error(messages);
  }

  static clear(): void {
    console.clear();
  }

  static log(...messages: any[]): void {
    console.log(messages);
  }

  static table(element: any): void {
    console.table(element);
  }
}
