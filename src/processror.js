import { get } from './util';

export class ConditionsProcessor {
  static operators = ['||', '&&', '==', '!='];

  static parse(condition) {
    const operator = '(\\|\\||\\&\\&|\\=\\=|\\!\\=)';
    const value = '([a-z0-9-]+)';
    const param = '(\\$\\.+[a-z0-9.]+)';
    const negatedParam = `(!${param})`;
    const nestedGroup =
      '(\\([a-z0-9-!$.=|&]{1,}(\\([a-z0-9-!$.=|&()]{1,}\\)){1,}\\))' +
      '|(\\((\\([a-z0-9-!$.=|&]{1,}\\)){1,}[a-z0-9-!$.=|&()]{1,}\\))';
    const group = `(\\([$.a-z0-9-!&|=]{1,}\\))`;
    const re = new RegExp(
      `${operator}|${param}|${value}|${negatedParam}|(${group}|${nestedGroup})`,
      'gim'
    );

    const matchedGroups = condition.match(new RegExp(`${nestedGroup}`, 'gim'));
    if (
      ConditionsProcessor.operators.includes(condition) ||
      (condition.match(re).length <= 1 && matchedGroups === null)
    ) {
      return condition;
    } else {
      return condition.match(re).map(i => {
        if (i[0] === '(' && i[i.length - 1] === ')') {
          i = i.slice(1, -1); // remove brackets
        }
        return ConditionsProcessor.parse(i);
      });
    }
  }

  static getParsedCondition(condition) {
    const parseResult = ConditionsProcessor.parse(condition);
    return Array.isArray(parseResult) ? parseResult : [parseResult];
  }

  static resolveValue(key, params) {
    if (key.startsWith('!$.')) {
      const validKey = key.replace('!$.', '');
      return !get(params, validKey);
    } else if (key.startsWith('$.')) {
      const validKey = key.replace('$.', '');
      return get(params, validKey);
    } else {
      return key;
    }
  }

  static fill(conditionArr, params) {
    return conditionArr.reduce((accumulator, item) => {
      if (Array.isArray(item)) {
        return [...accumulator, ConditionsProcessor.fill(item, params)];
      } else {
        return [...accumulator, ConditionsProcessor.resolveValue(item, params)];
      }
    }, []);
  }

  static getOperand(item) {
    if (Array.isArray(item)) {
      return ConditionsProcessor.process(item);
    } else {
      return item;
    }
  }

  static process(condition) {
    return condition.reduce((acc, item, index, source) => {
      if (ConditionsProcessor.operators.includes(item)) {
        const left = ConditionsProcessor.getOperand(acc);
        const right = ConditionsProcessor.getOperand(source[index + 1]);
        let result = false;
        switch (item) {
          case '==':
            result = left.toString() === right.toString();
            break;
          case '&&':
            result = left && right;
            break;
          case '||':
            result = left || right;
            break;
          case '!=':
            result = left.toString() !== right.toString();
            break;
        }

        return result;
      } else if (source.length === 1) {
        return ConditionsProcessor.getOperand(item);
      } else {
        return ConditionsProcessor.getOperand(acc);
      }
    }, condition[0]);
  }

  static check(condition, params = {}) {
    if (typeof condition !== 'string' || condition === '') {
      return null;
    }
    const normalizedCondition = condition.replace(/ /g, '');

    return !!ConditionsProcessor.process(
      ConditionsProcessor.fill(
        ConditionsProcessor.getParsedCondition(normalizedCondition),
        params
      )
    );
  }
}