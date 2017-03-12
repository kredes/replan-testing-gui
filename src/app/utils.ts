export class Utils {
  static waitUntilExists(x: any) {
    let t;
    if (!x) {
      console.log("Waiting until some element is loaded...");
      t = setTimeout(Utils.waitUntilExists(x), 100);
    } else {
      console.log("Something came into existence", x);
      clearTimeout(t);
      return;
    }
  }
}
