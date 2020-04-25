const CalcInput = (function(window, MathParser) {
  const doc = window.document;
  const createEl = doc.createElement.bind(doc);
  let mathParser = new MathParser();

  function on(event, callback, el = doc) {
    return el.addEventListener(event, callback);
  }

  function off(event, callback, el = doc) {
    return el.removeEventListener(event, callback);
  }

  function changeText(el, text) {
    el.innerText = text;
  }

  return class CalcInput {
    constructor(selector, EM, className = '', onload = () => {}) {
      this.rootSelector = doc.querySelector(selector);
      this.rootSelector.classList
        .add('app-input', `${this.constructor.name.toLowerCase()}-input`);
      if (className) {
        this.rootSelector.classList.add(className);
      }
      this.eventEmitter = EM;
      this.destroyed = false;
      this.onKeyUp = event => {
        this.value = event.target.value;
      };

      const props = {
        value: null,
        isValid: false,
        result: null
      };

      Object.keys(props).forEach(key => {
        Object.defineProperty(this, key, {
          get() { return props[key]; },
          set(newValue) {
            if (props[key] !== newValue) {
              props[key] = newValue;
              this.onChange(key, newValue);
            }
          }
        });
      });

      on('DOMContentLoaded', () => {
        this.createMarkup();
        onload();
        on('keyup', this.onKeyUp, this.inputElement);
      });
    }
    calc() {
      mathParser.set(this.value);
      this.isValid = mathParser.parse();
      this.result = this.isValid ? mathParser.calc() : '';
      this.onCalc();
    }
    onCalc() {
      if (this.inputElement.value !== this.value) {
        this.inputElement.value = this.value;
      }
      changeText(this.resultElement, !isNaN(this.result) ? this.result : '?');

      this.rootSelector
        .classList
        .add(`${this.isValid ? '' : 'in'}valid`);
      this.rootSelector
        .classList
        .remove(`${!this.isValid ? '' : 'in'}valid`);
    }
    createMarkup() {
      const wrapper = createEl('div');

      this.inputElement = createEl('input');
      this.resultElement = createEl('span');
      this.inputElement.type = 'text';

      wrapper.appendChild(this.inputElement);
      wrapper.appendChild(this.resultElement);

      this.rootSelector.appendChild(wrapper);
    }
    destroy() {
      // Faster than innerHTML = '';
      while (this.rootSelector.firstChild) {
        this.rootSelector.removeChild(this.rootSelector.firstChild);
      }
      off('keyup', this.onKeyUp, this.inputElement);
      this.rootSelector.removeAttribute('class');
      mathParser && (mathParser = null);
      this.destroyed = true;
    }
    onChange(key, value) {
      if (this.destroyed) return;

      this.eventEmitter && this.eventEmitter.emit(`${key}Changed`, value);
      if (key === 'value') {
        this.calc();
      }
    }
  }
})(this, MathParser);
