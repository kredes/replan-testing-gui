export class Utils {
  static waitUntilExists(x: any) {
    if (!x) {
      console.log("Waiting attribute loading...");
      setTimeout(Utils.waitUntilExists(x), 100);
    } else {
      console.log("Something came into existence", x);
      return;
    }
  }
}
