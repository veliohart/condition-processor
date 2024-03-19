import { ConditionsProcessor } from './processror';

describe('ConditionsProcessor class', () => {
  let processor = ConditionsProcessor;

  it('should create', () => {
    expect(process).toBeTruthy();
  });
  const testingParams = {
    product: 'some product name',
    missing_product: '--',
    emptyField1: '--',
    emptyField2: '--',
    drillable1: true,
    drillable2: false,
    account: 15085,
    benchmark: 'some benchmark value',
    testField: 'test',
    nested: {
      value1: '4.2222'
    }
  };
  const conditions = [
    '$.drillable1',
    '!$.drillable2',
    '(!$.product && $.drillable1) || ($.account == 15085) || ($.benchmark == test)',
    '(!$.product && $.drillable1) && ($.account == 15085) && ($.benchmark == test)',
    '(!$.product || $.drillable2) && ($.account == 15085) || ($.testField == test)',
    '$.benchmark != test',
    '(!$.product && ($.drillable1 || ($.account == 15085)))',
    '(!$.product && (($.drillable1) || ($.account == 15085)))',
    '($.emptyField1 != --) && ($.nested && ($.nested.value1 != --)) && ($.emptyField2 == --)',
    '$.drillable2 && ($.missing_product == --)',
    '($.product && !$.drillable1)',
    '!($.product && $.drillable1)',
    '(!(!$.product && ($.drillable1)))',
    '$.benchmark == some benchmark value'
  ];

  describe('check', () => {
    it(`condition: ${conditions[0]}`, () => {
      expect(processor.check(conditions[0], testingParams)).toEqual(
        !!testingParams.drillable1
      );
    });
    it(`condition: ${conditions[1]}`, () => {
      expect(processor.check(conditions[1], testingParams)).toEqual(
        !!!testingParams.drillable2
      );
    });
    it(`condition: ${conditions[2]}`, () => {
      expect(processor.check(conditions[2], testingParams)).toEqual(
        !!(
          (!testingParams.product && testingParams.drillable1) || // tslint:disable-next-line:triple-equals
          /* eslint-disable */ testingParams.account == 15085 || // tslint:disable-next-line:triple-equals
          /* eslint-disable */ testingParams.benchmark == 'test'
        )
      );
    });
    it(`condition: ${conditions[3]}`, () => {
      expect(processor.check(conditions[3], testingParams)).toEqual(
        !!(
          !testingParams.product &&
          testingParams.drillable1 && // tslint:disable-next-line:triple-equals
          /* eslint-disable */ testingParams.account == 15085 &&
          // tslint:disable-next-line:triple-equals
          testingParams.benchmark == 'test'
        )
      );
    });
    it(`condition: ${conditions[4]}`, () => {
      expect(processor.check(conditions[4], testingParams)).toEqual(
        !!(
          ((!testingParams.product || testingParams.drillable2) &&
            // tslint:disable-next-line:triple-equals
            testingParams.account == 15085) ||
          // tslint:disable-next-line:triple-equals
          testingParams.testField == 'test'
        )
      );
    });
    it(`condition: ${conditions[5]}`, () => {
      expect(processor.check(conditions[5], testingParams)).toEqual(
        testingParams.benchmark != 'test'
      );
    });
    it(`condition: ${conditions[6]}`, () => {
      expect(processor.check(conditions[6], testingParams)).toEqual(
        !!(
          !testingParams.product &&
          (testingParams.drillable1 ||
            // tslint:disable-next-line:triple-equals
            testingParams.account == 15085)
        )
      );
    });
    it(`condition: ${conditions[7]}`, () => {
      expect(processor.check(conditions[7], testingParams)).toEqual(
        !!(
          !testingParams.product &&
          (testingParams.drillable1 ||
            // tslint:disable-next-line:triple-equals
            testingParams.account == 15085)
        )
      );
    });

    it(`condition: ${conditions[8]}`, () => {
      const expected =
        // tslint:disable-next-line:triple-equals
        testingParams.emptyField1 != '--' &&
        // tslint:disable-next-line:triple-equals
        testingParams.nested &&
        testingParams.nested.value1 + '' !== '--' &&
        // tslint:disable-next-line:triple-equals
        testingParams.emptyField2 == '--';
      expect(processor.check(conditions[8], testingParams)).toEqual(!!expected);
    });

    it(`condition: ${conditions[9]}`, () => {
      expect(processor.check(conditions[9], testingParams)).toEqual(false);
    });

    // TODO: enhance functionality in future
    xit(`condition: ${conditions[10]}`, () => {
      expect(processor.check(conditions[10], testingParams)).toEqual(
        !!(testingParams.product && !testingParams.drillable1)
      );
    });
    // TODO: enhance functionality in future
    xit(`condition: ${conditions[11]}`, () => {
      expect(processor.check(conditions[11], testingParams)).toEqual(
        !!!(testingParams.product && testingParams.drillable1)
      );
    });
    // TODO: enhance functionality in future
    xit(`condition: ${conditions[12]}`, () => {
      expect(processor.check(conditions[12], testingParams)).toEqual(
        !!!(!testingParams.product && testingParams.drillable1)
      );
    });

    it(`condition: ${conditions[13]} - should return true`, () => {
      expect(processor.check(conditions[13], testingParams)).toEqual(testingParams.benchmark === 'some benchmark value');
    });
  });

  describe('parse', () => {
    it(`condition: ${conditions[0]}`, () => {
      expect(processor.parse(conditions[0].replace(/ /g, ''))).toEqual(
        '$.drillable1'
      );
    });
    it(`condition: ${conditions[1]}`, () => {
      expect(processor.parse(conditions[1].replace(/ /g, ''))).toEqual(
        '!$.drillable2'
      );
    });
    it(`condition: ${conditions[2]}`, () => {
      expect(processor.parse(conditions[2].replace(/ /g, ''))).toEqual([
        ['!$.product', '&&', '$.drillable1'],
        '||',
        ['$.account', '==', '15085'],
        '||',
        ['$.benchmark', '==', 'test']
      ]);
    });
    it(`condition: ${conditions[3]}`, () => {
      expect(processor.parse(conditions[3].replace(/ /g, ''))).toEqual([
        ['!$.product', '&&', '$.drillable1'],
        '&&',
        ['$.account', '==', '15085'],
        '&&',
        ['$.benchmark', '==', 'test']
      ]);
    });
    it(`condition: ${conditions[4]}`, () => {
      expect(processor.parse(conditions[4].replace(/ /g, ''))).toEqual([
        ['!$.product', '||', '$.drillable2'],
        '&&',
        ['$.account', '==', '15085'],
        '||',
        ['$.testField', '==', 'test']
      ]);
    });
    it(`condition: ${conditions[5]}`, () => {
      expect(processor.parse(conditions[5].replace(/ /g, ''))).toEqual([
        '$.benchmark',
        '!=',
        'test'
      ]);
    });
    it(`condition: ${conditions[6]}`, () => {
      expect(processor.parse(conditions[6].replace(/ /g, ''))).toEqual([
        ['!$.product', '&&', ['$.drillable1', '||', ['$.account', '==', '15085']]]
      ]);
    });
    it(`condition: ${conditions[7]}`, () => {
      expect(processor.parse(conditions[7].replace(/ /g, ''))).toEqual([
        ['!$.product', '&&', ['$.drillable1', '||', ['$.account', '==', '15085']]]
      ]);
    });

    it(`condition: ${conditions[8]}`, () => {
      expect(processor.parse(conditions[8].replace(/ /g, ''))).toEqual([
        ['$.emptyField1', '!=', '--'],
        '&&',
        ['$.nested', '&&', ['$.nested.value1', '!=', '--']],
        '&&',
        ['$.emptyField2', '==', '--']
      ]);
    });
  });
});