String.prototype.convertToAscii = function() {
  // let $this = String(this)
  return this.toLowerCase()
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
}
String.prototype.removeChars = function() {
  return this.replace(/[~`!@#$%^&*()\[{}\]\\|;:\'\",<>./?]/g, '')
}

String.prototype.toHtml = function() {
  if (!this) return this
  var el = document.createElement('div')
  el.innerHTML = this
  return el.firstChild.data
}

Array.prototype.pushIfNotExist = function(element, key) {
  if (Array.isArray(element)) {
    element.forEach(e => {
      if (key) {
        if (this.findIndex(x => x[key] === e[key]) < 0) this.push(e)
      } else {
        if (this.indexOf(e) < 0) this.push(e)
      }
    })
  } else {
    if (key) {
      if (this.findIndex(x => x[key] === element[key]) < 0) this.push(element)
    } else {
      if (this.indexOf(element) < 0) this.push(element)
    }
  }
}

Array.prototype.pushIfNotExistUpdate = function(element, key) {
  if (Array.isArray(element)) {
    element.forEach(e => {
      if (key) {
        const item = this.find(x => x[key] === e[key])
        if (item) {
          Object.keys(item).forEach(k => {
            item[k] = e[k]
          })
        } else this.push(e)
      } else {
        if (this.indexOf(e) < 0) this.push(e)
      }
    })
  } else {
    if (key) {
      const item = this.find(x => x[key] === element[key])
      if (item) {
        Object.keys(item).forEach(k => {
          item[k] = element[k]
        })
      } else this.push(element)
      // if (this.findIndex(x => x[key] === element[key]) < 0) this.push(element)
    } else {
      if (this.indexOf(element) < 0) this.push(element)
    }
  }
}

Array.prototype.sum = function(prop) {
  var total = 0
  for (var i = 0, _len = this.length; i < _len; i++) {
    const number = parseInt(this[i][prop])
    if (number) total = total + number
  }
  return total
}
