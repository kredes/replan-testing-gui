export class Utils {
  static waitUntilExists_i(x: any, elapsedTime: number) {
    let t;

    if (elapsedTime > 3000) {
      console.error("Waiting timed out (> 3000 ms)");
      return;
    }

    if (!x) {
      console.log("Waiting until some element is loaded...");
      t = setTimeout(function() {Utils.waitUntilExists_i(x, elapsedTime + 100)}, 100);
    } else {
      console.log("Something came into existence", x);
      clearTimeout(t);
      return;
    }
  }

  static waitUntilExists(x: any) {
    this.waitUntilExists_i(x, 0);
    /*
    let t;
    if (!x) {
      console.log("Waiting until some element is loaded...");
      t = setTimeout(Utils.waitUntilExists(x), 100);
    } else {
      console.log("Something came into existence", x);
      clearTimeout(t);
      return;
    }
    */
  }
}
