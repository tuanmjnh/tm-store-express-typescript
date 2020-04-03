/*
String interface
*/
interface String {
  convertToAscii(): string;
  removeChars(): string;
  toHtml(): string;
  trimChars(char: string): string;
}
String.prototype.convertToAscii = function () {
  // let $this = String(this)
  return (
    this.toLowerCase()
      .replace(/[ ]/g, '_')
      // .replace('[', '')
      // .replace(']', '')
      .replace(/[áàãạảâầấậẫẩăằắẵặẳ]/g, 'a')
      .replace(/[èéẹẽẻêếềễểệ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'e')
      .replace(/[òóõọỏôỗộồốổơỡờớợỡở]/g, 'o')
      .replace(/[ùúụũủưừứựữử]/g, 'u')
      .replace(/[ýỳỹỷỵ]/g, 'y')
      .replace(/[đ]/g, 'd')
      .replace(/[~\`!@#$%^&*()--+={}\\|;:\'\"<,>.?/”“‘’„‰‾–—]/g, '')
  );
};

String.prototype.removeChars = function () {
  return this.replace(/[~`!@#$%^&*()\[{}\]\\|;:\'\",<>./?]/g, '');
};

String.prototype.toHtml = function () {
  const el = document.createElement('div');
  el.innerHTML = this as string;
  const firstChild: any = el.firstChild;
  return firstChild.data;
};

String.prototype.trimChars = function (char: string) {
  const regx = new RegExp(char + '$', 'g');
  return this.replace(regx, '');
};

/*
Array interface
*/
// declare global {
interface Array<T> {
  pushIfNotExist(element: T | T[], key?: string): void;
  pushIfNotExistUpdate(element: T, key?: string): void;
  sum(prop: string): number;
}
// }
if (!Array.prototype.pushIfNotExist) {
  Array.prototype.pushIfNotExist = function <T>(this: T[], element: T | T[], key?: string) {
    if (Array.isArray(element)) {
      element.forEach((e) => {
        if (key) {
          if (this.findIndex((x: any) => x[key] === e[key]) < 0) this.push(e);
        } else {
          if (this.indexOf(e) < 0) this.push(e);
        }
      });
    } else {
      if (key) {
        if (this.findIndex((x: any) => x[key] === element[key]) < 0) this.push(element);
      } else {
        if (this.indexOf(element) < 0) this.push(element);
      }
    }
  };
}

if (!Array.prototype.pushIfNotExistUpdate) {
  Array.prototype.pushIfNotExistUpdate = function <T>(this: T[], element: T | T[], key?: string) {
    if (Array.isArray(element)) {
      element.forEach((e) => {
        if (key) {
          const item: any = this.find((x: any) => x[key] === e[key]);
          if (item) {
            Object.keys(item).forEach((k: any) => {
              item[k] = e[k];
            });
          } else this.push(e);
        } else {
          if (this.indexOf(e) < 0) this.push(e);
        }
      });
    } else {
      if (key) {
        const item: any = this.find((x: any) => x[key] === element[key]);
        if (item) {
          Object.keys(item).forEach((k) => {
            item[k] = element[k];
          });
        } else this.push(element);
        // if (this.findIndex(x => x[key] === element[key]) < 0) this.push(element)
      } else {
        if (this.indexOf(element) < 0) this.push(element);
      }
    }
  };
}
if (!Array.prototype.sum) {
  Array.prototype.sum = function <T>(this: T[], prop: string) {
    let total = 0;
    for (let i = 0, _len = this.length; i < _len; i++) {
      const val = this[i][prop];
      const num = parseInt(val);
      if (num) total += num;
    }
    return total;
  };
}
