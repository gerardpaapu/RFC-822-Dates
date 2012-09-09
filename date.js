window['parseRfc822Date'] = (function (){
    /*jshint onevar: false */
    // Parse the date format as specified here:
    //
    // http://asg.web.cmu.edu/rfc/rfc822.html#sec-5.1
    //
    // And updated here:
    //
    // http://asg.web.cmu.edu/rfc/rfc1123.html#sec-5.2.14
    //	
    // date-time   =  [ day "," ] date time        ; dd mm yy
    //                                             ;  hh:mm:ss zzz
    // 
    // day         =  "Mon"  / "Tue" /  "Wed"  / "Thu"
    //             /  "Fri"  / "Sat" /  "Sun"
    // date        =  1*2DIGIT month 2*4DIGIT      ; day month year
    //                                             ;  e.g. 20 Jun 82
    // 
    // month       =  "Jan"  /  "Feb" /  "Mar"  /  "Apr"
    //             /  "May"  /  "Jun" /  "Jul"  /  "Aug"
    //             /  "Sep"  /  "Oct" /  "Nov"  /  "Dec"
    // 
    // time        =  hour zone                    ; ANSI and Military
    // 
    // hour        =  2DIGIT ":" 2DIGIT [":" 2DIGIT]
    //                                             ; 00:00:00 - 23:59:59
    // 
    // zone        =  "UT"  / "GMT"                ; Universal Time
    //                                             ; North American : UT
    //             /  "EST" / "EDT"                ;  Eastern:  - 5/ - 4
    //             /  "CST" / "CDT"                ;  Central:  - 6/ - 5
    //             /  "MST" / "MDT"                ;  Mountain: - 7/ - 6
    //             /  "PST" / "PDT"                ;  Pacific:  - 8/ - 7
    //             /  1ALPHA                       ; Military: Z = UT;
    //                                             ;  A:-1; (J not used)
    //                                             ;  M:-12; N:+1; Y:+12
    //             / ( ("+" / "-") 4DIGIT )        ; Local differential
    //                                             ;  hours+min. (HHMM)

    // The Day of the Week is optional
    var day = '(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun), )?';
    var DAY_OF_WEEK = 1;

    var month = '(\\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ((?:\\d{2})|(?:\\d{4}))';
    var DAY_OF_MONTH = 2;
    var MONTH = 3;
    var YEAR = 4;

    var hour = '(?: (\\d{2}):(\\d{2})(?::(\\d{2}))?)';
    var HOUR = 5;
    var MINUTE = 6;
    var SECOND = 7;

    var zone = ' (?:(UT|GMT|EST|EDT|CST|CDT|MST|MDT|PST|PDT|Z|A|M|N|Y)|(?:(?:(\\+|-)(\\d{2})(\\d{2}))))';
    var ZONE_CODE = 8;
    var OFFSET_SIGN = 9;
    var OFFSET_HOURS = 10;
    var OFFSET_MINUTES = 11;

    // Minutes and hours in ms
    var A_MINUTE = 60000;
    var AN_HOUR  = 60 * A_MINUTE;

    var months   = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];

    var zones = {
        UT: 0, GMT: 0,
        EST: -5, EDT: -4,
        CST: -6, CDT: -5,
        MST: -7, MDT: -6,
        PST: -8, PDT: -7,
        Z: 0
    };

    var pattern = new RegExp("^" + day + month + hour + zone + "$");

    // Some older browsers don't implement Array::indexOf
    // This implementation covers my one use-case.
    function indexOf(haystack, needle, i) {
        i = i || 0;
        var max = haystack.length;

        for (;i < max; i++) {
            if (haystack[i] === needle) return i;
        }
        return -1;
    }

    function parse(str) {
        function assert(fact, message) {
            if (!fact) { 
                throw new Error(message || 'Invalid RFC-822 Date: "' + str + '"');
            }
        }

        var match = pattern.exec(str);
        assert(match);

        var day = Number(match[DAY_OF_MONTH]);
        var month = indexOf(months, match[MONTH]);
        var year = Number(match[YEAR]);
        // I'm not sure if these are necessary,
        // bad values in these should result in an
        // invalid date, which we will reject.
        assert(day > 0 && day <= 31);
        assert(month >= 0 && month < 12);

        var hours = Number(match[HOUR]);
        var minutes = Number(match[MINUTE]);
        var seconds = Number(match[SECOND]);
        // I'm not sure these are necessary either
        // for the same reason.
        assert(hours >= 0 && hours <= 24);
        assert(minutes >= 0 && minutes <= 59);
        assert(seconds >= 0 && seconds <= 59);

        var local = new Date(year, month, day, hours, minutes, seconds);
        assert(!isNaN(+local));

        // Reject if the day of the week was supplied and it doesn't
        // match our local time day of the week
        if (match[DAY_OF_WEEK]) {
            var dayOfWeek = indexOf(weekdays, match[DAY_OF_WEEK]);
            assert(dayOfWeek === local.getDay());
        }

        // Convert from our local date-time to 
        // the same date-time at GMT 
        var localOffset = local.getTimezoneOffset() * A_MINUTE;
        var gmt = +local - localOffset;

        // The offset of the encoded date in milliseconds 
        var offset;
        if (match[ZONE_CODE]) {
            // The date was supplied as a letter code e.g. EST, GMT

            // The Suffixes 'A', 'M', 'N', and 'Y' were specified
            // incorrectly in RFC 822 and deprecated in RFC 1123
            assert(indexOf('AMNY'.split(''), match[ZONE_CODE]) === -1,
                   'Military suffixes are deprecated: ' + str);

            offset = zones[match[ZONE_CODE]] * AN_HOUR;
        } else {
            // The date was supplied as hours and minutes e.g. +1200
            var offsetSign = match[OFFSET_SIGN] === '-' ? -1 : +1;
            var offsetHours = Number(match[OFFSET_HOURS]);
            var offsetMinutes = Number(match[OFFSET_MINUTES]);

            offset = offsetSign * ((offsetHours * AN_HOUR) + (offsetMinutes * A_MINUTE));
        }

        // Assert that we are returning a valid date
        var result = new Date(gmt - offset);
        assert(!isNaN(+result));

        return result;
    }

    return parse;
}());
