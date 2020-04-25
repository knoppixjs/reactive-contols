const MathParser = (function() {
  const _D_ = ' ';
  const operations = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => x / y
  };

  function tokenizer(expression) {
    let numericBuffer = [];
    let tokens = [];

    expression.split('').forEach(ch => {
      if (/\d/.test(ch) || ch === '.') {
        numericBuffer.push(ch);
      } else if (ch in operations || ch === '(' || ch === ')') {
        if (ch === '-' && !numericBuffer.length && tokens[tokens.length - 1] !== ')') {
          numericBuffer.push(ch);
        } else {
          if (numericBuffer.length) {
            tokens.push(numericBuffer.join(''));
            numericBuffer.length = 0;
          }
          tokens.push(ch);
        }
      }
    });

    tokens.push(numericBuffer.join(''));

    return tokens;
  } 

  function convertInfixToPostfix(expression = '') {
    if (typeof expression !== 'string') {
      if (expression instanceof String) {
        expression = expression.toString();
      } else {
        return null;
      }
    }

    let result = '';
    const stack = [];
    const addToResult = payload => (result += `${_D_}${payload}`);
    const priority = token => {
      switch (token) {
        // High.
        case '*':
        case '/':
          return 2;
        // Low.
        case '+':
        case '-':
          return 1;
        default:
          return -1;
      }
    }

    if (/[^()+\-*/\d.\s]/gi.test(expression)) {
      return null;
    }

    // const tokens = expression.match(/(-?(?:\d+\.?\d*|-?\.\d*))|[()+\-*/]/gi);
    const tokens = tokenizer(expression);

    if (!tokens) {
      return null;
    }

    tokens.forEach(token => {
      if (token in operations) {
        while (stack.length && priority(stack[stack.length - 1]) >= priority(token)) {
          addToResult(stack.pop());
        }
        stack.push(token);
      } else if (token === '(') {
        stack.push(token);
      } else if (token === ')') {
        while (stack.length && stack[stack.length - 1] !== '(') {
          addToResult(stack.pop());
        }
        stack.pop();
      } else {
        addToResult(token);
      }
    });

    while (stack.length) {
      addToResult(stack.pop());
    }
    result = result.trim();

    return result.length ? result : null;
  }

  return function MathParser(payload = '') {
    let infixExpression = payload;
    let postfixExpression;
    let parserExpression;

    return {
      set(payload) {
        infixExpression = payload;
      },
      parse() {
        try {
          postfixExpression = convertInfixToPostfix(infixExpression);
          parserExpression = infixExpression;

          return postfixExpression === null ? false : true;
        } catch (e) {
          parserExpression = null;
          console.warn('Error when parsing');

          return false;
        }
      },
      calc() {
        const stack = [];

        if (parserExpression !== infixExpression) {
          this.parse(infixExpression);
        }

        postfixExpression.split(_D_).forEach(token => {
          if (token in operations) {
            const [x, y] = [stack.pop(), stack.pop()];

            if (token === '/' && x === 0) {
              console.warn('Delimiter to zero');
            } else {
              stack.push(operations[token](y, x));
            }
          } else {
            stack.push(parseFloat(token));
          }
        });

        return stack.pop();
      }
    }
  }
}());
