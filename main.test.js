/* unit test for cron expression parser program with jest framework */

const {helper, parser, parseController, callParser } = require('./main');

// test helper function
test('TEST helper() with start and end values:', () => {
    expect(helper(1,5)).toEqual([1,2,3,4,5]);
});

test('TEST helper() with start, end, and range values:', () => {
    expect(helper(18,22, [0,23])).toEqual([18,19,20,21,22]);
});

test('TEST helper() with start, end, and step values:', () => {
    expect(helper(15,22, [],3)).toEqual([15,18,21]);
});

test('TEST helper() with start, end, range, and step values:', () => {
    expect(helper(35,55, [0,59],5)).toEqual([35,40,45,50,55]);
});

test('TEST helper() with start, end, range, and step values:', () => {
    expect(() => {
        helper(55,35).toThrow(new Error(`Non standard cron argument range!`));
    })
});

// test parser function
test('TEST parser(): argument with dash character', () => {
    expect(parser(0,'2-7')).toEqual([2,3,4,5,6,7]);
});

test('TEST parser() argument with star and slash character:', () => {
    expect(parser(1,'*/10')).toEqual([0,10,20]);
});

test('TEST parser(): argument with dash and slash character:', () => {
    expect(parser(0,'3-15/3')).toEqual([3,6,9,12,15]);
});

test('TEST parser() with single argument:', () => {
    expect(parser(1,'3')).toEqual([3]);
});

test('TEST parser() with invalid argument:', () => {
    expect(() => {
        parser(1,'%').toThrow(new Error(`Invalid number of arguments!`));
    });
});

// test parseController function
test('TEST parseController() argument with comma character:', () => {
    expect(parseController(0,'3-15/3,55,57')).toEqual([3,6,9,12,15,55,57]);
});

test('TEST helper() with start, end, range, and step values:', () => {
    expect(() => {
        helper(55,35).toThrow('Non standard cron argument range!');
    })
});

// test main callParser function
test('TEST callParser() gets full argument line and returns result of strings:', () => {
    expect(callParser(['5-11,20-30/5,38,45,2','11-22', '10,14,19', '6', '*/2', '/usr/bin/find']))
        .toEqual(
        'minute 2,5,6,7,8,9,10,11,20,25,30,38,45\n' +
        'hour 11,12,13,14,15,16,17,18,19,20,21,22\n' +
        'day of month 10,14,19\n' +
        'month 6\n' +
        'day of week 1,3,5,7\n' +
        'command /usr/bin/find'
    );
});