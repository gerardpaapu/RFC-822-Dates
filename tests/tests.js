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
        'Wed, 02 Oct 2002 08:00:00 EST',
        'Wed, 02 Oct 2002 13:00:00 GMT',
        'Wed, 02 Oct 2002 15:00:00 +0200'
    ].forEach(function (dateString) {
        datesEqual(parseRfc822Date(dateString),
                   new Date(dateString));
    });
});

test('Invalid dates throw an Error', function () {
    [
        // Some other format
        '2002-10-02T08:00:00-05:00',

        // The wrong day of the week
        'Mon, 02 Oct 2002 15:00:00 +0200',

        // There aren't 65 days in the month
        'Wed, 65 Oct 2002 15:00:00 +0200'
    ].forEach(function (dateString) {
        throws(function () { parseRfc822Date(dateString); });
    });
});
