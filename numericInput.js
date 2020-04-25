const NumericInput = (function(window, CalcInput) {
  return class NumericInput extends CalcInput {
    calc() {
      if (isNaN(Number(this.value))) {
        this.isValid = false;
        this.result = null;
      } else {
        this.isValid = true;
        this.result = Number(this.value);
      }

      this.onCalc();
    }
  }
})(this, CalcInput);
