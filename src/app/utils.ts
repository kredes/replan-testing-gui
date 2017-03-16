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

  static JSONHighlight(json: string) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }
}
