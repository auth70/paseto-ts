import * as assert from 'uvu/assert';

import { parseTime, parseTimeString } from '../../src/lib/time';

import { test } from 'uvu';

globalThis.crypto = crypto;

test('parseTimeString throws with an invalid time string', () => {
    assert.throws(() => parseTimeString('foo'));
});

test('parseTime throws with an invalid time', () => {
    assert.throws(() => parseTime('foo' as any));
});

test('parses a time from an ISO string', () => {
    const t = '2023-01-09T15:34:46.865Z';
    const result = parseTime(t);
    const d = new Date(t);
    assert.is(typeof result, 'object');
    assert.is(result instanceof Date, true);
    assert.is(result.getTime(), d.getTime());
});

test('parses a time from a number', () => {
    const result = parseTime(1631104486865);
    assert.is(typeof result, 'object');
    assert.is(result instanceof Date, true);
    assert.is(result.getTime() - 1631104486865 < 1000, true);
});

test('parses a time from a Date object', () => {
    const result = parseTime(new Date(1631104486865));
    assert.is(typeof result, 'object');
    assert.is(result instanceof Date, true);
    assert.is(result.getTime() - 1631104486865 < 1000, true);
});

test('parses a time from a time string (1s 1sec 1secs 1second 1seconds, 1 s 1 sec 1 secs 1 second 1 seconds)', () => {

    const result = parseTime('1s');
    assert.is(typeof result, 'object');
    assert.is(result instanceof Date, true);
    assert.is(result.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result2 = parseTime('1sec');
    assert.is(typeof result2, 'object');
    assert.is(result2 instanceof Date, true);
    assert.is(result2.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result3 = parseTime('1secs');
    assert.is(typeof result3, 'object');
    assert.is(result3 instanceof Date, true);
    assert.is(result3.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result4 = parseTime('1second');
    assert.is(typeof result4, 'object');
    assert.is(result4 instanceof Date, true);
    assert.is(result4.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result5 = parseTime('1seconds');
    assert.is(typeof result5, 'object');
    assert.is(result5 instanceof Date, true);
    assert.is(result5.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result6 = parseTime('1 s');
    assert.is(typeof result6, 'object');
    assert.is(result6 instanceof Date, true);
    assert.is(result6.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result7 = parseTime('1 sec');
    assert.is(typeof result7, 'object');
    assert.is(result7 instanceof Date, true);
    assert.is(result7.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result8 = parseTime('1 secs');
    assert.is(typeof result8, 'object');
    assert.is(result8 instanceof Date, true);
    assert.is(result8.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result9 = parseTime('1 second');
    assert.is(typeof result9, 'object');
    assert.is(result9 instanceof Date, true);
    assert.is(result9.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result10 = parseTime('1 seconds');
    assert.is(typeof result10, 'object');
    assert.is(result10 instanceof Date, true);
    assert.is(result10.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

});

test('parses a time from a time string (1m 1min 1mins 1minute 1minutes, 1 m 1 min 1 mins 1 minute 1 minutes)', () => {

    const result = parseTime('1m');
    assert.is(typeof result, 'object');
    assert.is(result instanceof Date, true);
    assert.is(result.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result2 = parseTime('1min');
    assert.is(typeof result2, 'object');
    assert.is(result2 instanceof Date, true);
    assert.is(result2.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result3 = parseTime('1mins');
    assert.is(typeof result3, 'object');
    assert.is(result3 instanceof Date, true);
    assert.is(result3.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result4 = parseTime('1minute');
    assert.is(typeof result4, 'object');
    assert.is(result4 instanceof Date, true);
    assert.is(result4.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result5 = parseTime('1minutes');
    assert.is(typeof result5, 'object');
    assert.is(result5 instanceof Date, true);
    assert.is(result5.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result6 = parseTime('1 m');
    assert.is(typeof result6, 'object');
    assert.is(result6 instanceof Date, true);
    assert.is(result6.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result7 = parseTime('1 min');
    assert.is(typeof result7, 'object');
    assert.is(result7 instanceof Date, true);
    assert.is(result7.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result8 = parseTime('1 mins');
    assert.is(typeof result8, 'object');
    assert.is(result8 instanceof Date, true);
    assert.is(result8.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result9 = parseTime('1 minute');
    assert.is(typeof result9, 'object');
    assert.is(result9 instanceof Date, true);
    assert.is(result9.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result10 = parseTime('1 minutes');
    assert.is(typeof result10, 'object');
    assert.is(result10 instanceof Date, true);
    assert.is(result10.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

});

test('parses a time from a time string (1h 1hr 1hrs 1hour 1hours, 1 h 1 hr 1 hrs 1 hour 1 hours)', () => {

    const result = parseTime('1h');
    assert.is(typeof result, 'object');
    assert.is(result instanceof Date, true);
    assert.is(result.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result2 = parseTime('1hr');
    assert.is(typeof result2, 'object');
    assert.is(result2 instanceof Date, true);
    assert.is(result2.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result3 = parseTime('1hrs');
    assert.is(typeof result3, 'object');
    assert.is(result3 instanceof Date, true);
    assert.is(result3.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result4 = parseTime('1hour');
    assert.is(typeof result4, 'object');
    assert.is(result4 instanceof Date, true);
    assert.is(result4.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result5 = parseTime('1hours');
    assert.is(typeof result5, 'object');
    assert.is(result5 instanceof Date, true);
    assert.is(result5.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result6 = parseTime('1 h');
    assert.is(typeof result6, 'object');
    assert.is(result6 instanceof Date, true);
    assert.is(result6.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result7 = parseTime('1 hr');
    assert.is(typeof result7, 'object');
    assert.is(result7 instanceof Date, true);
    assert.is(result7.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result8 = parseTime('1 hrs');
    assert.is(typeof result8, 'object');
    assert.is(result8 instanceof Date, true);
    assert.is(result8.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result9 = parseTime('1 hour');
    assert.is(typeof result9, 'object');
    assert.is(result9 instanceof Date, true);
    assert.is(result9.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result10 = parseTime('1 hours');
    assert.is(typeof result10, 'object');
    assert.is(result10 instanceof Date, true);
    assert.is(result10.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

});

test('parses a time from a time string (1d 1day 1days, 1 d 1 day 1 days)', () => {

    const result = parseTime('1d');
    assert.is(typeof result, 'object');
    assert.is(result instanceof Date, true);
    assert.is(result.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result2 = parseTime('1day');
    assert.is(typeof result2, 'object');
    assert.is(result2 instanceof Date, true);
    assert.is(result2.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result3 = parseTime('1days');
    assert.is(typeof result3, 'object');
    assert.is(result3 instanceof Date, true);
    assert.is(result3.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result4 = parseTime('1 d');
    assert.is(typeof result4, 'object');
    assert.is(result4 instanceof Date, true);
    assert.is(result4.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result5 = parseTime('1 day');
    assert.is(typeof result5, 'object');
    assert.is(result5 instanceof Date, true);
    assert.is(result5.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

    const result6 = parseTime('1 days');
    assert.is(typeof result6, 'object');
    assert.is(result6 instanceof Date, true);
    assert.is(result6.getTime() - Date.now() - 1000 * 60 * 60 * 24 < 1000, true);

});

test('parses a time from a time string (1w 1wk 1wks 1week 1weeks, 1 w 1 wk 1 wks 1 week 1 weeks)', () => {

    const result = parseTime('1w');
    assert.is(typeof result, 'object');
    assert.is(result instanceof Date, true);
    assert.is(result.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 7 < 1000, true);

    const result2 = parseTime('1wk');
    assert.is(typeof result2, 'object');
    assert.is(result2 instanceof Date, true);
    assert.is(result2.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 7 < 1000, true);

    const result3 = parseTime('1wks');
    assert.is(typeof result3, 'object');
    assert.is(result3 instanceof Date, true);
    assert.is(result3.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 7 < 1000, true);

    const result4 = parseTime('1week');
    assert.is(typeof result4, 'object');
    assert.is(result4 instanceof Date, true);
    assert.is(result4.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 7 < 1000, true);

    const result5 = parseTime('1weeks');
    assert.is(typeof result5, 'object');
    assert.is(result5 instanceof Date, true);
    assert.is(result5.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 7 < 1000, true);

    const result6 = parseTime('1 w');
    assert.is(typeof result6, 'object');
    assert.is(result6 instanceof Date, true);
    assert.is(result6.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 7 < 1000, true);

    const result7 = parseTime('1 wk');
    assert.is(typeof result7, 'object');
    assert.is(result7 instanceof Date, true);
    assert.is(result7.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 7 < 1000, true);

    const result8 = parseTime('1 wks');
    assert.is(typeof result8, 'object');
    assert.is(result8 instanceof Date, true);
    assert.is(result8.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 7 < 1000, true);

    const result9 = parseTime('1 week');
    assert.is(typeof result9, 'object');
    assert.is(result9 instanceof Date, true);
    assert.is(result9.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 7 < 1000, true);

    const result10 = parseTime('1 weeks');
    assert.is(typeof result10, 'object');
    assert.is(result10 instanceof Date, true);
    assert.is(result10.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 7 < 1000, true);

});

test('parses a time from a time string (1mo 1mos 1month 1months, 1 mo 1 mos 1 month 1 months)', () => {

    const result = parseTime('1mo');
    assert.is(typeof result, 'object');
    assert.is(result instanceof Date, true);
    assert.is(result.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 30 < 1000, true);

    const result2 = parseTime('1mos');
    assert.is(typeof result2, 'object');
    assert.is(result2 instanceof Date, true);
    assert.is(result2.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 30 < 1000, true);

    const result3 = parseTime('1month');
    assert.is(typeof result3, 'object');
    assert.is(result3 instanceof Date, true);
    assert.is(result3.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 30 < 1000, true);

    const result4 = parseTime('1months');
    assert.is(typeof result4, 'object');
    assert.is(result4 instanceof Date, true);
    assert.is(result4.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 30 < 1000, true);

    const result5 = parseTime('1 mo');
    assert.is(typeof result5, 'object');
    assert.is(result5 instanceof Date, true);
    assert.is(result5.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 30 < 1000, true);

    const result6 = parseTime('1 mos');
    assert.is(typeof result6, 'object');
    assert.is(result6 instanceof Date, true);

    const result7 = parseTime('1 month');
    assert.is(typeof result7, 'object');
    assert.is(result7 instanceof Date, true);
    assert.is(result7.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 30 < 1000, true);

    const result8 = parseTime('1 months');
    assert.is(typeof result8, 'object');
    assert.is(result8 instanceof Date, true);
    assert.is(result8.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 30 < 1000, true);

});

test('parses a time from a time string (1y 1yr 1yrs 1year 1years, 1 y 1 yr 1 yrs 1 year 1 years)', () => {

    const result = parseTime('1y');
    assert.is(typeof result, 'object');
    assert.is(result instanceof Date, true);
    assert.is(result.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 365 < 1000, true);

    const result2 = parseTime('1yr');
    assert.is(typeof result2, 'object');
    assert.is(result2 instanceof Date, true);
    assert.is(result2.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 365 < 1000, true);

    const result3 = parseTime('1yrs');
    assert.is(typeof result3, 'object');
    assert.is(result3 instanceof Date, true);
    assert.is(result3.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 365 < 1000, true);

    const result4 = parseTime('1year');
    assert.is(typeof result4, 'object');
    assert.is(result4 instanceof Date, true);
    assert.is(result4.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 365 < 1000, true);

    const result5 = parseTime('1years');
    assert.is(typeof result5, 'object');
    assert.is(result5 instanceof Date, true);
    assert.is(result5.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 365 < 1000, true);

    const result6 = parseTime('1 y');
    assert.is(typeof result6, 'object');
    assert.is(result6 instanceof Date, true);
    assert.is(result6.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 365 < 1000, true);

    const result7 = parseTime('1 yr');
    assert.is(typeof result7, 'object');
    assert.is(result7 instanceof Date, true);
    assert.is(result7.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 365 < 1000, true);

    const result8 = parseTime('1 yrs');
    assert.is(typeof result8, 'object');
    assert.is(result8 instanceof Date, true);
    assert.is(result8.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 365 < 1000, true);

    const result9 = parseTime('1 year');
    assert.is(typeof result9, 'object');
    assert.is(result9 instanceof Date, true);
    assert.is(result9.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 365 < 1000, true);

    const result10 = parseTime('1 years');
    assert.is(typeof result10, 'object');
    assert.is(result10 instanceof Date, true);
    assert.is(result10.getTime() - Date.now() - 1000 * 60 * 60 * 24 * 365 < 1000, true);

});

test('it throws if date is not a string, number or date', () => {
    
    assert.throws(() => parseTime({} as any), 'date must be a string, number or date');
    assert.throws(() => parseTime([] as any), 'date must be a string, number or date');
    assert.throws(() => parseTime((() => {}) as any), 'date must be a string, number or date');
    assert.throws(() => parseTime(undefined as any), 'date must be a string, number or date');
    assert.throws(() => parseTime(null as any), 'date must be a string, number or date');
    assert.throws(() => parseTime(true as any), 'date must be a string, number or date');
    assert.throws(() => parseTime(false as any), 'date must be a string, number or date');
    assert.throws(() => parseTime(NaN as any), 'date must be a string, number or date');
    assert.throws(() => parseTime(Infinity as any), 'date must be a string, number or date');
    assert.throws(() => parseTime(-Infinity as any), 'date must be a string, number or date');
    assert.throws(() => parseTime(Symbol('') as any), 'date must be a string, number or date');
    assert.throws(() => parseTime(new Map() as any), 'date must be a string, number or date');
    assert.throws(() => parseTime(new Set() as any), 'date must be a string, number or date');
    assert.throws(() => parseTime(new WeakMap() as any), 'date must be a string, number or date');
    assert.throws(() => parseTime(new WeakSet() as any), 'date must be a string, number or date');
    assert.throws(() => parseTime(new ArrayBuffer(0) as any), 'date must be a string, number or date');

});

test.run();
