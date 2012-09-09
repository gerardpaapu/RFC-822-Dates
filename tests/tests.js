// These tests rely on an existing Date implementation
// that supports RFC-822 dates... so if these work, this
// library is useless and if they fail it is also useless
/*globals test: false, ok: false, throws: false, parseRfc822Date: false */

function datesEqual(a, b) {
    return ok(a instanceof Date &&
              b instanceof Date &&
                  a >= b && a <= b);
}

test('Produce the same dates as builtin Date constructor', function () {
    [
        'Wed, 02 Oct 2002 13:00:00 UT',
        'Wed, 02 Oct 2002 13:00:00 GMT',
        'Wed, 02 Oct 2002 13:00:00 EST',
        'Wed, 02 Oct 2002 13:00:00 EDT',
        'Wed, 02 Oct 2002 13:00:00 CST',
        'Wed, 02 Oct 2002 13:00:00 CDT',
        'Wed, 02 Oct 2002 13:00:00 MST',
        'Wed, 02 Oct 2002 13:00:00 MDT',
        'Wed, 02 Oct 2002 13:00:00 PST',
        'Wed, 02 Oct 2002 13:00:00 PDT',
        'Wed, 02 Oct 2002 13:00:00 Z',
        'Wed, 02 Oct 2002 15:00:00 +0200'
    ].forEach(function (dateString) {
        datesEqual(parseRfc822Date(dateString),
                   new Date(dateString));
    });
});

test('Invalid dates throw an Error in strict mode', function () {
    [
        // Some other format
        '2002-10-02T08:00:00-05:00',

        // The wrong day of the week
        'Mon, 02 Oct 2002 15:00:00 +0200',

        // There aren't 65 days in the month
        'Wed, 65 Oct 2002 15:00:00 +0200',

        // There aren't 99 hours of timezones
        'Wed, 65 Oct 2002 15:00:00 +9900',

        // There aren't 99 minutes in an hour
        '01 Oct 2002 15:00:00 +0099',
        '01 Oct 2002 15:99:00 +0000',

        // There aren't 99 seconds in a minute
        '01 Oct 2002 15:00:99 +0000',

        // Suffixes deprecated in RFC 1123
        'Wed, 02 Oct 2002 13:00:00 A',
        'Wed, 02 Oct 2002 13:00:00 M',
        'Wed, 02 Oct 2002 13:00:00 N',
        'Wed, 02 Oct 2002 13:00:00 Y'
    ].forEach(function (dateString) {
        throws(function () { parseRfc822Date(dateString, true); },
               '"' + dateString + '" is a bad date time string');
    });
});
