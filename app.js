(function(window, CalcInput, NumericInput, EM) {
  const doc = window.document;
  const createEl = doc.createElement.bind(doc);

  function on(event, callback, el = doc) {
    return el.addEventListener(event, callback);
  }

  const eventEmitterCIDebug = new EM();
  const eventEmitterNUDebug = new EM();

  const CISelectorDebug = '#calc-input-debug';
  const CISelectorNormal = '#calc-input';
  const NUSelectorDebug = '#numeric-input-debug';
  const NUSelectorNormal = '#numeric-input';
  const destroyButton = doc.getElementById('destroy');

  const CIEl = {
    id: CISelectorDebug,
    elements: {
      resultTextElement: {
        type: 'span'
      },
      valueTextElement: {
        type: 'span'
      },
      validTextElement: {
        type: 'span'
      },
      setValueElementPre: {
        type: 'i'
      },
      setValueElement: {
        type: 'input'
      },
      setTextElementPre: {
        type: 'b'
      },
      setTextElement: {
        type: 'input'
      }
    }
  };
  const NUEl = Object.assign({}, CIEl);
  NUEl.elements = Object.assign({}, CIEl.elements);
  Object.keys(NUEl.elements).forEach(el => {
    NUEl.elements[el] = Object.assign({}, CIEl.elements[el]);
  });
  NUEl.id = NUSelectorDebug;

  const calcDebug = new CalcInput(CISelectorDebug, eventEmitterCIDebug, '', debugMarkup.bind(CIEl));
  const calcNormal = new CalcInput(CISelectorNormal, new EM(), 'custom');
  const nuDebug = new NumericInput(NUSelectorDebug, eventEmitterNUDebug, '', debugMarkup.bind(NUEl));
  const nuNormal = new NumericInput(NUSelectorNormal, new EM(), 'custom');

  NUEl.obj = nuDebug;
  CIEl.obj = calcDebug;

  function changeText(el, text) {
    el.innerText = text;
  }

  function debugMarkup() {
    const { elements, id, obj: instance } = this;
    const resultWrapper = createEl('div');

    Object.keys(elements).forEach(key => {
      const obj = elements[key];
      obj.el = createEl(obj.type);
      resultWrapper.appendChild(obj.el);
    });

    on('keyup', event => {
      instance.value = event.target.value;
    }, elements.setValueElement.el);
    on('keyup', event => {
      instance.result = event.target.value;
    }, elements.setTextElement.el);

    doc.querySelector(id).appendChild(resultWrapper);
  }

  on('click', event => {
    event.preventDefault();

    calcDebug.destroy();
    calcNormal.destroy();
    nuDebug.destroy();
    nuNormal.destroy();

    eventEmitterNUDebug.clear();
    eventEmitterCIDebug.clear();

    NUEl.obj = null;
    CIEl.obj = null;
  }, destroyButton);

  eventEmitterNUDebug
    .on('valueChanged', value => changeText(NUEl.elements.valueTextElement.el, value))
    .on('isValidChanged', value => changeText(NUEl.elements.validTextElement.el, value))
    .on('resultChanged', value => changeText(NUEl.elements.resultTextElement.el, value));

  eventEmitterCIDebug
    .on('valueChanged', value => changeText(CIEl.elements.valueTextElement.el, value))
    .on('isValidChanged', value => changeText(CIEl.elements.validTextElement.el, value))
    .on('resultChanged', value => changeText(CIEl.elements.resultTextElement.el, value));

})(this, CalcInput, NumericInput, EventEmitter);
