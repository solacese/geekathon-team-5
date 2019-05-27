//
/*global solace:true window console BlobBuilder ArrayBuffer Uint8Array SOLACE_FATAL SOLACE_ERROR SOLACE_WARN SOLACE_INFO SOLACE_DEBUG SOLACE_TRACE SOLACE_CONSOLE_FATAL SOLACE_CONSOLE_ERROR SOLACE_CONSOLE_WARN SOLACE_CONSOLE_INFO SOLACE_CONSOLE_DEBUG SOLACE_CONSOLE_TRACE */
//
/**
 * Requires log4javascript
 * http://log4javascript.org/
 */
//






    


    


    


    


    


    


function SOLACE_TS() {
    // unroll logic for speed
    var ddd = new Date();
    var
            hh = ddd.getHours() + "",
            mm = ddd.getMinutes() + "",
            ss = ddd.getSeconds() + "",
            ms = ddd.getMilliseconds() + "";

    hh = hh.length < 2 ? "0" + hh : hh;
    mm = mm.length < 2 ? "0" + mm : mm;
    ss = ss.length < 2 ? "0" + ss : ss;
    ms = ms.length < 3 ? "0" + ms : ms;
    ms = ms.length < 3 ? "0" + ms : ms; //twice: pad to 3

    return hh + ":" + mm + ":" + ss + "." + ms;
}

function SOLACE_CONSOLE_FATAL(msg) {
    if (typeof console !== "undefined" && console.fatal && typeof solace !== "undefined" &&
            solace.SolclientFactory.getLogLevel() >= solace.LogLevel.FATAL) {
        msg = SOLACE_TS() + " " + msg;
        console.fatal(msg);
    }
}
function SOLACE_CONSOLE_ERROR(msg) {
    if (typeof console !== "undefined" && console.error && typeof solace !== "undefined" &&
            solace.SolclientFactory.getLogLevel() >= solace.LogLevel.ERROR) {
        msg = SOLACE_TS() + " " + msg;
        console.error(msg);
    }
}
function SOLACE_CONSOLE_WARN(msg) {
    if (typeof console !== "undefined" && console.warn && typeof solace !== "undefined" &&
            solace.SolclientFactory.getLogLevel() >= solace.LogLevel.WARN) {
        msg = SOLACE_TS() + " " + msg;
        console.warn(msg);
    }
}
function SOLACE_CONSOLE_INFO(msg) {
    if (typeof console !== "undefined" && console.info && typeof solace !== "undefined" &&
            solace.SolclientFactory.getLogLevel() >= solace.LogLevel.INFO) {
        msg = SOLACE_TS() + " " + msg;
        console.info("INFO:" + msg);
    }
}
function SOLACE_CONSOLE_DEBUG(msg) {
    if (typeof console !== "undefined" && console.debug && typeof solace !== "undefined" &&
            solace.SolclientFactory.getLogLevel() >= solace.LogLevel.DEBUG) {
        msg = SOLACE_TS() + " " + msg;
        console.debug("DEBUG:" + msg);
    }
}
function SOLACE_CONSOLE_TRACE(msg) {
    if (typeof console !== "undefined" && console.trace && typeof solace !== "undefined" &&
            solace.SolclientFactory.getLogLevel() >= solace.LogLevel.TRACE) {
        msg = SOLACE_TS() + " " + msg;
        console.trace("TRACE:" + msg);
    }
}
//

/**
 * @fileoverview
 * @license  Copyright 2009-2011 Solace Systems Inc. All rights reserved
 * http://www.SolaceSystems.com
 */
if (typeof window.solace === "undefined") {
    /**
     * @namespace
     * <h1> Overview </h1>
     * This is the Solace Systems Messaging SDK for JavaScript. Concepts
     * defined in this API are similar to those defined in other Solace Messaging SDKs
     * for Java, C, and .NET.
     * <h1> Concepts </h1>
     * Some general concepts:
     * <li> All function calls are non-blocking; confirmation, if requested, is
     * returned to the calling client application in the form of callbacks.
     * </li>
     * <p>
     * Copyright 2009-2011 Solace Systems Inc. All rights reserved.<br/>
     * <a href="http://www.SolaceSystems.com"> Solace Systems Inc. </a>
     * <p>
     *
     */
    var solace = {};
}

(function(solace) {

    /*
     * Date Format 1.2.3
     * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
     * MIT license
     *
     * Includes enhancements by Scott Trenda <scott.trenda.net>
     * and Kris Kowal <cixar.com/~kris.kowal/>
     *
     * Accepts a date, a mask, or a date and a mask.
     * Returns a formatted version of the given date.
     * The date defaults to the current date/time.
     * The mask defaults to dateFormat.masks.default.
     */
    var dateFormat = (function () {
        var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;
        var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[\-+]\d{4})?)\b/g;
        var timezoneClip = /[^\-+\dA-Z]/g;
        var pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) {
                    val = "0" + val;
                }
                return val;
            };

        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {
            var dF = dateFormat;

            // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
            if (arguments.length === 1 && Object.prototype.toString.call(date) === "[object String]" && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }

            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date();
            if (isNaN(date)) {
                throw new SyntaxError("invalid date");
            }

            mask = String(dF.masks[mask] || mask || dF.masks["default"]);

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) === "UTC:") {
                mask = mask.slice(4);
                utc = true;
            }

            var	prefix = utc ? "getUTC" : "get";
            var d = date[prefix + "Date"]();
            var D = date[prefix + "Day"]();
            var m = date[prefix + "Month"]();
            var y = date[prefix + "FullYear"]();
            var H = date[prefix + "Hours"]();
            var M = date[prefix + "Minutes"]();
            var s = date[prefix + "Seconds"]();
            var L = date[prefix + "Milliseconds"]();
            var o = utc ? 0 : date.getTimezoneOffset();
            var flags = {
                    d:    d,
                    dd:   pad(d),
                    ddd:  dF.i18n.dayNames[D],
                    dddd: dF.i18n.dayNames[D + 7],
                    m:    m + 1,
                    mm:   pad(m + 1),
                    mmm:  dF.i18n.monthNames[m],
                    mmmm: dF.i18n.monthNames[m + 12],
                    yy:   String(y).slice(2),
                    yyyy: y,
                    h:    H % 12 || 12,
                    hh:   pad(H % 12 || 12),
                    H:    H,
                    HH:   pad(H),
                    M:    M,
                    MM:   pad(M),
                    s:    s,
                    ss:   pad(s),
                    l:    pad(L, 3),
                    L:    pad(L > 99 ? Math.round(L / 10) : L),
                    t:    H < 12 ? "a"  : "p",
                    tt:   H < 12 ? "am" : "pm",
                    T:    H < 12 ? "A"  : "P",
                    TT:   H < 12 ? "AM" : "PM",
                    Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10]
                };

            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }());

    // Some common format strings
    dateFormat.masks = {
        "default":      "ddd mmm dd yyyy HH:MM:ss",
        shortDate:      "m/d/yy",
        mediumDate:     "mmm d, yyyy",
        longDate:       "mmmm d, yyyy",
        fullDate:       "dddd, mmmm d, yyyy",
        shortTime:      "h:MM TT",
        mediumTime:     "h:MM:ss TT",
        longTime:       "h:MM:ss TT Z",
        isoDate:        "yyyy-mm-dd",
        isoTime:        "HH:MM:ss",
        isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };

    // Internationalization strings
    dateFormat.i18n = {
        dayNames: [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        monthNames: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ]
    };

    // For convenience...
    Date.prototype.format = function (mask, utc) {
        return dateFormat(this, mask, utc);
    };
    

    /**
     * @private
     * ===========================================================================
     * Convert
     *
     * This collection of functions performs all required string to number and number to string
     * conversions
     * ============================================================================
     */
    solace.Convert = (function () {
        var threeZerosStr = String.fromCharCode(0,0,0);
        var twoZerosStr   = String.fromCharCode(0,0);
        var obj = {

            int8ToStr: function (int8) {
                return String.fromCharCode(int8 & 0xff);
            },

            int16ToStr: function (int16) {
                return (String.fromCharCode((int16 >> 8) & 0xff) + String.fromCharCode(int16 & 0xff));
            },
            int24ToStr: function(int24) {
                return (String.fromCharCode((int24 >> 16) & 0xff) + String.fromCharCode((int24 >> 8) & 0xff) + String.fromCharCode(int24 & 0xff));
            },
            int32ToStr: function (int32) {

                // It is expected that there are a lot of small numbers
                // being converted, so it is worth doing a few checks for
                // efficiency (on firefox it is about 3 times quicker for small numbers
                // to do the check - it is 2 times quicker for chrome)
                if (int32 >= 0 && int32 < 256) {
                    return threeZerosStr + String.fromCharCode(int32);
                }
                else if (int32 >= 0 && int32 < 65536) {
                    return twoZerosStr + String.fromCharCode(int32 >> 8) + String.fromCharCode(int32 & 0xff);
                }
                else {
                    return (String.fromCharCode((int32 >> 24) & 0xff) +
                            String.fromCharCode((int32 >> 16) & 0xff) +
                            String.fromCharCode((int32 >> 8) & 0xff) +
                            String.fromCharCode(int32 & 0xff));
                }

            },

            byteArrayToStr: function (byteArray) {
                for (var i = 0; i < byteArray.length; i++) {
                    byteArray[i] = String.fromCharCode(byteArray[i]);
                }
                return byteArray.join("");
            },

            strToByteArray: function (str) {
                var arr = [];
                for (var i = 0; i < str.length; i++) {
                    arr.push(str.charCodeAt(i));
                }
                return arr;
            },

            strToInt8: function (data) {
                return data.charCodeAt(0);
            },

            strToInt16: function (data) {
                return ((data.charCodeAt(0) << 8) +
                        data.charCodeAt(1));
            },
            strToInt24: function(data) {
                return ((data.charCodeAt(0) << 16) +
                        (data.charCodeAt(1) << 8) +
                        (data.charCodeAt(2)));
            },
            strToInt32: function (data) {
                return ((data.charCodeAt(0) << 24) +
                        (data.charCodeAt(1) << 16) +
                        (data.charCodeAt(2) <<  8) +
                         data.charCodeAt(3));
            }

        };

        return obj;
    }());


    // This code was written by Tyler Akins and has been placed in the
    // public domain.  It would be nice if you left this header intact.
    // Base64 code from Tyler Akins -- http://rumkin.com

    // It has been modified by me (Edward Funnekotter) to improve its
    // efficiency
    solace.Base64 = (function () {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var encLut = [ -1, -1, -1, -1, -1, -1, -1, -1,
                       -1, -1, 99, -1, -1, 99, -1, -1,
                       -1, -1, -1, -1, -1, -1, -1, -1,
                       -1, -1, -1, -1, -1, -1, -1, -1,
                       99, -1, -1, -1, -1, -1, -1, -1,
                       -1, -1, -1, 62, -1, -1, -1, 63,
                       52, 53, 54, 55, 56, 57, 58, 59,
                       60, 61, -1, -1, -1, 64, -1, -1,

                       // 64
                       -1,  0,  1,  2,  3,  4,  5,  6,
                        7,  8,  9, 10, 11, 12, 13, 14,
                       15, 16, 17, 18, 19, 20, 21, 22,
                       23, 24, 25, -1, -1, -1, -1, -1,
                       -1, 26, 27, 28, 29, 30, 31, 32,
                       33, 34, 35, 36, 37, 38, 39, 40,
                       41, 42, 43, 44, 45, 46, 47, 48,
                       49, 50, 51, -1, -1, -1, -1, -1,

                       // 128
                       -1, -1, -1, -1, -1, -1, -1, -1,
                       -1, -1, -1, -1, -1, -1, -1, -1,
                       -1, -1, -1, -1, -1, -1, -1, -1,
                       -1, -1, -1, -1, -1, -1, -1, -1,
                       -1, -1, -1, -1, -1, -1, -1, -1,
                       -1, -1, -1, -1, -1, -1, -1, -1,
                       -1, -1, -1, -1, -1, -1, -1, -1,
                       -1, -1, -1, -1, -1, -1, -1, -1,

                       // 194
                       -1, -1, -1, -1, -1, -1, -1, -1,
                       -1, -1, -1, -1, -1, -1, -1, -1,
                       -1, -1, -1, -1, -1, -1, -1, -1,
                       -1, -1, -1, -1, -1, -1, -1, -1,
                       -1, -1, -1, -1, -1, -1, -1, -1,
                       -1, -1, -1, -1, -1, -1, -1, -1,
                       -1, -1, -1, -1, -1, -1, -1, -1,
                       -1, -1, -1, -1, -1, -1, -1, -1 ];


        var obj = {
            /**
             * @private
             * Encodes a string in base64
             * @param {String} input The string to encode in base64.
             */
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;
                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) + keyStr.charAt(enc4);
                } while (i < input.length);

                return output;
            },

            /**
             * @private
             * Decodes a base64 string.
             * @param {String} input The string to decode.
             */
            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;

                //console.log("decoding " + input.length + " bytes: \n" + input);
                do {
                    while (encLut[input.charCodeAt(i)] > 64) {
                        i++;
                    }
                    enc1 = encLut[input.charCodeAt(i++)];
                    enc2 = encLut[input.charCodeAt(i++)];
                    enc3 = encLut[input.charCodeAt(i++)];
                    enc4 = encLut[input.charCodeAt(i++)];

                    if (enc1 < 0 || enc2 < 0 || enc3 < 0 || enc4 < 0) {
                        // Invalid character in base64 text
                        // alert("enc at " + i + ": " + enc1 + ", " + enc2 + ", " + enc3 + ", " + enc4);
                        throw(new solace.TransportError("Invalid base64 character in data stream",
                                                        solace.TransportSessionEventCode.DATA_DECODE_ERROR));
                    }

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 !== 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 !== 64) {
                        output = output + String.fromCharCode(chr3);
                    }
                } while (i < input.length-3);

                //console.log("returning " + output.length + " bytes");
                return output;
            }
        };

        return obj;
    }());

// Optimization for browsers that have built in base64 functions
    if (window.atob) {
        solace.base64_encode = function(data) {return window.btoa(data);};
        solace.base64_decode = function(data) {return window.atob(data);};
    }
    else {
        solace.base64_encode = solace.Base64.encode;
        solace.base64_decode = solace.Base64.decode;
    }

    solace.TopicUtil = (function() {
        var obj = {
            toSafeChars: function(topic) {
                topic = topic.replace(/[^a-zA-Z0-9_\/.]/g, "");
                return topic;
            },
            validateTopic: function(topicName) {
                // return null if valid, return error msg on invalid
                /*
                 * TRB topics can contain any utf-8 character and must be <= 250 bytes
                 * in length.
                 * '*', if present in a level, must be the last character in that level.
                 * May not have empty levels.
                 */
                if (typeof topicName !== "string") {
                    return "topicName must be a string.";
                }
                var length = topicName.length;
                if (length < 1) {
                    return "Topic too short (must be >= 1 character).";
                } else if (length > 250) {
                    return "Topic too long (must be <= 250 characters).";
                }
                for (var i = 0; i < length; i++) {
                    var curChar = topicName.charAt(i);
                    if (curChar === "/") {
                        if (i === 0 || i === (length - 1) || topicName.charAt(i - 1) === "/") {
                            return "Topic has empty level.";
                        }
                    } else if (curChar === "*" && (i < length - 1)) {
                        // must not have something other than '/' to the right
                        if (topicName.charAt(i + 1) !== "/") {
                            return "Topic has illegal wildcard.";
                        }
                    }
                }
                return null;
            },
            isWildcarded: function(topicName) {
                var len = topicName.length;
                if (topicName === ">") {
                    return true;
                } else if (len >= 2 &&
                        topicName.charAt(len - 2) === "/" &&
                        topicName.charAt(len - 1) === ">") {
                    return true;
                } else if (topicName.indexOf("*", 0) !== -1) {
                    return true;
                }
                return false;
            }
        };
        return obj;
    }());

    /**
     * @private
     * @class
     * This class is used for efficiently concatenate strings.
     * @constructor
     * @param {...*} varargs
     */
    solace.StringBuffer = function(varargs) {
        this.buffer = [];
        if (arguments.length === 1) {
            this.buffer.push(arguments[0]);
        }
    };

    solace.StringBuffer.prototype.append = function(string) {
        if (string !== undefined) {
            this.buffer.push(string);
        }
        return this;
    };

    solace.StringBuffer.prototype.toString = function() {
        return this.buffer.join("");
    };

    solace.StringUtil = (function StringUtil(){
        var PAD_LEFT = 0;
        var PAD_RIGHT = 1;

        function padLeftRight(str, minLen, padSide, padChar) {
            if (typeof str === "string") {
                if (str.length < minLen) {
                    var c = " ";
                    if (typeof padChar === "string" && padChar.length === 1) {
                        c = padChar;
                    }
                    var StringBuffer = solace.StringBuffer;
                    var buf = new StringBuffer();
                    for (var i = 0; i < (minLen - str.length); i++) {
                        buf.append(c);
                    }
                    switch (padSide) {
                        case PAD_LEFT:
                            return buf.toString() + str;
                        case PAD_RIGHT:
                            return str + buf.toString();
                        default:
                            return str;
                    }
                }
            }
            return str;
        }

        return {
            padLeft: function(str, minLen, padChar) {
                return padLeftRight(str, minLen, PAD_LEFT, padChar);
            },

            padRight: function(str, minLen, padChar) {
                return padLeftRight(str, minLen, PAD_RIGHT, padChar);
            },

            notEmpty: function(str) {
                return (typeof str !== "undefined" && str !== null && str.length > 0);
            },

            formatDumpBytes: function(data, showDecode, leftPadding) {
                if (!this.notEmpty(data)) {
                    return null;
                }
                var output = [], curr_ascii = [], curr_line = [];
                var lineBytes = 0;
                var ascii_offset = 54;
                var lu_print = (function() {
                    var tmp = [];
                    for (var c = 0; c < 256; c++) {
                        tmp[c] = (c < 33 || c > 126) ? "." : String.fromCharCode(c);
                    }
                    return tmp;
                }());

                for (var i = 0; i < data.length; i++) {
                    var ccode = data.charCodeAt(i);
                    curr_line.push(this.padLeft(ccode.toString(16), 2, "0"));
                    curr_line.push(" ");
                    curr_ascii.push(lu_print[ccode] || ".");
                    lineBytes++;

                    if (lineBytes === 8) {
                        curr_line.push("   ");
                    }
                    if (lineBytes === 16 || i === data.length -1) {
                        if (leftPadding > 0) {
                            output.push(this.padRight("", leftPadding, " "));
                        }
                        output.push(this.padRight(curr_line.join(""), ascii_offset, " "));
                        if (showDecode) {
                            output.push(curr_ascii.join(""));
                        }
                        output.push("\n");
                        curr_line = [];
                        curr_ascii = [];
                        lineBytes = 0;
                    }
                }
                return output.join("");
            }

        };
    }());

}(solace));
//
/*global solace:true window console BlobBuilder ArrayBuffer Uint8Array SOLACE_FATAL SOLACE_ERROR SOLACE_WARN SOLACE_INFO SOLACE_DEBUG SOLACE_TRACE SOLACE_CONSOLE_FATAL SOLACE_CONSOLE_ERROR SOLACE_CONSOLE_WARN SOLACE_CONSOLE_INFO SOLACE_CONSOLE_DEBUG SOLACE_CONSOLE_TRACE */
// 
// 
//
//

(function(solace) {
    /**
     * @class
     * Defines an error subcode enumeration which is returned as a property of
     * the errors/exceptions thrown by the API.
     * @static
     *
     * <h4>General Login Failure Subcodes</h4>
     * The following subcodes can apply to error responses resulting from
     * failed login attempts. As a login attempt failure can result from every session
     * operation that communicates with the router, they are listed here to avoid
     * repetition.
     * <ul>
     * <li>{@link solace.ErrorSubcode.CLIENT_NAME_INVALID}
     * <li>{@link solace.ErrorSubcode.CLIENT_NAME_ALREADY_IN_USE}
     * <li>{@link solace.ErrorSubcode.LOGIN_FAILURE}
     * <li>{@link solace.ErrorSubcode.CLIENT_USERNAME_IS_SHUTDOWN}
     * <li>{@link solace.ErrorSubcode.DYNAMIC_CLIENTS_NOT_ALLOWED}
     * <li>{@link solace.ErrorSubcode.CLIENT_ACL_DENIED}
     * <li>{@link solace.ErrorSubcode.INVALID_VIRTUAL_ADDRESS}
     * <li>{@link solace.ErrorSubcode.MSG_VPN_NOT_ALLOWED}
     * <li>{@link solace.ErrorSubcode.MSG_VPN_UNAVAILABLE}
     * <li>{@link solace.ErrorSubcode.CLIENT_DELETE_IN_PROGRESS}
     * <li>{@link solace.ErrorSubcode.TOO_MANY_CLIENTS}
     * </ul>
     */
    solace.ErrorSubcode = {
        // SESSION
        /**
         * @constant
         * @description Errors that do not have a proper subcode.
         *
         */
        UNKNOWN_ERROR: 999,
        /**
         * @constant
         * @description The session is already connected.
         */
        //SESSION_ALREADY_CONNECTED: 1,
        /**
         * @constant
         * @description The session is not connected.
         */
        SESSION_NOT_CONNECTED: 2,
        /**
         * @constant
         * @description The performed session operation is invalid given the state
         * of the session.
         */
        INVALID_SESSION_OPERATION: 3,
        /**
         * @constant
         * @description An API call failed due to a timeout.
         */
        TIMEOUT: 4,

        // MESSAGE VPN
        /**
         * @constant
         * @description The Message VPN name configured for the session is not configured to allow access for
         * the session's username. (Cause: 403 Message VPN Not Allowed)
         */
        MESSAGE_VPN_NOT_ALLOWED: 5,
        /**
         * @constant
         * @description The Message VPN name set for the session (or the default VPN if none
         * was set) is currently shutdown on the router. (Cause: 503 Message VPN Unavailable)
         */
        MESSAGE_VPN_UNAVAILABLE: 6,

        // CLIENT
        /**
         * @constant
         * @description The username for the client is administratively shutdown
         * on the router. (Cause: 403 Client Username Is Shutdown)
         */
        CLIENT_USERNAME_IS_SHUTDOWN: 7,
        /**
         * @constant
         * @description The username for the session has not been set and dynamic
         * clients are not allowed. (Cause: 403 Dynamic Clients Not Allowed)
         */
        DYNAMIC_CLIENTS_NOT_ALLOWED: 8,
        /**
         * @constant
         * @description The session is attempting to use a client name that is 
		 * in use by another client, and the router is configured to reject the 
		 * new session. 
		 * A client name cannot be used by multiple clients in the same Message 
		 * VPN. (Cause: 403 Client Name Already In Use)
         */
        CLIENT_NAME_ALREADY_IN_USE: 9,
        /**
         * @constant
         * @description The client name chosen has been rejected as invalid by the router.
         * (Cause: 400 Client Name Parse Error)
         */
        CLIENT_NAME_INVALID: 10,
        /**
         * @constant
         * @description The client login is not currently possible because a previous
         * instance of same client was being deleted. (Cause: 503 Subscriber Delete In
	     * Progress)
         */
        CLIENT_DELETE_IN_PROGRESS: 11,
        /**
         * @constant
         * @description The client login is not currently possible because the maximum
         * number of active clients on router has already been reached.
         * (Cause: 503 Too Many Clients, 503 Too Many Publishers, 503 Too Many Subscribers)
         */
        TOO_MANY_CLIENTS: 12,
        /**
         * @constant
         * @description The client could not log into the router. (Cause: 401, 404 error codes)
         */
        LOGIN_FAILURE: 13,

        // VRID
        /**
         * @constant
         * @description An attempt was made to connect to the wrong IP address on
         * the router (must use CVRID if configured), or the router CVRID has
         * changed and this was detected on reconnect. (Cause: 403 Invalid Virtual Router Address)
         */
        INVALID_VIRTUAL_ADDRESS: 14,

        // ACL
        /**
         * @constant
         * @description The client login to the router was denied because the
         * IP address/netmask combination used for the client is designated in the
         * ACL (Access Control List) profile associated with that client. (Cause: 403 Forbidden)
         */
        CLIENT_ACL_DENIED: 15,
        /**
         * @constant
         * @description Adding a subscription was denied because it matched a
         * subscription that was defined as denied on the ACL (Access Control List) profile associated with the client.
         * (Cause: 403 Subscription ACL Denied)
         */
        SUBSCRIPTION_ACL_DENIED: 16,
        /**
         * @constant
         * @description A message could not be published because its topic matched
         * a topic defined as denied on the ACL (Access Control List) profile associated with the client. (Cause: 403 Publish ACL Denied)
         */
        PUBLISH_ACL_DENIED: 17,

        // VALIDATION
        /**
         * @constant
         * @description An API call was made with an out-of-range parameter.
         */
        PARAMETER_OUT_OF_RANGE: 18,
        /**
         * @constant
         * @description An API call was made with a parameter combination
         * that is not valid.
         */
        //PARAMETER_CONFLICT: 19,
        /**
         * @constant
         * @description An API call was made with a parameter of incorrect type.
         */
        PARAMETER_INVALID_TYPE: 20,

        // FATAL ERRORS
        /**
         * @constant
         * @description  An API call had an internal error (not an application fault).
         */
        INTERNAL_ERROR: 21,
        /**
         * @constant
         * @description An API call failed due to insufficient space in the transport buffer to accept more data.
         */
        INSUFFICIENT_SPACE: 22,
        /**
         * @constant
         * @description An API call failed due to lack of resources. (Cause: 400 Not Enough Space)
         */
        OUT_OF_RESOURCES: 23,
        /**
         * @constant
         * @description An API call failed due to a protocol error with the router
         * (not an application fault).
         */
        PROTOCOL_ERROR: 24,
        /**
         * @constant
         * @description An API call failed due to a communication error.
         */
        COMMUNICATION_ERROR: 25,

        // KEEP ALIVE
        /**
         * @constant
         * @description The session keep-alive detected a failed session.
         */
        KEEP_ALIVE_FAILURE: 26,

        // MESSAGE RELATED
        /**
         * @constant
         * @description An attempt was made to use a topic which is longer
         * than the maximum that is supported.
         */
        //TOPIC_TOO_LARGE: 27,
        /**
         * @constant
         * @description A send call was made that did not have a topic in a mode
         * where one is required (for example, client mode).
         */
        TOPIC_MISSING: 28,
//        /**
//         * @constant
//         * @description  An attempt was made to send a message with a total
//         * size greater than that supported by the protocol. (???)
//         */
//        MAX_TOTAL_MSGSIZE_EXCEEDED: 29,
        /**
         * @constant
         * @description An attempt was made to send a message with user data larger
         * than the maximum that is supported.
         */
        //USER_DATA_TOO_LARGE: 30,
        /**
         * @constant
         * @description An attempt was made to use a topic which has a syntax that
         * is not supported. (Cause: 400 Topic Parse Error)
         */
        INVALID_TOPIC_SYNTAX: 31,
        /**
         * @constant
         * @description The client attempted to send a message larger than that
         * supported by the router. (Cause: 400 Document Is Too Large, 400 Message Too Long)
         */
        MESSAGE_TOO_LARGE: 32,
        /**
         * @constant
         * @description The router could not parse an XML message. (Cause: 400 XML Parse Error)
         */
        XML_PARSE_ERROR: 33,

        // SUBSCRIPTIONS
        /**
         * @constant
         * @description The client attempted to add a subscription that already
         * exists. This subcode is only returned if the session property
         * 'IgnoreDuplicateSubscription' is not enabled. (Cause: 400
	     * Already Exists, 400 Subscription Already Exists)
         */
        SUBSCRIPTION_ALREADY_PRESENT: 34,
        /**
         * @constant
         * @description The client attempted to remove a subscription which did not exist.
         * This subcode is only returned if the session property 'IgnoreDuplicateSubscription' is not enabled.
         * (Cause: 400 Not Found, 400 Subscription Not Found)
         */
        SUBSCRIPTION_NOT_FOUND: 35,
        /**
         * @constant
         * @description The client attempted to add/remove a subscription that
         * is not valid. (Cause: 400 Not Supported, 400 Parse Error, 400 Subscription Parse Error)
         */
        SUBSCRIPTION_INVALID: 36,
        /**
         * @constant
         * @description The router rejected a subscription add or remove request
         * for a reason not separately enumerated.
         */
        SUBSCRIPTION_ERROR_OTHER: 37,
        /**
         * @constant
         * @description The client attempted to add a subscription that
         * exceeded the maximum number allowed. (Cause: 400 Max Num Subscriptions Exceeded)
         */
        SUBSCRIPTION_TOO_MANY: 38,
        /**
         * @constant
         * @description  The client attempted to add a subscription which already
         * exists but it has different properties
         * (like topicIsReceiveAllDeliverToOne).
         * {@link solace.Session#subscribe()}
         * (Cause: 400 Subscription Attributes Conflict With Existing Subscription)
         */
        SUBSCRIPTION_ATTRIBUTES_CONFLICT: 39,

        /**
         * @constant
         * @description The client attempted to establish a session with No Local
         * enabled and the capability is not supported by the router.
         */
        NO_LOCAL_NOT_SUPPORTED: 40,

        // UNKNOWN ERRORS
        /**
         * @constant
         * @description The router rejected a control message for another reason
         * not separately enumerated.
         */
        //CONTROL_ERROR_OTHER: 41,
        /**
         * @constant
         * @description The router rejected a data message for another reason
         * not separately enumerated.
         */
        DATA_ERROR_OTHER: 42,

        // TRANSPORT ERRORS
        /**
         * @constant
         * @description Failed to create the HTTP connection.
         */
        CREATE_XHR_FAILED: 43,
        /**
         * @constant
         * @description Failed to create the HTTP transport.
         */
        INTERNAL_CONNECTION_ERROR: 44,
        /**
         * @constant
         * @description Failed to decode the HTTP reply.
         */
        DATA_DECODE_ERROR: 45,
        /**
         * @constant
         * @description The session was inactive for too long.
         */
        INACTIVITY_TIMEOUT: 46,
        /**
         * @constant
         * @description The router does not know this session's identifier.
         */
        UNKNOWN_TRANSPORT_SESSION_ID: 47
    };

    /**
     * Defines the possible TransportSessionEvent codes.
     * @private
     */
    solace.TransportSessionEventCode = {
        // Raised when TransportSession is up and ready to send/receive data
        UP_NOTICE: 1,

        // Raised if the session is destroyed
        DESTROYED_NOTICE: 2,

        // Raised on entry to the transport session waiting for create response state
        CONNECTING: 3,

        // Raised when the send queue had reached its maximum, but now has space again
        CAN_ACCEPT_DATA: 4,

        // Raised when there is a decode error on received data.  The app should destroy the session
        DATA_DECODE_ERROR: 5,

        // Raised when there is a decode error on received data.  The app should destroy the session
        PARSE_FAILURE: 6,

        // There was an error on the router connection that has caused the session to fail
        CONNECTION_ERROR: 7,

        // Notify token received (for resetting KeepAlive)
        NOTIFY_GOT_TOKEN: 8
    };
    
    /**
     * @class
     * An attribute of solace.SessionEvent. This enumeration represents the
     * different events emitted by {@link solace.Session} through the session event
     * callback.
     *
     * When a session is no longer in a usable state, the SDK tears down the underlying
     * connection and notifies the application with one of the following session event codes:
     * <ul>
     * <li>{@link solace.SessionEventCode.DOWN_ERROR}
     * <li>{@link solace.SessionEventCode.CONNECT_FAILED_ERROR}
     * <li>{@link solace.SessionEventCode.REQUEST_TIMEOUT}
     * <li>{@link solace.SessionEventCode.REAPPLY_SUBSCRIPTION_ERROR}
     * <li>{@link solace.SessionEventCode.LOGIN_FAILURE}
     * <li>{@link solace.SessionEventCode.P2P_SUB_ERROR}
     * <li>{@link solace.SessionEventCode.PARSE_FAILURE}
     * <li>{@link solace.SessionEventCode.DATA_DECODE_ERROR}
     * <li>{@link solace.SessionEventCode.KEEP_ALIVE_ERROR}
     * <li>{@link solace.SessionEventCode.INTERNAL_ERROR}
     * </ul>
     *
     * The client application receives a session event with event code {@link solace.SessionEventCode.DISCONNECTED}
     * when the underlying connection is successfully closed, or closed as a result of a communication error. It is recommended that upon receiving
     * the above listed events, the client application should call {@link solace.Session#disconnect} to properly
     * close the session or call {@link solace.Session#dispose} to release all the resources referenced by the
     * session.
     * <p>
     * When a connection is disconnected, any queued data waiting in the output buffer is cleared.
     *
     * @static
     */
    solace.SessionEventCode = {
        /**
         * Raised when the Session is ready to send/receive messages
         * and perform control operations.
         *
         * At this point the transport session is up, the Session
         * has logged in and added the P2PInbox subscription.
         *
         * @constant
         * @description The session is established.
         */
        UP_NOTICE: 1,
        /**
         * Raised when the underlying connection is down.
         *
         * @constant
         * @description The session was established and then went down
         */
        DOWN_ERROR: 2,
        /**
         * @constant
         * @description  The session attempted to connect but was unsuccessful.
         */
        CONNECT_FAILED_ERROR: 3,
        /**
         * @Constant
         * @description  Raised when connect() was called on the Session to establish transport session.
         *
         */
        CONNECTING: 4,
        /**
         * @constant
         * @description The router rejected a published message.
         */
        REJECTED_MESSAGE_ERROR: 5,
        /**
         * @constant
         * @description The router rejected a subscription (add or remove).
         */
        SUBSCRIPTION_ERROR: 6,
        /**
         * @constant
         * @description The subscribe or unsubscribe operation succeeded.
         */
        SUBSCRIPTION_OK: 7,
        /**
         * @constant
         * @description The router's Virtual Router Name changed during a reconnect operation.
         */
        VIRTUALROUTER_NAME_CHANGED: 8,
        /**
         * @constant
         * @description Raised when a request is aborted because the session is being disconnected.
         */
        REQUEST_ABORTED: 9,
        /**
         * @constant
         * @description The event represents a timed-out request API call.
         */
        REQUEST_TIMEOUT: 10,
        /**
         * @constant
         * @description The event represents a successful update of a mutable session property.
         */
        PROPERTY_UPDATE_OK: 11,
        /**
         * @constant
         * @description The event represents a failed update of a mutable session property.
         */
        PROPERTY_UPDATE_ERROR: 12,
        /**
         * @constant
         * @description Raised when failure occurred while applying subscriptions.
         */
        REAPPLY_SUBSCRIPTION_ERROR: 13,
        /**
         * @constant
         * @description Raised when underlying transport can accept data again.
         */
        CAN_ACCEPT_DATA: 14,
        /**
         * @Constant
         * @description Raised when the session's connect operation fails, or the session was once up, is now disconnected.
         */
        DISCONNECTED: 15,
        /**
         * @constant
         * @description Raised when a login fails.
         */
        LOGIN_FAILURE: 16,
        /**
         * @constant
         * @description Raised when P2P registration fails.
         */
        P2P_SUB_ERROR: 17,
        /**
         * @constant
         * @description Raised when incoming data cannot be parsed properly.
         */
        PARSE_FAILURE: 18,
        /**
         * @constant
         * @description Raised when decoding incoming data fails.
         */
        DATA_DECODE_ERROR: 19,
        /**
         * @constant
         * @description Raised when failure occurred while sending keep alive.
         */
        KEEP_ALIVE_ERROR: 20,
        /**
         * @constant
         * @description Raised when there is a internal SDK error.
         */
        INTERNAL_ERROR: 21
    };

    /**
     * Session Event Code description
     * @private
     */
    solace.SessionEventCodeDescription = (function(){
        var descriptions = [];
        var index;
        for (index in solace.SessionEventCode) {
            if (solace.SessionEventCode.hasOwnProperty(index)) {
                descriptions[solace.SessionEventCode[index]] = index;
            }
        }
        return descriptions;
    }());


    /**
     * Session state description.
     * @private
     */
    solace.InternalSessionStateDescription = (function() {
        var descriptions = [];
        descriptions[0] = "NEW";
        descriptions[1] = "DISCONNECTED";
        descriptions[2] = "WAITING_FOR_TRANSPORT_UP";
        descriptions[3] = "TRANSPORT_SESSION_UP";
        descriptions[4] = "WAITING_FOR_LOGIN";
        descriptions[5] = "LOGIN_COMPLETE";
        descriptions[6] = "WAITING_FOR_P2PINBOX_REG";
        descriptions[7] = "P2PINBOX_REG_COMPLETE";
        descriptions[8] = "CONNECTED";
        descriptions[9] = "SESSION_ERROR";
        descriptions[10] = "DISCONNECTING";
        descriptions[11] = "REAPPLYING_SUBSCRIPTIONS";
        return descriptions;
    }());

    /**
     * Session operation description.
     * @private
     */
    solace.SessionOperationDescription = (function() {
        var descriptions = [];
        descriptions[0] = "CONNECT";
        descriptions[1] = "DISCONNECT";
        descriptions[2] = "LOGIN";
        descriptions[3] = "P2PINBOXREG";
        descriptions[4] = "CTRL";
        descriptions[5] = "SEND";
        descriptions[6] = "REAPPLY_SUBSCRIPTIONS";
        descriptions[7] = "QUERY_OPERATION";
        
        return descriptions;
    }());

    /**
     * @class Enumeration of possible session states.
     * @static
     */
    solace.SessionState = {
        /**
         * @constant
         * @description
         * The session is new and never connected.
         */
        NEW:                0,
        /**
         * @constant
         * @description
         * The session is connecting.
         */
        CONNECTING:         1,
        /**
         * @constant
         * @description
         * The session is connected.
         */
        CONNECTED:          2,
        /**
         * @constant
         * @description
         * The session experienced an error.
         */
        SESSION_ERROR:      3,
        /**
         * @constant
         * @description
         * The session is disconnecting.
         */
        DISCONNECTING:      4,
        /**
         * @constant
         * @description
         * The session is disconnected.
         */
        DISCONNECTED:       5
    };


    /**
     * @class Transport schemes referenced by {@link solace.SessionProperties#transportScheme}.
     * @static
     */
    solace.TransportScheme = {
        /**
         * Binary-encoded BOSH-like transport.
         */
        HTTP_BASIC: "HTTP_BASIC",
        /**
         * Base64-encoded BOSH-like transport.
         */
        HTTP_BASE64: "HTTP_BASE64"
    };

    /* ===========================================================================
     * Exceptions/Errors
     * ============================================================================
     */
    /**
     * @class An error thrown when calling an API that has not been implemented.
     *
     * @param {string} message
     */
    solace.NotImplementedError = function NotImplementedError(message) {
        this.name = "NotImplementedError";
        this.message = (message || "");
    };
    solace.NotImplementedError.prototype = new Error();
    solace.NotImplementedError.prototype.toString = function() {
        var buf = new solace.StringBuffer(this.name);
        buf.append(": ");
        buf.append("message=").append(this.message||"");
        return buf.toString();
    };

    /**
     * @class An error thrown by the API when an operational error is encountered.
     *
     * @param {string} message
     * @param {solace.ErrorSubcode} subcode
     * @param {Object=} reason Embedded error or exception (optional)
     */
    solace.OperationError = function (message, subcode, reason) {
        this.name = "OperationError";
        this.message = (message || "");
        this.subcode = subcode;
        this.reason = reason;
    };
    solace.OperationError.prototype = new Error();
    solace.OperationError.prototype.toString = function() {
        var buf = new solace.StringBuffer(this.name);
        buf.append(": ");
        if (this.name === "OperationError") {
            buf.append("message=").append(this.message||"").append(", ");
            buf.append("subcode=").append(this.subcode||"").append(", ");
            buf.append("reason=").append(this.reason||"");
        }
        else {
            buf.append("message=").append(this.message||"");
        }
        return buf.toString();
    };


    /**
     * @class
     * An error thrown when an error occurs on the transport session.
     * <p>
     * Applications are not expected to instantiate this type.
     *
     * @param {string} message
     * @param {solace.ErrorSubcode} subcode
     */
    solace.TransportError = function TransportError(message, subcode) {
        this.name = "TransportError";
        this.message = (message || "");
        this.subcode = subcode;
    };
    solace.TransportError.prototype = new Error();
    solace.TransportError.prototype.toString = function() {
        var buf = new solace.StringBuffer(this.name);
        buf.append(": ");
        if (this.name === "TransportError") {
            buf.append("message=").append(this.message||"").append(", ");
            buf.append("subcode=").append(this.subcode||"");
        }
        else {
             buf.append("message=").append(this.message||"");
        }
        return buf.toString();
    };

    /**
     * @class
     * Represents a session properties object. Passed in to
     * {@link solace.SolclientFactory.createSession()} when creating a Session instance.
     */
    solace.SessionProperties = function SessionProperties() {
        // Credentials
        /**
         * @property
         * @description  The url of the messaging service to connect to.
         * <li>Default: empty string </li>
         * <li><strong>Note:</strong> cross-domain restrictions should be taken into consideration
         * when deploying web applications with messaging capabilities (see the SDK User Guide for more information).</li>
         */
        this.url = "";
        /**
         * @property
         * @description The password required for authentication.
         * <li> Default: empty string </li>
         */
        this.password = "";
        /**
         * @property
         * @description  The client username required for authentication.
         * <li> Default: empty string </li>
         */
        this.userName = "";
        /**
         * @property
         * @description The session client name that is used during client login
         * (routers running SolOS-TR) to create a unique session.
         * <p>
         * An empty string causes a unique client name to be generated
         * automatically.
         * </p>
         * If specified, it must be a valid Topic name,
         * and a maximum of 160 bytes in length.
         * This property is also used to uniquely identify the sender in
         * a message's senderId field if {@link solace.SessionProperties#includeSenderId}
         * is set.
         * <li> Default: empty string </li>
         */
        this.clientName = "";
        /**
         * @property
         * @description A string that uniquely describes the application instance.
         * <li> Default: If left blank, the API will generate a description string using the current user-agent string.</li>
         */
        this.applicationDescription = "";
        /**
         * @property
         * @description The Message VPN name that the client is requesting for
         * this session.
         * <li> Default: empty string </li>
         */
        this.vpnName = "";
        /**
         * @property
         * @description A read-only session property that indicates which Message
         * VPN the session is connected to.
         * When not connected, or when not in client mode,
         * an empty string is returned.
         * <li> Default: empty string </li>
         */
        this.vpnNameInUse = "";
        /**
         * @property
         * @description A read-only property that indicates the connected router's
         * virtual router name.
         * <li> Default: empty string </li>
         */
        this.virtualRouterName = "";

        // Connection Strategies
        /**
         * @property
         * @description The timeout period (in milliseconds) for a connect
         * operation to a given host.
         * <li> Default: 30000 </li>
         * <li> The valid range is > 0. </li>
         */
        this.connectTimeoutInMsecs = 30000;

        /**
         * @property
         * @description The timeout period (in milliseconds) for a reply to
         * come back from the router. This timeout serves as the default
         * request timeout for {@link solace.Session#subscribe},
         * {@link solace.Session#unsubscribe}, {@link solace.Session#updateProperty}.
         * <li> Default: 10000 </li>
         * <li> The valid range is > 0. </li>
         */
        this.readTimeoutInMsecs = 10000;

        /**
         * @property
         * @description The maximum buffer size for the transport session. This size must be bigger than the largest message an
         * application intends to send on the session.
         * <li> Default: 64K </li>
         * <li> The valid range is > 0. </li>
         * <p>
         * The session buffer size configured using the sendBufferMaxSize
         * session property controls SolClient buffering of transmit messages. When
         * sending small messages, the session buffer size should be set to multiple times
         * the typical message size to improve the performance. Regardless of the buffer
         * size, SolClient always accepts at least one message to transmit. So even if a
         * single message exceeds sendBufferMaxSize, it is accepted and
         * transmitted as long as the current buffered data is zero. However no more
         * messages are accepted until the amount of data buffered is reduced
         * enough to allow room below sendBufferMaxSize.
         * </p>
         */
        this.sendBufferMaxSize = 64 * 1024;

        /**
         * @property
         * @description The maximum payload size (in bytes) when sending data using the Web transport.
         * <li> Default: 1MB </li>
         * <li> The valid range is >= 100. </li>
         */
        this.maxWebPayload = 1024*1024;

        // Timestamps
        /**
         * @property
         * @description When enabled, a send timestamp is automatically included
         * (if not already present) in the Solace-defined fields for
         * each message sent.
         * <li> Default: false </li>
         */
        this.generateSendTimestamps = false;
        /**
         * @property
         * @description When enabled, a receive timestamp is recorded for
         * each message and passed to the session's message callback receive handler.
         * <li> Default: false </li>
         */
        this.generateReceiveTimestamps = false;
        /**
         * @property
         * @description When enabled, a sender ID is automatically included
         * (if not already present) in the Solace-defined fields for each message
         * sent.
         * <li> Default: false </li>
         */
        this.includeSenderId = false;

        // Keep Alive
        /**
         * @property
         * @description The amount of time (in milliseconds) to wait between sending 
		 * out keep-alive messages to the router.
         * <li>The valid range is >= 100.</li>
         * <li> Default: 3000 </li>
         */
        this.keepAliveIntervalInMsecs = 3000;
        /**
         * @property
         * @description The maximum number of consecutive Keep-Alive messages that 
		 * can be sent without receiving a response before the session is declared down 
		 * and the connection is closed by the SDK. 
         * <li>The valid range is >= 3.</li>
         * <li> Default: 3 </li>
         */
        this.keepAliveIntervalsLimit = 3;

        // P2P Inbox
        /**
         * @property
         * @description A read-only string that indicates the default
         * reply-to destination used for any request messages sent from this session.
         * See {@link solace.Session#sendRequest}.
         * This parameter is only valid when the session is connected.
         * <li> Default: empty string </li>
         */
        this.p2pInboxInUse = "";

        /**
         * @private
         * @description A read-only information string that stores the P2P topic subscription
         * obtained from the router.
         * This parameter is only valid when the session is connected.
         * <li> Default: empty string </li>
         */
        this.p2pInboxBase = "";
        /**
         * @property
         * @description A read-only string providing information
         * about the application, such as the name of the user-agent that is running
         * the application.
         * <li> Default: The userAgent returned by the browser</li>
         */
        this.userIdentification = navigator.userAgent || "";

        // Sequence Numbers
        /**
         * @property
         * @description When enabled, a sequence number is automatically
         * included (if not already present) in the Solace-defined fields
         * for each message sent.
         * <li> Default: false </li>
         */
        this.generateSequenceNumber = false;

        // Subscriptions
        /**
         * @property
         * @description Subscriber priorities are used by the router to distribute messages that have the {@link solace.Message#setDeliverToOne} flag
         * set to true. These messages are sent to the subscriber with the
         * highest priority.
         * Subscribers have two priorities; this priority is for messages
         * published locally.
         * <li> The valid range is 1..4 </li>
         * <li> Default: 1 </li>
         */
        this.subscriberLocalPriority = 1;
        /**
         * @property
         * @description Subscriber priorities are used by the router to distribute messages that have the {@link solace.Message#setDeliverToOne} flag
         * set to true. These messages are sent to the subscriber with the
         * highest priority.
         * Subscribers have two priorities; this priority is
         * for messages published on routers other than the one that the client
         * is connected to.
         * <li> The valid range is 1..4 </li>
         * <li> Default: 1 </li>
         */
        this.subscriberNetworkPriority = 1;
        /**
         * @property
         * @description Used to ignore duplicate subscription errors on subscribe.
         * <li> Default: true </li>
         */
        this.ignoreDuplicateSubscriptionError = true;
        /**
         * @property
         * @description Used to ignore subscription not found errors on unsubscribe.
         * <li> Default: true </li>
         */
        this.ignoreSubscriptionNotFoundError = true;
        /**
         * @property
         * @description Set to 'true' to have the SDK remember subscriptions and
         * reapply them upon calling session connect {@link solace.Session#connect} on a disconnected session.
         * <li> Default: false </li>
         */
        this.reapplySubscriptions = false;

        /**
         * @property
         * @description Set to 'true' to signal the router that messages published
         * on the session should
         * not be received on the same session even if the client has a subscription
         * that matches the published topic. If this restriction is requested, and the
         * router does not have No Local support, the session connect will fail.
         * <li> Default: false </li>
         */
        this.noLocal = false;

        /**
         * @property
         * @description A session property that indicates which transport type to use for a session, or,
         * when queried on a connected session, which transport scheme
         * is in use.
         *
         * The <code>null</code> default signifies "pick best available".
         * 
         * <li>Default: <code>null</code></li>
         * <li>Returns type {@link solace.TransportScheme}</li>
         */
        this.transportScheme = null;
    };

    solace.SessionProperties.prototype.toString = function() {
        var result = new solace.StringBuffer("\n");
        var first = true;
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                if (key === "password") {
                    continue;
                }
                if (first) {
                    result.append(" {")
                            .append(key)
                            .append(", ")
                            .append(this[key])
                            .append("}");
                    first = false;
                }
                else {
                    result.append(",\n ")
                            .append("{")
                            .append(key)
                            .append(", ")
                            .append(this[key])
                            .append(" }");
                }
            }

        }
        return result.toString();
    };

    solace.SessionProperties.prototype.clone = function() {
        var copy = new solace.SessionProperties();
        for (var p in this) {
            if (this.hasOwnProperty(p)) {
                copy[p] = this[p];
            }
        }
        return copy;
    };

    solace.SessionProperties.prototype.sol_validate = function() {
        // validating properties
        var prop_this = this;

        function isDefined(name) {
            return (prop_this[name] !== undefined &&
                    prop_this[name] !== null &&
                    (typeof prop_this[name] !== "string" || prop_this[name].length > 0));
        }

        function val_not_empty(name) {
            if (prop_this[name] === undefined || prop_this[name] === null || prop_this[name] === "") {
                throw new solace.OperationError("SessionProperties validation: Property '" + name + "' cannot be empty.", solace.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
            }
        }

        function val_length(name, max) {
            if (isDefined(name) && typeof prop_this[name] === "string" && prop_this[name].length > max) {
                throw new solace.OperationError("SessionProperties validation: Property '" + name + "' exceeded max length " + max, solace.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
            }
        }

        function val_range(name, min, max) {
            if (isDefined(name) && typeof prop_this[name] === "number" && (prop_this[name] < min || prop_this[name] > max)) {
                throw new solace.OperationError("SessionProperties validation: Property '" + name + "' out of range [" + min + "; " + max + "].", solace.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
            }
        }

        function val_type(name, type) {
            if (isDefined(name) && typeof prop_this[name] !== type) {
                throw new solace.OperationError("SessionProperties validation: Property '" + name + "' should be type " + type, solace.ErrorSubcode.PARAMETER_INVALID_TYPE);
            }
        }

        function val_clientname(name) {
            if (isDefined(name) && typeof prop_this[name] === "string") {
                var ret = solace.smf.ClientCtrlMessage.validateClientName(prop_this[name]);
                if (ret) {
                    throw new solace.OperationError("SessionProperties validation: Property '" + name + "' :" + ret, solace.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
                }
            }
        }

        function process_validator(name, var_args) {
            for (var i = 1; i < arguments.length; i++) {
                var check = arguments[i];
                switch (check.length) {
                    case 1:
                        check[0](name);
                        break;
                    case 2:
                        check[0](name, check[1]);
                        break;
                    case 3:
                        check[0](name, check[1], check[2]);
                        break;
                }
            }
        }

        // Validation rules: same as JCSMP
        process_validator("url", [val_not_empty], [val_type, "string"]);
        process_validator("userName", [val_not_empty], [val_type, "string"], [val_length, 32]);
        process_validator("password", [val_type, "string"], [val_length, 128]);
        process_validator("clientName", [val_type, "string"], [val_length, 160], [val_clientname]);
        process_validator("applicationDescription", [val_type, "string"], [val_length, 254]);
        process_validator("vpnName", [val_type, "string"], [val_length, 32]);
        process_validator("connectTimeoutInMsecs", [val_type, "number"], [val_range, 1, Number.MAX_VALUE]);
        process_validator("readTimeoutInMsecs", [val_type, "number"], [val_range, 1, Number.MAX_VALUE]);
        process_validator("sendBufferMaxSize", [val_type, "number"], [val_range, 1, Number.MAX_VALUE]);
        process_validator("maxWebPayload", [val_type, "number"], [val_range, 100, Number.MAX_VALUE]);
        process_validator("generateSendTimestamps", [val_type, "boolean"]);
        process_validator("generateReceiveTimestamps", [val_type, "boolean"]);
        process_validator("includeSenderId", [val_type, "boolean"]);
        process_validator("keepAliveIntervalInMsecs", [val_type, "number"], [val_range, 100, Number.MAX_VALUE]);
        process_validator("keepAliveIntervalsLimit", [val_type, "number"], [val_range, 3, Number.MAX_VALUE]);
        process_validator("generateSequenceNumber", [val_type, "boolean"]);
        process_validator("subscriberLocalPriority", [val_type, "number"], [val_range, 1, 4]);
        process_validator("subscriberNetworkPriority", [val_type, "number"], [val_range, 1, 4]);
        process_validator("ignoreDuplicateSubscriptionError", [val_type, "boolean"]);
        process_validator("ignoreSubscriptionNotFoundError", [val_type, "boolean"]);
        process_validator("reapplySubscriptions", [val_type, "boolean"]);
        process_validator("noLocal", [val_type, "boolean"]);
    };

    /**
     * @class
     * Encapsulates the session's message receive callback function and
     * an optional user-specified object.
     * <br>
     * This class is passed to {@link solace.SolclientFactory.createSession} when creating a session.
     * 
     * @param {function(solace.Session, solace.Message, Object, Object)} messageRxCBFunction invoked by the SDK when
     * a message is received over the session. The prototype of this function is the
     * following: ({@link solace.Session}, {@link solace.Message},
     * userObject {Object}, RFUObject {Object})
     * 
     * @param {Object} userObject An optional user-specified object passed on
     * every message receive callback.
     */
    solace.MessageRxCBInfo = function MessageRxCBInfo(messageRxCBFunction, userObject) {
        /**
         * @property
         * @description The prototype of this function is the
         * following: ({@link solace.Session}, {@link solace.Message},
         * userObject {Object}, RFUObject {Object})
         */
        this.messageRxCBFunction = messageRxCBFunction;
        /**
         * @property
         * @description user-specified object
         */
        this.userObject = userObject;
    };

    /**
     * @class
     * Encapsulates the session's event callback function and
     * an optional user-specified object.
     * <br>
     * This class is passed to {@link solace.SolclientFactory.createSession} when creating a session.
     * 
     * @param {function(solace.Session, solace.SessionEvent, Object, Object)} sessionEventCBFunction 
	 * invoked by the Messaging SDK when a session event occurs. The prototype 
	 * of this function is the following: ({@link solace.Session},
     * {@link solace.SessionEvent},
     *  userObject {Object},
     *  RFUObject {Object})
     *  
     * @param {Object} userObject An optional user-specified object passed on
     * every session event callback.
     */
    solace.SessionEventCBInfo = function SessionEventCBInfo(sessionEventCBFunction, userObject) {
        /**
         * @property
         * @description user-specified object
         */
        this.userObject = userObject;
        /**
         * @property
         * @description The prototype of this function is the
         * following: ({@link solace.Session},
         * {@link solace.SessionEvent},
         *  userObject {Object},
         *  RFUObject {Object})
         */
        this.sessionEventCBFunction = sessionEventCBFunction;
    };

    /**
     * @class
     * Represents a session event; events are passed to the application-provided
     * event handling callback provided when creating the session.
     * 
     * @param {solace.SessionEventCode} sessionEventCode
     * @param {string} infoStr
     * @param {number} responseCode
     * @param {solace.ErrorSubcode} errorSubCode (optional)
     * @param {Object} correlationKey
     * @param {string} reason (optional)
     */
    solace.SessionEvent =
            function SessionEvent(sessionEventCode, infoStr, responseCode, errorSubCode, correlationKey, reason) {
                /**
                 * @property
                 * @description further qualifies the session event. Defined in
                 * {@link solace.SessionEventCode}.
                 */
                this.sessionEventCode = sessionEventCode;
                /**
                 * @property
                 * @description if applicable, an information string returned by the router
                 */
                this.infoStr = infoStr;
                /**
                 * @property
                 * @description if applicable, a response code returned by the router
                 */
                this.responseCode = responseCode;
                /**
                 * @property
                 * @description if applicable, an error subcode
                 */
                this.errorSubCode = errorSubCode;
                /**
                 * @property
                 * @description A user-specified object
                 * made available in the response or confirmation event by including it as a
                 * parameter in the orignal API call.  If the user did not specify a
                 * correlationKey, it will be <code>null</code>.
                 */
                this.correlationKey = correlationKey;
                /**
                 * @property
                 * @description Transport session event if it is applicable.
                 */
                this.reason = reason; // optional
                /**
                 * @property
                 * @description Only valid when the event represents a reply to a request
                 * made by the user using {@link solace.Session#sendRequest}.
                 */
                this.replyMessage = null; // optional
            };

    solace.SessionEvent.prototype.toString = function () {
        var buf = new solace.StringBuffer("Session event: ");
        buf.append("sessionEventCode=").append(solace.SessionEventCodeDescription[this.sessionEventCode]).append(", ");
        buf.append("infoStr=").append(this.infoStr||"").append(", ");
        buf.append("responseCode=").append(this.responseCode||"").append(", ");
        buf.append("errorSubCode=").append(this.errorSubCode||"").append(", ");
        buf.append("correlationKey=").append(this.correlationKey||"").append(", ");
        buf.append("reason=(").append(this.reason||"").append(")");
        return buf.toString();
    };

    /**
     * @class Represents the destination type enumeration.
     * @static
     */
    solace.DestinationType = {
        /**
         * A topic destination, which is an identifier for Solace router topics and topic subscriptions.
         * @constant
         */
        TOPIC: 0
    };

    /**
     * Destination type description
     * @private
     */
    solace.DestinationTypeDescription = (function(){
        var descriptions = [];
        var index;
        for (index in solace.DestinationType) {
            if (solace.DestinationType.hasOwnProperty(index)) {
                descriptions[solace.DestinationType[index]] = index;
            }
        }
        return descriptions;
    }());

    /**
     * @class
     * Represents a message destination. The only supported destination type
     * is {@link solace.Topic}.
     * @param {string} name
     * @param {solace.DestinationType} destinationType (reserved for future, defaults to {@link solace.DestinationType.TOPIC})
     * @constructor
     */
    solace.Destination = function Destination(name, destinationType) {
        /**
         * @private
         * @type string
         */
        this.m_name = name;
        /**
         * @private
         * @type solace.DestinationType
         */
        this.m_type = solace.DestinationType.TOPIC;
        /**
         * @private
         * @type boolean
         */
        this.m_temporary = false;
    };

    /**
     * @return true, if the destination is temporary.
     */
    solace.Destination.prototype.isTemporary = function() {
        return this.m_temporary;
    };

    /**
     * @return {solace.DestinationType}
     */
    solace.Destination.prototype.getType = function () {
        return this.m_type;
    };

    /**
     * @return {string} The destination name specified at creation time.
     */
    solace.Destination.prototype.getName = function() {
        return this.m_name;
    };

    solace.Destination.prototype.toString = function() {
        return this.getName() || "[object Destination]";
    };

	/**
     * @class
     * Represents a Topic, which is a type of Destination.
     * <p>
     * Instances should be acquired through {@link solace.SolclientFactory.createTopic}.
     */
    solace.Topic = function Topic(topicName) {
        /**
         * @private
         * @property
         * @type string
         */
        this.m_name = topicName;
        /**
         * @private
         */
        this.m_type = solace.DestinationType.TOPIC;
        /**
         * @private
         */
        this.m_temporary = false;
    };

    solace.Topic.prototype = new solace.Destination();
    solace.Topic.prototype.getKey = function() {
        return this.m_name;
    };

    /**
     * Represents a message.
     * <p>
     * Applications are not expected to instantiate this class; use {@link solace.SolclientFactory.createMessage}.
     * @constructor
     */
    solace.Message = function() {

        ///////////////////////////////////////////////////////////////////////////
        // In SMF
        ///////////////////////////////////////////////////////////////////////////
        this.m_binaryAttachment = null;
        this.m_xmlContent = null;
        this.m_xmlMetadata = null;
        this.m_userData = null;
        this.m_binaryMetaChunk = null;
        this.m_discardIndication = false;
        this.m_elidingEligible = false;
        this.m_redelivered = false;
        this.m_deliveryMode = solace.MessageDeliveryModeType.DIRECT;
        this.m_deliverToOne = false;
        // Destination
        this.m_destination = null; // of type Destination
        // Cos
        this.m_userCos = solace.MessageUserCosType.COS1; // of type MessageUserCosType
        ///////////////////////////////////////////////////////////////////////////
        // In binary Meta part of the message
        ///////////////////////////////////////////////////////////////////////////

        // ace-defined message headers
        this.m_applicationMessageId = null;
        this.m_applicationMessageType = null;

        // Request/Reply
        this.m_correlationId = null;
        this.m_replyMessage = false;
        this.m_replyTo = null; // of type Destination
        // Sender
        this.m_senderId = null;
        this.m_senderTimestamp = null;
        // Sequence Number
        this.m_sequenceNumber = null;
        // User property map
        this.m_userPropertyMap = null;
        // Structured SDT container
        this.m_structuredContainer = null;

        ///////////////////////////////////////////////////////////////////////////
        // Message attribute
        ///////////////////////////////////////////////////////////////////////////
        this.m_receiverTimestamp = null;

        // The type of the message based on the preamble
        this.m_messageType = solace.MessageType.BINARY;

        this.m_smfHeader = null; // SMF header object
    };

    /**
     * Gets the structured payload type of the message. A message has a structured payload if one
     * was attached via {@link solace.Message#setSdtContainer}.
     *
     * @return {solace.MessageType} the structured payload type, BINARY is the default if none is set.
     */
    solace.Message.prototype.getType = function() {
        return this.m_messageType;
    };

    /**
     * Sets the application-provided message ID.
     * @param {string} value
     */
    solace.Message.prototype.setApplicationMessageId = function(value) {
        if (value !== null && typeof value !== "string") {
            throw new solace.OperationError(
                    "Invalid message parameter, expected string.",
                    solace.ErrorSubcode.PARAMETER_INVALID_TYPE);
        }
        this.m_applicationMessageId = value;
    };

    /**
     * Gets the application-provided message ID.
     * @return {string}
     */
    solace.Message.prototype.getApplicationMessageId = function() {
        return this.m_applicationMessageId;
    };

    /**
     * Sets the application message type. This value is used by applications 
	 * only, and is passed through the SDK untouched. 
     * @param {string} value The application message type.
     */
    solace.Message.prototype.setApplicationMessageType = function(value) {
        if (value !== null && typeof value !== "string") {
            throw new solace.OperationError(
                    "Invalid message parameter, expected string.",
                    solace.ErrorSubcode.PARAMETER_INVALID_TYPE);
        }
        this.m_applicationMessageType = value;
    };

    /**
     * Gets the application message type. This value is used by applications 
	 * only, and is passed through the SDK untouched. 
	 * @return {string} The application message type. If not present, <code>null</code>
	 * is returned.
     */
    solace.Message.prototype.getApplicationMessageType = function() {
        return this.m_applicationMessageType;
    };

    /**
     * Gets the binary attachment part of the message.
     * @return {string} A string representing the binary attachment. If not present,
     * <code>null</code> is returned.
     */
    solace.Message.prototype.getBinaryAttachment = function() {
        return this.m_binaryAttachment;
    };

    /**
     * Sets the binary attachment part of the message. 
     * @param {string} value Sets the binary attachment part of the message. 
     */
    solace.Message.prototype.setBinaryAttachment = function(value) {
        if (value !== null && typeof value !== "string") {
            throw new solace.OperationError(
                    "Invalid message parameter, expected string.",
                    solace.ErrorSubcode.PARAMETER_INVALID_TYPE);
        }
        this.m_binaryAttachment = value;
    };

    /**
     * Gets the correlation ID. The correlation ID is used for correlating 
	 * a request to a reply.
	 * @return {string} The correlation ID associated with the message, 
	 * or <code>null</code>, if unset.
     */
    solace.Message.prototype.getCorrelationId = function() {
        return this.m_correlationId;
    };

    /**
     * Sets the correlation ID. The correlation ID is used for correlating 
	 * a request to a reply.
     * @param {string} value The correlation ID to associate with the message.
     */
    solace.Message.prototype.setCorrelationId = function(value) {
        if (value !== null && typeof value !== "string") {
            throw new solace.OperationError(
                    "Invalid message parameter, expected string.",
                    solace.ErrorSubcode.PARAMETER_INVALID_TYPE);
        }
        this.m_correlationId = value;
    };

    /**
     * Sets whether the message is configured for delivering to one client only.
     * @param {boolean} value whether the message is configured for delivering to one client only.
     */
    solace.Message.prototype.setDeliverToOne = function(value) {
        this.m_deliverToOne = value;
    };

    /**
     * Gets whether the message is configured for delivering to one client only.
	 * @return {boolean} indicates whether the message is configured for delivering to one client only.
     */
    solace.Message.prototype.isDeliverToOne = function() {
        return this.m_deliverToOne;
    };

    /**
	 * Gets the delivery mode of the message.
     * @return {solace.MessageDeliveryModeType} representing the delivery mode of the message. 
     */
    solace.Message.prototype.getDeliveryMode = function() {
        return this.m_deliveryMode;
    };

    /**
     * Sets the delivery mode of the message.
     * @param {solace.MessageDeliveryModeType} value The message delivery mode.
     */
    solace.Message.prototype.setDeliveryMode = function(value) {
        this.m_deliveryMode = value;
    };

    /**
     * Gets the destination to which the message was published.
	 * @return {solace.Destination} The destination to which a message was published.
     */
    solace.Message.prototype.getDestination = function() {
        return this.m_destination;
    };

    /**
     * Sets the destination (topic or queue) to publish the message to.
     * @param {solace.Destination} value The destination to publish the message to.
     */
    solace.Message.prototype.setDestination = function(value) {
        this.m_destination = value;
    };

    /**
     * Indicates whether one or more messages have been discarded prior 
	 * to the current message. This indicates congestion discards only and 
	 * is not affected by message eliding. 
	 * @return {boolean} Returns true if one or more messages have been 
	 * discarded prior to the current message; otherwise, it returns false. 
     */
    solace.Message.prototype.isDiscardIndication = function() {
        return this.m_discardIndication;
    };

    /**
     * @private
     * @param {boolean} value 
     */
    solace.Message.prototype.setDiscardIndication = function(value) {
        this.m_discardIndication = value;
    };

    /**
     * Returns whether the message is eligible for eliding.
     * <p>
	 * Message eliding enables filtering of data to avoid transmitting 
	 * every single update to a subscribing client.
     * <p>
     * This property does not indicate whether the message was elided.
     *
     * @return {boolean} indicates whether the message is eligible for eliding.
     */
    solace.Message.prototype.isElidingEligible = function() {
        return this.m_elidingEligible;
    };

    /**
     * Sets whether the message is eligible for eliding.
     * <p>
	 * Message eliding enables filtering of data to avoid transmitting
	 * every single update to a subscribing client.
     * <p>
     * This property does not indicate whether the message was elided.
     *
     * @param {boolean} value sets whether the message is eligible for eliding.
	 */
    solace.Message.prototype.setElidingEligible = function(value) {
        this.m_elidingEligible = value;
    };

    /**
     * Returns whether the message's reply field is set, indicating 
	 * that this message is a reply.
	 * @return {boolean} Indicates the state of the reply field.
     */
    solace.Message.prototype.isReplyMessage = function() {
        return this.m_replyMessage;
    };

    /**
     * Indicates whether the message has been marked as redelivered by the router.
     * @return {boolean} Indicates whether the redelivered flag is set.
     */
    solace.Message.prototype.isRedelivered = function() {
        return this.m_redelivered;
    };

    /**
     * Sets the <i>reply</i> field of the message.
     * @param {boolean} value Sets whether to flag the message as a reply.
     */
    solace.Message.prototype.setAsReplyMessage = function(value) {
        this.m_replyMessage = value;
    };

    /**
     * Gets the receive timestamp (in milliseconds, from midnight, January 1, 1970 UTC). 
	 * @return {number} The receive timestamp; returns 0, if unset.
     */
    solace.Message.prototype.getReceiverTimestamp = function() {
        return this.m_receiverTimestamp;
    };

    /**
     * Gets the replyTo destination 
	 * @return {solace.Destination} The value of the replyTo destination.
     */
    solace.Message.prototype.getReplyTo = function() {
        return this.m_replyTo;
    };

    /**
     * Sets the replyTo destination 
     * @param {solace.Destination} value The replyTo destination.
     */
    solace.Message.prototype.setReplyTo = function(value) {
        this.m_replyTo = value;
    };

    /**
     * Returns the Sender's ID.
	 * @return {string} The Sender's ID; <code>null</code>, if it is not set.
     */
    solace.Message.prototype.getSenderId = function() {
        return this.m_senderId;
    };

    /**
     * Sets the Sender ID for the message
     * @param {string} value The Sender ID for the message.
     */
    solace.Message.prototype.setSenderId = function(value) {
        if (value !== null && typeof value !== "string") {
            throw new solace.OperationError(
                    "Invalid message parameter, expected string.",
                    solace.ErrorSubcode.PARAMETER_INVALID_TYPE);
        }
        this.m_senderId = value;
    };

    /**
     * Gets the send timestamp (in milliseconds, from midnight, January 1, 
	 * 1970 UTC).
	 * @return {number} The send timestamp. <code>null</code>, if it was not set on send.
     */
    solace.Message.prototype.getSenderTimestamp = function() {
        return this.m_senderTimestamp;
    };

    /**
     * Sets the send timestamp (in milliseconds, from midnight, January 1, 
	 * 1970 UTC). This field can be set automatically during message 
	 * publishing, but existing values are not overwritten if non-null, 
	 * as when a message is sent multiple times. 
     * @param {number} value The value to set as the send timestamp.
     */
    solace.Message.prototype.setSenderTimestamp = function(value) {
        this.m_senderTimestamp = value;
    };

    /**
     * Gets the sequence number.
     * <p>
     * This is an application-defined field, see <code>setSequenceNumber()</code>.
	 * @return {number} The sequence number; <code>null</code> if it was not set on send.
     */
    solace.Message.prototype.getSequenceNumber = function() {
        return this.m_sequenceNumber;
    };

    /**
     * Sets the application-defined sequence number.
     * @param {number} value The sequence number.
     */
    solace.Message.prototype.setSequenceNumber = function(value) {
        this.m_sequenceNumber = value;
    };

    /**
     * Gets the Class of Service (CoS) value for the message.
	 * @return {solace.MessageUserCosType} The COS value.
     */
    solace.Message.prototype.getUserCos = function() {
        return this.m_userCos;
    };

    /**
     * Sets the Class of Service (CoS) value for the message.
     * @param {solace.MessageUserCosType} value The COS value.
     */
    solace.Message.prototype.setUserCos = function(value) {
        this.m_userCos = value;
    };

    /**
     * Gets the user data part of the message.
	 * @return {string} The user data part of the message. Returns <code>null</code> if not present.
     */
    solace.Message.prototype.getUserData = function() {
        return this.m_userData;
    };

    /**
     * Sets the user data part of the message.
     * @param {string} value The user data part of the message.
     */
    solace.Message.prototype.setUserData = function(value) {
        if (value !== null && typeof value !== "string") {
            throw new solace.OperationError(
                    "Invalid message parameter, expected string.",
                    solace.ErrorSubcode.PARAMETER_INVALID_TYPE);
        }
        this.m_userData = value;
    };

    /**
     * Gets the XML content part of the message.
	 * @return {string} The XML content part of the message. Returns <code>null</code> if not present.
     */
    solace.Message.prototype.getXmlContent = function() {
        return this.m_xmlContent;
    };

    /**
     * Sets the XML content part of the message.
     * @param {string} value The XML content part of the message. 
     */
    solace.Message.prototype.setXmlContent = function(value) {
        if (value !== null && typeof value !== "string") {
            throw new solace.OperationError(
                    "Invalid message parameter, expected string.",
                    solace.ErrorSubcode.PARAMETER_INVALID_TYPE);
        }
        this.m_xmlContent = value;
    };

    /**
     * Sets the message's XML metadata section.
     * @param {string} value The XML metadata.
     */
    solace.Message.prototype.setXmlMetadata = function(value) {
        if (value !== null && typeof value !== "string") {
            throw new solace.OperationError(
                    "Invalid message parameter, expected string.",
                    solace.ErrorSubcode.PARAMETER_INVALID_TYPE);
        }
        this.m_xmlMetadata = value;
    };

    /**
     * Gets the message's XML metadata section.
     * @return string The XML metadata.
     */
    solace.Message.prototype.getXmlMetadata = function() {
        return this.m_xmlMetadata;
    };

    /**
     * @private
     */
    solace.Message.prototype.getBinaryMetadataChunk = function() {
        return this.m_binaryMetaChunk;
    };

    /**
     * @private
     */
    solace.Message.prototype.setBinaryMetadataChunk = function(meta) {
        this.m_binaryMetaChunk = meta;
    };

    /**
     * @private
     */
    solace.Message.prototype.getSmfHeader = function() {
        return this.m_smfHeader;
    };

    /**
     * Gets the user properties map carried in the message.
	 * @return {solace.SDTMapContainer} The user properties map.
     */
    solace.Message.prototype.getUserPropertyMap = function() {
        return this.m_userPropertyMap;
    };

    /**
     * Allows users to specify their own user properties to be carried 
	 * in the message separate from the payload.
     * @param {solace.SDTMapContainer} value The user properties map.
     */
    solace.Message.prototype.setUserPropertyMap = function(value) {
        this.m_userPropertyMap = value;
    };

    /**
     * Makes this message a strutured data message by assigning it a 
	 * structured data type (SDT) container payload
     * (such as a {@link solace.SDTMapContainer} or 
	 * {@link solace.SDTStreamContainer} or a string), which
     * is transported in the binary attachment field.
     * <p>
     * Assigning a SDT container updates the
     * message's Type property to the appropriate value.
     * <p>
     * The container argument must be a {@link solace.SDTField} with a type
     * of {@link solace.SDTFieldType.MAP}, {@link solace.SDTFieldType.STREAM},
     * or {@link solace.SDTFieldType.STRING}.
     *
     * @param {solace.SDTField} container The SDTField container to send in this message.
     */
    solace.Message.prototype.setSdtContainer = function(container) {
        if (container === null) {
            // clear
            this.m_structuredContainer = null;
            this.m_messageType = solace.MessageType.BINARY;
            this.setBinaryAttachment(null);
            return;
        }

        solace.Util.checkParamInstanceOf(container, solace.SDTField, "solace.SDTField");
        var p_sdtType = container.getType();
        switch (p_sdtType) {
            case solace.SDTFieldType.MAP:
                this.m_messageType = solace.MessageType.MAP;
                break;
            case solace.SDTFieldType.STREAM:
                this.m_messageType = solace.MessageType.STREAM;
                break;
            case solace.SDTFieldType.STRING:
                this.m_messageType = solace.MessageType.TEXT;
                break;
            default:
                throw new solace.OperationError(
                        "Invalid parameter, SDTField Type of MAP, STREAM, or STRING.",
                        solace.ErrorSubcode.PARAMETER_INVALID_TYPE);
        }
        this.m_structuredContainer = container;
    };

    /**
     * Gets the message's structured data container, if this is a structured data message.
     *
     * @return A {@link solace.SDTField} with a payload of either string, {@link solace.SDTMapContainer}, or {@link solace.SDTStreamContainer} if one was set in the message; <code>null</code>, otherwise.
     */
    solace.Message.prototype.getSdtContainer = function() {
        var msgType = this.getType();
        if ((msgType === solace.MessageType.MAP ||
                msgType === solace.MessageType.STREAM ||
                msgType === solace.MessageType.TEXT) &&
                (this.getBinaryAttachment() !== null) && (this.getBinaryAttachment().length > 0)) {
            var sdtField = null;
            if (! (sdtField = solace.sdt.Codec.parseSdt(this.getBinaryAttachment(), 0))) {
                return null;
            }
            // cache structured container for later access
            this.m_structuredContainer = sdtField;
            return sdtField;
        }
        return null;
    };

    /**
     * Produces a human-readable dump of the message's properties
     * contents. Applications must not parse the output, as its format is
     * undefined.
     *
     * <p>
     * Output can be controlled by the <code>flags</code> parameter. The values are:
     * <ul>
     * <li>{@link solace.MessageDumpFlag.MSGDUMP_BRIEF}
     * <li>{@link solace.MessageDumpFlag.MSGDUMP_FULL}
     * </ul>
     * </p>
     *
     * @param flags Flags controlling the output, such as whether to include verbose (binary dump) information
     * @return  A string representation of the message, to be used for debugging.
     */
    solace.Message.prototype.dump = function (flags) {
        if (typeof flags === "undefined") {
            return solace.MessageDumpUtil.dump(this, solace.MessageDumpFlag.MSGDUMP_FULL);
        }
        else if (typeof flags !== "undefined" && flags !== null && typeof flags === "number") {
            if (flags === solace.MessageDumpFlag.MSGDUMP_BRIEF || flags === solace.MessageDumpFlag.MSGDUMP_FULL) {
                return solace.MessageDumpUtil.dump(this, flags);
            }
            else {
                throw new solace.OperationError("Invalid parameter value for dump flags.",
                        solace.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
            }
        }
        else {
            throw new solace.OperationError("Invalid parameter type for dump flags.", solace.ErrorSubcode.PARAMETER_INVALID_TYPE);
        }
    };

    /**
     * @class Represents an enumeration of user Class of Service (COS) levels.
     * Applicable to DIRECT messages only.
     * @static
     */
    solace.MessageUserCosType = {
        /**
         * Direct Messages, USER COS 1 (Lowest priority).
         * @constant
         */
        COS1: 0,
        /**
         * Direct Messages, USER COS 2.
         * @constant
         */
        COS2: 1,
        /**
         * Direct Messages, USER COS 3 (Highest priority).
         * @constant
         */
        COS3: 2
    };

    /**
     * @private
     */
    solace.MessageUserCosTypeDescription = (function (){
        var description = [];
        description[solace.MessageUserCosType.COS1] = "COS1";
        description[solace.MessageUserCosType.COS2] = "COS2";
        description[solace.MessageUserCosType.COS3] = "COS3";
        return description;
    }());

    /**
     * @class Represents an enumeration of message types.
     * <p>
     * A message may contain unstructured byte data, or a structured container.
     * @static
     */
    solace.MessageType = {
        /**
         * Binary message (unstructured bytes stored in the binary attachment message part).
         * @constant
         */
        BINARY: 0,
        /**
         * Structured map message.
         * @constant
         */
        MAP: 1,
        /**
         * Structured stream message.
         * @constant
         */
        STREAM: 2,
        /**
         * Structured text message.
         * @constant
         */
        TEXT: 3
    };

    /**
     * @private
     */
    solace.MessageTypeDescription = (function(){
        var description = [];
        description[solace.MessageType.BINARY] = "Binary";
        description[solace.MessageType.MAP] = "Map";
        description[solace.MessageType.STREAM] = "Stream";
        description[solace.MessageType.TEXT] = "Text";
        return description;
    }());

    /**
     * @class Represents an enumeration of message delivery modes.
     * <p>
     * <strong>Note:</strong> this API only supports sending messages with <code>DIRECT</code> delivery.
     *
     * @static
     */
    solace.MessageDeliveryModeType = {
        /**
         * This mode provides at-most-once message delivery. Direct messages have
         * the following characteristics:
         * <ul>
         * <li>They are not retained for clients that are not connected to a Solace router.
         * <li>They can be discarded when congestion or system failures are encountered.
         * <li>They can be reordered in the event of network topology changes.
         * </ul>
         * Direct messages are most appropriate for messaging applications that require very
         * high-rate or very low-latency message transmission. Direct Messaging enables
         * applications to efficiently publish messages to a large number of clients
         * with matching subscriptions.
         * @constant
         */
        DIRECT: 0,
        /**
         * (Unsupported) This mode provides once-and-only-once message delivery.
         * @constant
         */
        PERSISTENT: 1,
        /**
         * (Unsupported) This mode provides once-and-only-once message delivery.
         * @constant
         */
        NON_PERSISTENT: 2
    };

        /**
     * @private
     */
    solace.MessageDeliveryModeTypeDescription = (function(){
        var description = [];
        description[solace.MessageDeliveryModeType.DIRECT] = "DIRECT";
        description[solace.MessageDeliveryModeType.PERSISTENT] = "PERSISTENT";
        description[solace.MessageDeliveryModeType.NON_PERSISTENT] = "NON_PERSISTENT";

        return description;
    }());

    /**
     * @class Represents an enumeration of session properties that can be modified.
     * These correspond to session properties in {@link solace.SessionProperties}.
     * @constant
     */
    solace.MutableSessionProperty = {
        /**
         * @constant
         */
        CLIENT_NAME: 1,
        /**
         * @constant
         */
        CLIENT_DESCRIPTION: 2
    };

    /**
     * @class Represents an enumeration of message dump format. It controls
     * the output of {@link solace.Message#dump()}.
     *
     * @static
     */
    solace.MessageDumpFlag = {
        /**
         * Display only the length of the binary attachment, XML content and user property maps.
         * @constant
         */
        MSGDUMP_BRIEF: 0,
        /**
         * Display the entire message contents.
         * @constant
         */
        MSGDUMP_FULL: 1
    };

    /** ===========================================================================
     * Stats
     * ============================================================================
     */

    /**
     * @class
     * Session Statistics for sent/received messages and control operations.
     * @static
     */
    solace.StatType = {
        /**
         * Count of bytes sent as part of data messages.
         * @constant
         */
        TX_TOTAL_DATA_BYTES: 0,
        /**
         * Count of data messages sent.
         * @constant
         */
        TX_TOTAL_DATA_MSGS: 1,
        /**
         * Count of bytes sent as part of direct data messages.
         * @constant
         */
        TX_DIRECT_BYTES: 2,
        /**
         * Count of direct data messages sent.
         * @constant
         */
        TX_DIRECT_MSGS: 3,
        /**
         * Count of bytes sent as part of control messages.
         * @constant
         */
        TX_CONTROL_BYTES: 4,
        /**
         * Count of control messages sent.
         * @constant
         */
        TX_CONTROL_MSGS: 5,
        /**
         * Count of request messages sent.
         * @constant
         */
        TX_REQUEST_SENT: 6,
        /**
         * Count of request timeouts that occurred.
         * @constant
         */
        TX_REQUEST_TIMEOUT: 7,


        /**
         * Count of bytes received as part of data messages.
         * @constant
         */
        RX_TOTAL_DATA_BYTES: 8,
        /**
         * Count of data messages received.
         * @constant
         */
        RX_TOTAL_DATA_MSGS: 9,
        /**
         * Count of bytes received as part of direct data messages.
         * @constant
         */
        RX_DIRECT_BYTES: 10,
        /**
         * Count of direct data messages received.
         * @constant
         */
        RX_DIRECT_MSGS: 11,
        /**
         * Count of bytes received as part of control messages.
         * @constant
         */
        RX_CONTROL_BYTES: 12,
        /**
         * Count of control messages received.
         * @constant
         */
        RX_CONTROL_MSGS: 13,
        /**
         * Count discard message indications received on incoming messages.
         * @constant
         */
        RX_DISCARD_MSG_INDICATION: 14,
        /**
         * Count of reply messaged received.
         * @constant
         */
        RX_REPLY_MSG_RECVED: 15,
        /**
         * Count of received reply messages that were discarded.
         * @constant
         */
        RX_REPLY_MSG_DISCARD: 16

    };

    solace.SessionStatistics = function() {
        this.m_statsMap = [];
        var index;
        for (index in solace.StatType) {
            if (solace.StatType.hasOwnProperty(index)) {
                this.m_statsMap[solace.StatType[index]] = 0;
            }
        }
    };

    solace.SessionStatistics.prototype.resetStats = function() {
        var i;
        for (i = 0; i < this.m_statsMap.length; i++) {
            if (this.m_statsMap[i] !== undefined) {
                this.m_statsMap[i] = 0;
            }
        }
    };

    solace.SessionStatistics.prototype.incStat = function(statType, value) {
        // should we validate statsTxType?
        this.m_statsMap[statType] += (value !== undefined ? value : 1);
    };

    solace.SessionStatistics.prototype.getStat = function(statType) {
        return this.m_statsMap[statType];
    };

    /**
     * @class
     * @static
     * Represents an enumeration of peer capabilities.
     */
    solace.CapabilityType = {
        /**
         * @constant
         * @description Peer's software load version. Type: string.
         */
        PEER_SOFTWARE_VERSION: 0,
        /**
         * @constant
         * @description Peer's software release date. Type: string.
         */
        PEER_SOFTWARE_DATE: 1,
        /**
         * @constant
         * @description Peer's platform. Type: string.
         */
        PEER_PLATFORM: 2,
        /**
         * @constant
         * @description Speed (in Mbps) of the port the client connects to. Type: number.
         */
        PEER_PORT_SPEED: 3,
        /**
         * @constant
         * @description Type of the port the client has connected to (currently 0: Ethernet). Type: number.
         */
        PEER_PORT_TYPE: 4,
        /**
         * @constant
         * @description Maximum size of a Direct message (in bytes), including all optional message headers and data. Type: number.
         */
        MAX_DIRECT_MSG_SIZE: 5,
        /**
         * @constant
         * @description Peer's router name. Type: string.
         *
         * This property is useful when sending SEMP requests to a peer's SEMP
         * topic, which may be constructed as '<code>#P2P/routername/#client/SEMP</code>'.
         */
        PEER_ROUTER_NAME: 6,
        /**
         * @constant
         * @description Peer supports message eliding. Type: boolean.
         */
        MESSAGE_ELIDING: 7,
        /**
         * @constant
         * @description Peer supports NoLocal option (client may avoid receiving messages published by itself).
         */
        NO_LOCAL: 8
    };

     /**
     * Capability type description.
     * @private
     */
    solace.CapabilityTypeDescription = (function() {
        var descriptions = [];
        descriptions[solace.CapabilityType.PEER_SOFTWARE_VERSION] = "PEER_SOFTWARE_VERSION";
        descriptions[solace.CapabilityType.PEER_SOFTWARE_DATE] = "PEER_SOFTWARE_DATE";
        descriptions[solace.CapabilityType.PEER_PLATFORM] = "PEER_PLATFORM";
        descriptions[solace.CapabilityType.PEER_PORT_SPEED] = "PEER_PORT_SPEED";
        descriptions[solace.CapabilityType.PEER_PORT_TYPE] = "PEER_PORT_TYPE";
        descriptions[solace.CapabilityType.MAX_DIRECT_MSG_SIZE] = "MAX_DIRECT_MSG_SIZE";
        descriptions[solace.CapabilityType.PEER_ROUTER_NAME] = "PEER_ROUTER_NAME";
        descriptions[solace.CapabilityType.MESSAGE_ELIDING] = "MESSAGE_ELIDING";
        descriptions[solace.CapabilityType.NO_LOCAL] = "NO_LOCAL";
        return descriptions;
    } ());

    /**
     * @class Represents a log level enumeration.
     * @static
     */
    solace.LogLevel = {
        /**
         * Fatal.
         */
        FATAL: 0,
        /**
         * Error.
         */
        ERROR: 1,
        /**
         * Warn.
         */
        WARN: 2,
        /**
         * Info.
         */
        INFO: 3,
        /**
         * Debug.
         */
        DEBUG: 4,
        /**
         * Trace.
         */
        TRACE: 5
    };

    /**
     * Properties used during initialization of SolclientFactory.
     * @class
     */
    solace.SolclientFactoryProperties = function(){
        /**
         * The logging level to use for filtering log events. Events with a level of lesser importance than this will be filtered out and not logged.
         * @type solace.LogLevel
         */
        this.logLevel = solace.LogLevel.ERROR;
    };

    /**
     * @class A singleton used as the first entry point to the messaging APIs.
     * @static
     */
    solace.SolclientFactory = (function(){
        var initializeCount = 0;
        var logLevel = solace.LogLevel.ERROR;

        /**
         * @static
         * @private
         */
        var factory =
        /**
         * @lends solace.SolclientFactory
         */
        {
            /**
             * Creates a session instance.
             * @param {solace.SessionProperties} sessionProperties Properties to configure the session.
             * @param {solace.MessageRxCBInfo} messageCallbackInfo
             * @param {solace.SessionEventCBInfo} eventCallbackInfo
             * @return {solace.Session}
             * @throws {solace.OperationError} if the parameters have an invalid type or value. Subcode: {@link solace.ErrorSubcode.PARAMETER_INVALID_TYPE}.
             */
            createSession: function(sessionProperties, messageCallbackInfo, eventCallbackInfo) {
                return new solace.Session(sessionProperties, messageCallbackInfo, eventCallbackInfo);
            },
            /**
             * Creates a topic instance.
             * @param {string} topicName
             * @return {solace.Topic}
             */
            createTopic: function(topicName) {
                return new solace.Topic(topicName);
            },
            /**
             * Initialize connection factory properties.
             * @param {solace.SolclientFactoryProperties} factoryProps
             * @throw {solace.OperationError} Invalid log level
             */
            init: function(factoryProps) {
                if (initializeCount === 0) {
                    if (typeof factoryProps !== "undefined" && factoryProps !== null && factoryProps instanceof solace.SolclientFactoryProperties) {
                        if (factoryProps.logLevel < solace.LogLevel.FATAL || factoryProps.logLevel > solace.LogLevel.TRACE) {
                            throw new solace.OperationError("Invalid log level", solace.ErrorSubcode.PARAMETER_OUT_OF_RANGE, null);
                        }
                        logLevel = factoryProps.logLevel;
                        initializeCount++;
                    }
                }
            },
            /**
              * Get current logging level
              */
            getLogLevel: function() {
                return logLevel;
            },
            /**
             * Change logging level
             * @param {solace.LogLevel} newLevel
             * @throws {solace.OperationError} Invalid log level
             */
            setLogLevel: function(newLevel) {
                if (newLevel < solace.LogLevel.FATAL || newLevel > solace.LogLevel.TRACE) {
                    throw new solace.OperationError("Invalid log level", solace.ErrorSubcode.PARAMETER_OUT_OF_RANGE, null);
                }
                logLevel = newLevel;
            },
            /**
             * Creates a {@link solace.Message} instance.
             * @return {solace.Message} a new message instance.
             */
            createMessage: function() {
                return new solace.Message();
            }
        };
        return factory;

    }());

    solace.P2PUtil = {
        getP2PInboxTopic: function(base) {
            return (base + "/#");
        },
        getP2PTopicSubscription: function(base) {
            return (base + "/>");
        }
    };

    solace.GlobalContext = (function GlobalContext(){
        function leftPad(str, len) {
            for(var z = len - str.length; z > 0; z--) {
                str = "0" + str;
            }
            return str;
        }
        return {
            RandId: (function() {
                var rand = (Math.random() * Math.pow(2, 32)).toFixed(0);
                return leftPad(rand + "", 10);
            }()),
            sessionCounter: 0,
            NextSessionCounter: function() {
                this.sessionCounter++;
                return leftPad(this.sessionCounter + "", 4);
            },
            idCounter: 0,
            NextId: function() {
                this.idCounter++;
                return this.idCounter;
            },
            GenerateClientName: function() {
                var product = "solclientjs", clientName = "";
                if (navigator.product !==  undefined ) {
                   product = solace.TopicUtil.toSafeChars(navigator.product);
                   product = (product.length > 0) ? product : "solclientjs";
                }
                var platform = solace.TopicUtil.toSafeChars(navigator.platform);
                clientName = product + "/" + platform + "/" + this.RandId + "/" + this.NextSessionCounter();
                return clientName;
            }
        };
    }()); // end solace.GlobalContext

    solace.Util = (function Util(){
        return {
            checkParamTypeOf: function(param, expectedTypeName, paramName) {
                if (typeof param !== expectedTypeName) {
                    throw new solace.OperationError(
                            "Invalid parameter type for " + (paramName || "") + ", expected a " + expectedTypeName,
                            solace.ErrorSubcode.PARAMETER_INVALID_TYPE);
                }
            },
            checkParamInstanceOf: function(param, expectedType, expectedTypeName) {
                if (! (param instanceof expectedType)) {
                    throw new solace.OperationError(
                            "Invalid parameter, expected a " + expectedTypeName,
                            solace.ErrorSubcode.PARAMETER_INVALID_TYPE);
                }
            },
            nullTerminate: function nullTerminate(str) {
                if (str === null) {
                    SOLACE_CONSOLE_ERROR("str null in nullTerminate");
                }
                var lastChar = str.charCodeAt(str.length - 1);
                if (lastChar === 0) {
                    return str;
                } else {
                    return str + String.fromCharCode(0x00);
                }
            },
            stripNullTerminate: function stripNullTerminate(str) {
                if (str === null) {
                    SOLACE_CONSOLE_ERROR("str null in stripNullTerminate");
                }
                var lastChar = str.charCodeAt(str.length - 1);
                if (lastChar === 0) {
                    return str.substr(0, str.length - 1);
                } else {
                    return str;
                }
            },
            hexdump: function(s) {
                var output = [],
                printable = [],
                linelen = 0,
                lu_print = (function() {
                    var tmp = [];
                    for (var c = 0; c < 256; c++) {
                        tmp[c] = (c < 33 || c > 126) ? "." : String.fromCharCode(c);
                    }
                    return tmp;
                }()),
                spacer = function(len) {
                    return (len === 8 || len === 16) ? "  " : " ";
                },
                lpad = function(str, len) {
                    for (; str.length < len; str = " " + str) {
                    }
                    return str;
                };
                for (var i = 0; i < s.length; i++) {
                    var ccode = s.charCodeAt(i);
                    output.push(lpad(ccode.toString(16), 2));
                    printable.push(lu_print[ccode] || ".");
                    linelen++;
                    output.push(spacer(linelen));

                    //input finished: complete the line
                    if (i === s.length - 1) {
                        while (linelen < 16) {
                            output.push("  " + spacer(++linelen));
                        }
                    }

                    if (linelen === 16) {
                        output.push(printable.join(""));
                        output.push("\n");
                        linelen = 0;
                        printable = [];
                    }
                }
                return output.join("");
            },
            debugParseSmfStream: function(data) {
                if (data === null) {
                    SOLACE_CONSOLE_ERROR("data null in debugParseSmfStream");
                }
                var pos = 0;
                SOLACE_CONSOLE_WARN("parseSmfStream(): Starting parse, length " + data.length);
                while (pos < data.length) {
                    var incomingMsg = solace.smf.Codec.decodeCompoundMessage(data, pos);
                    if (incomingMsg && incomingMsg.getSmfHeader()) {
                        var smf = incomingMsg.getSmfHeader();
                        SOLACE_CONSOLE_WARN(">> Pos(" + pos + ") Protocol " + smf.m_smf_protocol + ", Length: " + smf.m_messageLength);
                        pos += smf.m_messageLength;
                    } else {
                        // couldn't decode! Lost SMF framing.
                        SOLACE_CONSOLE_WARN("parseSmfStream(): couldn't decode message.");
                        SOLACE_CONSOLE_WARN("Position: " + pos + " length: " + data.length);
                        return;
                    }
                }

            },
            TimingBucket: function(name, interval) {
                this.name = name;
                this.buckets = [];
                this.log = function(v) {
                    if (v === undefined || isNaN(v)) {
                        return;
                    }
                    var normalized = Math.floor(v/interval) * interval;
                    this.buckets[normalized] = this.buckets[normalized] || 0;
                    this.buckets[normalized]++;
                };
                this.bucketCount = function() {
                    var c = 0;
                    for (var i = 0; i < this.buckets.length; i++) {
                        c += this.buckets[i] || 0;
                    }
                    return c;
                };
                this.toString = function() {
                    var cont = [];
                    for(var i in this.buckets) {
                        if (this.buckets.hasOwnProperty(i)) {
                            cont.push(i + ": " + this.buckets[i]);
                        }
                    }
                    return "{" + cont.join(', ') + "}";
                };
            },
            each: function(collection, callback) {
                // Apply function on collection, callback should take args (value, index).
                var len;
                if (typeof (len = collection.length) === 'undefined') {
                    for (var name in collection) {
                        if (collection.hasOwnProperty(name)) {
                            if (callback(collection[name], name) === false) {
                                break;
                            }
                        }
                    }
                } else {
                    for (var i = 0; i < len; i++) {
                        if (callback(collection[i], i) === false) {
                            break;
                        }
                    }
                }
            },
            formatHexString: function (arr) {
                function numToHex(n) {
                    if (typeof n !== "number") {
                        return "";
                    }
                    var s = n.toString(16);
                    return (s.length < 2) ? "0" + s : s;
                }

                var s = "";
                if (typeof arr === "number") {
                    return numToHex(arr);
                } else if (typeof arr === "object" && arr instanceof Array) {
                    for (var i = 0; i < arr.length; i++) {
                        s += numToHex(arr[i]);
                    }
                    return s;
                } else if (typeof arr === "string") {
                    //binary string
                    for (var j = 0; j < arr.length; j++) {
                        s += numToHex(arr.charCodeAt(j));
                    }
                    return s;
                } else {
                    return null;
                }
            }

        };
    }()); // end solace.Util

    solace.MessageDumpStandardProvider = (function MessageDumpStandardProvider() {
        var providers = {
            fpDestination: function(message, flags) {
                var dest = message.getDestination();
                if (dest !== null && dest instanceof solace.Destination) {
                    return ["Destination", true, solace.DestinationTypeDescription[dest.getType()] + " '" + dest.getName() + "'", null];
                }
                else {
                    return ["Destination", false, "", null];
                }
            },

            fpSenderId: function(message, flags) {
                return ["SenderId", (message.getSenderId() !== undefined && message.getSenderId() !== null), message.getSenderId(), null];
            },

            fpAppMsgType: function(message, flags) {
                return ["AppMessageType", (message.getApplicationMessageType() !== undefined && message.getApplicationMessageType() !== null),
                    message.getApplicationMessageType(), null];
            },

            fpAppMsgId: function(message, flags) {
                return ["AppMessageID", (message.getApplicationMessageId() !== undefined && message.getApplicationMessageId() !== null),
                    message.getApplicationMessageId(), null];
            },

            fpSequenceNumber: function(message, flags) {
                var sequenceNum = message.getSequenceNumber();
                if (typeof sequenceNum ==="number") {
                    return ["SequenceNumber", true, sequenceNum, null];
                }
                else {
                    return ["SequenceNumber", false, "", null];
                }
            },

            fpCorrelationId: function(message, flags) {
                return ["CorrelationId", (message.getCorrelationId() !== undefined && message.getCorrelationId() !== null),
                    message.getCorrelationId(), null];
            },

            fpSendTimestamp: function(message, flags) {
                var timestamp = message.getSenderTimestamp();
                if (typeof timestamp === "number") {
                    return ["SendTimestamp", true,
                        timestamp + " (" +  solace.MessageDumpUtil.formatDate(timestamp) + ")", null];
                }
                else {
                    return ["SendTimestamp", false, "", null];
                }
            },

            fpRcvTimestamp: function(message, flags) {
                var timestamp = message.getReceiverTimestamp();
                if (typeof timestamp === "number") {
                    return ["RcvTimestamp", true,
                        timestamp + " (" + solace.MessageDumpUtil.formatDate(timestamp) + ")", null];
                }
                else {
                    return ["RcvTimestamp", false, "", null];
                }
            },

            fpClassOfService: function(message, flags) {
                var cos = message.getUserCos();
                if (typeof cos === "number") {
                    return ["Class Of Service", true, solace.MessageUserCosTypeDescription[message.getUserCos()], null];
                }
                else {
                    return ["Class Of Service", false, "", null];
                }
            },

            fpDeliveryMode: function(message, flags) {
                var mode = message.getDeliveryMode();
                if (typeof mode === "number") {
                    return ["DeliveryMode", true, solace.MessageDeliveryModeTypeDescription[message.getDeliveryMode()], null];
                }
                else {
                    return ["DeliveryMode", false, "", null];
                }
            },

            fpMessageRedelivered: function(message, flags) {
                return  ["Message Re-delivered", message.isRedelivered(), "", null];
            },

            fpDiscardIndication: function(message, flags) {
                return ["Discard Indication", message.isDiscardIndication(), "", null];
            },

            fpReplyMessage: function(message, flags) {
                return ["Reply Message", message.isReplyMessage(), "", null];
            },

            fpReplyTo: function(message, flags) {
                var replyTo = message.getReplyTo();
                if (replyTo !== null && replyTo instanceof solace.Destination) {
                    return ["ReplyTo", true, solace.DestinationTypeDescription[replyTo.getType()] + " '" + replyTo.getName() + "'", null];
                }
                else {
                    return ["ReplyTo", false, "", null];
                }
            },

            fpDeliverToOne: function(message, flags) {
                return ["Deliver To One", message.isDeliverToOne(), "", null];
            },

            fpElidingEligible: function(message, flags) {
                return ["Eliding Eligible", message.isElidingEligible(), "", null];
            },

            fpUserData: function(message, flags) {
                if (solace.StringUtil.notEmpty(message.getUserData())) {
                    return ["User Data", true, "len=" + message.getUserData().length,
                        solace.StringUtil.formatDumpBytes(message.getUserData(), true, 2)];
                }
                else {
                    return ["User Data", false, "", null];
                }
            },

            fpUserPropertyMap: function(message, flags) {
                var propMap = message.getUserPropertyMap();
                if (propMap !== null && propMap instanceof solace.SDTMapContainer) {
                    var value = propMap.getKeys().length + " entries";
                    var detailValue = null;
                    if (flags === solace.MessageDumpFlag.MSGDUMP_FULL) {
                        try {
                            detailValue = solace.MessageDumpUtil.printMap(propMap, 2);
                        } catch (e) {
                            SOLACE_CONSOLE_ERROR(e);
                            detailValue = "Error";
                        }
                    }
                    return ["User Property Map", true, value, detailValue];
                }
                else {
                    return ["User Property Map", false, "", null];
                }
            },

            fpSdtStream: function(message, flags) {
                var sdtFieldValue = message.getSdtContainer();
                if (sdtFieldValue !== null && sdtFieldValue.getType() === solace.SDTFieldType.STREAM) {
                    var value = solace.MessageDumpUtil.countItems(sdtFieldValue.getValue()) + " entries";
                    var detailValue = null;
                    if (flags === solace.MessageDumpFlag.MSGDUMP_FULL) {
                        try {
                            detailValue = solace.MessageDumpUtil.printStream(sdtFieldValue.getValue(), 2);
                        } catch (e) {
                            SOLACE_CONSOLE_ERROR(e);
                            detailValue = "Error";
                        }
                    }
                    return ["SDT Stream", true, value, detailValue];
                }
                else {
                    return ["SDT Stream", false, "", null];
                }
            },

            fpSdtMap: function(message, flags) {
                var sdtFieldValue = message.getSdtContainer();
                if (sdtFieldValue !== null && sdtFieldValue.getType() === solace.SDTFieldType.MAP) {
                    var value = sdtFieldValue.getValue().getKeys().length + " entries";
                    var detailValue = null;
                    if (flags === solace.MessageDumpFlag.MSGDUMP_FULL) {
                        try {
                            detailValue = solace.MessageDumpUtil.printMap(sdtFieldValue.getValue(), 2);
                        } catch (e) {
                            SOLACE_CONSOLE_ERROR(e);
                            detailValue = "Error";
                        }
                    }
                    return ["SDT Map", true, value, detailValue];
                }
                else {
                    return ["SDT Map", false, "", null];
                }
            },

            fpBinaryAttachment: function(message, flags) {
                var att = message.getBinaryAttachment();
                if (solace.StringUtil.notEmpty(att)) {
                    var value = "len=" + att.length;
                    var detailValue = null;
                    if (flags === solace.MessageDumpFlag.MSGDUMP_FULL) {
                        detailValue = solace.StringUtil.formatDumpBytes(att, true, 2);
                    }
                    return["Binary Attachment", true, value, detailValue];
                }
                else {
                    return ["Binary Attachment", false, "", null];
                }
            },

            fpXmlContent: function(message, flags) {
                var xml = message.getXmlContent();
                if (solace.StringUtil.notEmpty(xml)) {
                    var value = "len=" + xml.length;
                    var detailValue = null;
                    if (flags === solace.MessageDumpFlag.MSGDUMP_FULL) {
                        detailValue = solace.StringUtil.formatDumpBytes(xml, true, 2);
                    }
                    return["XML", true, value, detailValue];
                }
                else {
                    return ["XML", false, "", null];
                }
            },

            fpXmlMetadata: function(message, flags) {
                var xmlMetadata = message.getXmlMetadata();
                if (solace.StringUtil.notEmpty(xmlMetadata)) {
                    var value = "len=" + xmlMetadata.length;
                    var detailValue = null;
                    if (flags === solace.MessageDumpFlag.MSGDUMP_FULL) {
                        detailValue = solace.StringUtil.formatDumpBytes(xmlMetadata, true, 2);
                    }
                    return["XML Metadata", true, value, detailValue];
                }
                else {
                    return ["XML Metadata", false, "", null];
                }
            }
       };

       return providers;
    }()); // solace.MessageDumpStandardProvider

    solace.MessageDumpUtil = (function MessageDumpUtil() {
        var providers = solace.MessageDumpStandardProvider;
        var dumpProviders = [];
        for (var index in providers) {
            if (providers.hasOwnProperty(index)) {
                dumpProviders.push(providers[index]);
            }
        }

        return {
            printMap: function(sdtMap, indent) {
                if (typeof sdtMap === "undefined" || sdtMap === null || !(sdtMap instanceof solace.SDTMapContainer)) {
                    return null;
                }
                var sb = new solace.StringBuffer();
                var strIndent = solace.StringUtil.padRight("", indent, " ");
                var keys = sdtMap.getKeys().sort();
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var sdtFieldValue = sdtMap.getField(key);
                    var type = null, value = null;

                    if (sdtFieldValue.getType() !== null) {
                        type = sdtFieldValue.getType();
                    }
                    if (sdtFieldValue.getValue() !== null) {
                        value = sdtFieldValue.getValue();
                    }
                    var strValue = null;
                    switch (type) {
                        case solace.SDTFieldType.MAP:
                            strValue = "\n";
                            strValue += this.printMap(value, indent+2);
                            break;
                        case solace.SDTFieldType.STREAM:
                            strValue = "\n";
                            strValue += this.printStream(value, indent+2);
                            break;
                        case solace.SDTFieldType.BYTEARRAY:
                            strValue = solace.StringUtil.formatDumpBytes(value, false, 0);
                            if (strValue !== null && strValue.charAt(strValue.length-1) === '\n') {
                                strValue = strValue.substring(0, strValue.length-1);
                            }
                            break;
                        case solace.SDTFieldType.DESTINATION:
                            strValue = solace.DestinationTypeDescription[value.getType()] + " '" + value.getName() + "'";
                            break;
                        default:
                            strValue = (value !== null)?value.toString():null;
                    }
                    sb.append(strIndent);
                    sb.append("Key '").append(key).append("' (").append(solace.SDTFieldTypeDescription[type]).append("): ").append(strValue);
                    if (i < (keys.length-1)) {
                        sb.append("\n");
                    }
                }
                return sb.toString();
            },

            printStream: function(sdtStream, indent) {
                if (typeof sdtStream === "undefined" || sdtStream === null ||
                        !(sdtStream instanceof solace.SDTStreamContainer)) {
                    return null;
                }
                sdtStream.rewind();
                var sb = new solace.StringBuffer();
                var strIndent = solace.StringUtil.padRight("", indent, " ");
                while (sdtStream.hasNext()) {
                    var sdtFieldValue = sdtStream.getNext();
                    var type = null, value = null;

                    if (sdtFieldValue.getType() !== null) {
                        type = sdtFieldValue.getType();
                    }
                    if (sdtFieldValue.getValue() !== null) {
                        value = sdtFieldValue.getValue();
                    }
                    var strValue = null;
                    switch (type) {
                        case solace.SDTFieldType.MAP:
                            strValue = "\n";
                            strValue += this.printMap(value, indent+2);
                            break;
                        case solace.SDTFieldType.STREAM:
                            strValue = "\n";
                            strValue += this.printStream(value, indent+2);
                            break;
                        case solace.SDTFieldType.BYTEARRAY:
                            strValue = solace.StringUtil.formatDumpBytes(value, false, 0);
                            if (strValue !== null && strValue.charAt(strValue.length-1) === '\n') {
                                strValue = strValue.substring(0, strValue.length-1);
                            }
                            break;
                        case solace.SDTFieldType.DESTINATION:
                            strValue = solace.DestinationTypeDescription[value.getType()] + " '" + value.getName() + "'";   
                            break;
                        default:
                            strValue = (value !== null)?value.toString():null;
                    }
                    sb.append(strIndent);
                    sb.append("(").append(solace.SDTFieldTypeDescription[type]).append("): ").append(strValue);
                    if (sdtStream.hasNext()) {
                        sb.append("\n");
                    }
                }
                sdtStream.rewind();
                return sb.toString();
            },

            countItems: function(sdtStream) {
                if (typeof sdtStream === "undefined" || sdtStream === null ||
                        (!(sdtStream instanceof solace.SDTStreamContainer))) {
                    return 0;
                }
                sdtStream.rewind();
                var count = 0;
                while (sdtStream.hasNext()) {
                    sdtStream.getNext();
                    count++;
                }
                sdtStream.rewind();
                return count;
            },

            formatDate: function(timeStamp) {
                var date = new Date(timeStamp);
                return date.format("ddd mmm dd yyyy HH:MM:ss Z", true);
            },

            dump: function (message, flags, separator, colPadding) {
                var fieldValues;
                var key;
                var isPresent;
                var value;
                var detailValue;
                var sb = new solace.StringBuffer();
                var theSeparator = "\n";
                var theColPadding = 40;
                if (typeof separator !== "undefined" && separator !== null && typeof separator === "string") {
                    theSeparator = separator;
                }
                if (typeof colPadding !== "undefined" && colPadding !== null && typeof colPadding === "number") {
                    theColPadding = colPadding;
                }
                var needSeparator = false;
                for (var i = 0; i < dumpProviders.length; i++) {
                    fieldValues = dumpProviders[i](message, flags);
                    isPresent = fieldValues[1];
                    if (!isPresent) {
                        continue;
                    }
                    key = fieldValues[0];
                    value = fieldValues[2];
                    detailValue = fieldValues[3];
                    if (needSeparator) {
                        sb.append(theSeparator);
                    }

                    if (value === null || value.length === 0) {
                        // If we have no VALUE field, this is probably a boolean flag
                        // and we just end up displaying the key and a newline.
                        sb.append(key);
                    } else {
                        sb.append(solace.StringUtil.padRight(key + ":", theColPadding, " "));
                        sb.append(value);
                    }
                    if (detailValue !== null && ((flags & solace.MessageDumpFlag.MSGDUMP_FULL) > 0)) {
                        sb.append("\n");
                        if (detailValue.indexOf("  ") !== 0) {
                            sb.append("  ");
                        }
                        sb.append(detailValue);
                        if (detailValue.substring(detailValue.length-2) !== "\n" && i < (dumpProviders.length - 1)) {
                            sb.append("\n");
                        }
                    }
                    needSeparator = true;
                }
                return sb.toString();
            }
        };

    }()); // end solace.MessageDumpUtil

}(solace));
//
//
//
/*global solace:true window console BlobBuilder ArrayBuffer Uint8Array SOLACE_FATAL SOLACE_ERROR SOLACE_WARN SOLACE_INFO SOLACE_DEBUG SOLACE_TRACE SOLACE_CONSOLE_FATAL SOLACE_CONSOLE_ERROR SOLACE_CONSOLE_WARN SOLACE_CONSOLE_INFO SOLACE_CONSOLE_DEBUG SOLACE_CONSOLE_TRACE */
/*global ActiveXObject */

(function(solace){

    var SOL_CONNECTION_DEBUG = false;

    /**
     * A URI starting with a "/" is a "path-absolute" URI, and those aren't
     * allowed to have a query component (starting with "?").
     *
     * If an origin isn't defined in the url, tack on the one from the page.
     *
     * @param url
     */
    function prependOrigin(url) {
        if (url.match(/^http(s)?:/i)) {
            // has origin (non-relative) || 
            return url;
        } else if (window.location.origin) {
            return window.location.origin + ((url.charAt(0) !== "/") ? "/" : "") + url; // that's clear right?
        } else {
            return url;
        }
    }

    function getXhrObj() {
        var xhr = null;
        if (typeof window.XMLHttpRequest !== 'undefined' && window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            if (typeof window.ActiveXObject !== 'undefined' && window.ActiveXObject) {
                var msHttpList = ["Microsoft.XMLHttp", "MSXML2.XMLHttp", "MSXML2.XMLHttp.5.0", "MSXML2.XMLHttp.4.0", "MSXML2.XMLHttp.3.0"];
                for (var i = 0; i < msHttpList.length; i++) {
                    try {
                        xhr = new ActiveXObject(msHttpList[i]);
                        break;
                    }
                    catch (e) {
                        // Do nothing
                    }
                }
            }
        }
        if (typeof(xhr) === 'undefined' || xhr === null) {
            throw (new solace.TransportError("Failed to create an XMLHttpRequest", solace.ErrorSubcode.CREATE_XHR_FAILED));
        }
        return xhr;
    }

    /**
     * HttpConnection : This class contains all state for a single HTTP connection (XHR).
     * @constructor
     */
    function HttpConnection(url, base64Enc, rxDataCb, connectionErrorCb) {
        this.m_url = prependOrigin(url);
        this.m_base64Enc = base64Enc;
        this.m_sniffed_transport = false;
        this.m_xhr = null;
        this.m_rxDataCb = rxDataCb;
        this.m_connErrorCb = connectionErrorCb;
        this.m_reqActive = false;
        this.m_REQCOUNTER = 0;
        this.m_REQBASE = Math.floor(Math.random()*1000);

        this.m_xhr = getXhrObj();
        this.stats = {
            WaitedToken: new solace.Util.TimingBucket('WaitedToken', 100),
            HadToken: new solace.Util.TimingBucket('HadToken', 100),
            ReturnedToken: new solace.Util.TimingBucket('ReturnedToken', 100),
            toString: function() {
                var s = "";
                solace.Util.each([this.WaitedToken, this.HadToken, this.ReturnedToken], function(b) {
                    if (b && b.bucketCount() > 0) {
                        s += b.name + ">> " + b.toString() + "\n";
                    }
                });
                return s;
            }
        };
        var clThis = this;
        this.recStat = function(s) {
            if (!SOL_CONNECTION_DEBUG) {
                return;
            }
            function getTs() {
                return new Date().getTime();
            }
            var stats = clThis.stats;
            if (s === "GotToken") {
                stats.LastGotToken = getTs();
                if (stats.LastSendMsg) {
                    var waitedTok = stats.LastGotToken - stats.LastSendMsg;
                    stats.WaitedToken.log(waitedTok);
                    if (waitedTok > 100) {
                        SOLACE_CONSOLE_WARN("Abnormally long waitToken, last request: " + this.m_REQBASE + "_" + this.m_REQCOUNTER);
                    }
                }
            }
            if (s === "SendMsg") {
                stats.LastSendMsg = getTs();
                var hadToken = stats.LastSendMsg - stats.LastGotToken;
                stats.HadToken.log(hadToken);
            }
            if (s === "GotData") {
                stats.LastGotData = getTs();
            }
            if (s === "ReturnToken") {
                stats.LastReturnToken = getTs();
                if (stats.LastGotData) {
                    var returnedToken = stats.LastReturnToken - stats.LastGotData;
                    stats.ReturnedToken.log(returnedToken);
                }
            }
        };
    }
    solace.HttpConnection = HttpConnection;

    /**
     * @static
     * Check if we can try binary XHR on this browser.
     */
    HttpConnection.browserSupportsXhrBinary = function() {
        if (window.XMLHttpRequest && window.XMLHttpRequest.prototype.sendAsBinary) {
            // Firefox
            return true;
        } else if (window.XMLHttpRequest && window.ArrayBuffer && window.Uint8Array && (window.BlobBuilder || window.WebKitBlobBuilder)) {
            // Modern Webkit
            return true;
        } else {
            // text fallback
            return false;
        }
    };

    function sendXhrText(xhr, data) {
        if (data !== null) {
            data = solace.base64_encode(data);
        }
        xhr.setRequestHeader('Content-Type', 'application/text');
        xhr.send(data);
    }

    function sendXhrBinary(xhr, data) {
        /*
         We built these messages ourselves so we assume our charcodes are in
         the range 0x00 - 0xFF, no need to chop off the MSB of each char.
         */

        xhr.overrideMimeType("application/octet-stream; charset=x-user-defined");
        xhr.setRequestHeader('Content-Type', 'application/octet-stream; charset=x-user-defined');

        if (window.XMLHttpRequest && window.XMLHttpRequest.prototype.sendAsBinary) {
            // Firefox
            xhr.sendAsBinary(data);
        } else if (window.XMLHttpRequest && window.ArrayBuffer && window.Uint8Array && (window.BlobBuilder || window.WebKitBlobBuilder)) {
            // Modern Webkit
            // See: http://javascript0.org/wiki/Portable_sendAsBinary

            // Webkit renamed BlobBuilder to WebKitBlobBuilder while it standardizes
            var LocBlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder;

            var arrayBuf = new ArrayBuffer(data.length);
            var uint8Array = new Uint8Array(arrayBuf, 0);
            for (var i = 0; i < data.length; i++) {
                uint8Array[i] = data.charCodeAt(i);
            }
            var builder = new LocBlobBuilder();
            builder.append(arrayBuf);
            xhr.send(builder.getBlob());
        } else {
            // text fallback
            sendXhrText(data);
        }
    }

    /*
     * Send data over the connection - this requires a send token
     */
    HttpConnection.prototype.send = function(data, attempt) {
        attempt = (typeof attempt === "undefined" ? 0 : attempt);
        if (attempt > 0) {
            this.m_xhr.abort();
            this.m_xhr = getXhrObj();
        }
        this.m_xhr.open("POST", this.m_url, true);
        var encThis = this;
        // We pass the write data to the CB so we can retry when it mysteriously fails.
        this.m_xhr.onreadystatechange = function() {
            encThis.xhrStateChange(data, attempt);
        };
        this.m_reqActive = true;

        if (SOL_CONNECTION_DEBUG) {
            this.m_REQCOUNTER++;
            this.m_xhr.setRequestHeader('sol-request-track', this.m_REQBASE + "_" + this.m_REQCOUNTER);
        }
        if (this.m_base64Enc) {
            sendXhrText(this.m_xhr, data);
        } else {
            sendXhrBinary(this.m_xhr, data);
        }
        this.recStat("SendMsg");
    };

    
    // XmlHttpRequest Callback
    HttpConnection.prototype.xhrStateChange = function(sentdata, attempt){

        if (this.m_xhr.readyState === 4) {
            if (! this.m_reqActive) {
                // request aborted, DO NOT propagate event
                return;
            }

            if (this.m_xhr.status === 200 || this.m_xhr.status === 304) {
                this.m_reqActive = false;
                var data = this.m_xhr.responseText;
                //SOLACE_CONSOLE_DEBUG("received data: " + data.length + " bytes");
                if (this.m_base64Enc) {
                    try {
                        //data = solace.Base64.decode(data);
                        data = solace.base64_decode(data);
                    }
                    catch(e) {
                        // Failed the decode - call the error callback
                        SOLACE_CONSOLE_ERROR("Data decode error on: " + data);
                        SOLACE_CONSOLE_ERROR("Date decode error is: " + e);
                        this.m_rxDataCb(3, data);
                        return;
                    }
                } else {
                    // take lower-8 bits
                    var decoded_data = [];
                    for (var i = 0; i < data.length; i++) {
                        decoded_data.push(String.fromCharCode(data.charCodeAt(i) & 0xFF));
                    }
                    data = decoded_data.join("");
                }
                this.m_rxDataCb(0, data);
            }
            else {
                var status = this.m_xhr.status;
                var statusText = this.m_xhr.statusText;
                SOLACE_CONSOLE_INFO("response failed.  status=" + status + ", statusText=" + statusText);
                if (attempt === 0 && this.m_reqActive && status !== 400) {
                    SOLACE_CONSOLE_INFO("XHR failed while request active, will retry send once, attempt=" + attempt);
                    this.send(sentdata, attempt+1); // RETRY (could be a transient browser connection problem)
                } else {
                    this.m_reqActive = false;
                    this.m_connErrorCb(status,
                            "HTTP request failed: status=" + status + " statusText=" + statusText);
                }
            }
        }
    };

    HttpConnection.prototype.isUsingBase64 = function() {
        return this.m_base64Enc;
    };

    // This function will abort the current xhr request if it is active
    HttpConnection.prototype.abort = function() {
        // mark request as inactive, so we won't process statechange events
        this.m_reqActive = false;
        if (this.m_xhr && this.m_xhr.abort) {
            this.m_xhr.abort();
        }
    };
    
}(solace));

//
/*global solace:true window console BlobBuilder ArrayBuffer Uint8Array SOLACE_FATAL SOLACE_ERROR SOLACE_WARN SOLACE_INFO SOLACE_DEBUG SOLACE_TRACE SOLACE_CONSOLE_FATAL SOLACE_CONSOLE_ERROR SOLACE_CONSOLE_WARN SOLACE_CONSOLE_INFO SOLACE_CONSOLE_DEBUG SOLACE_CONSOLE_TRACE */
//

(function(solace) {
    // === SDTField utils ===
    function fail_invalid_parameter(valueType) {
        throw new solace.OperationError(
                "Invalid SDT type:value combination, expected value type " + valueType,
                solace.ErrorSubcode.PARAMETER_INVALID_TYPE);
    }

    function validateSdtField(type, value) {
        var baseTypes = [];
        baseTypes[solace.SDTFieldType.BOOL] = "boolean";
        baseTypes[solace.SDTFieldType.UINT8] = "number";
        baseTypes[solace.SDTFieldType.INT8] = "number";
        baseTypes[solace.SDTFieldType.UINT16] = "number";
        baseTypes[solace.SDTFieldType.INT16] = "number";
        baseTypes[solace.SDTFieldType.UINT32] = "number";
        baseTypes[solace.SDTFieldType.INT32] = "number";
        baseTypes[solace.SDTFieldType.UINT64] = "number";
        baseTypes[solace.SDTFieldType.INT64] = "number";
        baseTypes[solace.SDTFieldType.WCHAR] = "string";
        baseTypes[solace.SDTFieldType.STRING] = "string";
        baseTypes[solace.SDTFieldType.BYTEARRAY] = "string";
        baseTypes[solace.SDTFieldType.FLOATTYPE] = "number";
        baseTypes[solace.SDTFieldType.DOUBLETYPE] = "number";

        if (baseTypes[type]) {
            if (typeof value !== baseTypes[type]) {
                fail_invalid_parameter(baseTypes[type]);
            }
        } else if (type === solace.SDTFieldType.MAP && !(value instanceof solace.SDTMapContainer)) {
            fail_invalid_parameter("solace.SDTMapContainer");
        } else if (type === solace.SDTFieldType.STREAM && !(value instanceof solace.SDTStreamContainer)) {
            fail_invalid_parameter("solace.SDTStreamContainer");
        } else if (type === solace.SDTFieldType.DESTINATION && !(value instanceof solace.Destination)) {
            fail_invalid_parameter("solace.Destination");
        }
    }
    // === END SDTField utils ===

    /**
     * @class
     * Represents a SDT (Structured Data Type) field. To create an instance of an <code>SDTField</code>, call {@link solace.SDTField.create}.
     */
    solace.SDTField = function SDTField(){
        this.m_type = solace.SDTFieldType.NULLTYPE;
        this.m_value = null;
    };

    /**
     * Create a new SDTField instance representing a Value of a given Type.
     *
     * @static
     * @param {solace.SDTFieldType} type The type of field represented.
     * @param value The corresponding value to store in the field.
     */
    solace.SDTField.create = function(type, value) {
        validateSdtField(type, value);
        var sdt = new solace.SDTField();
        sdt.m_type = type;
        sdt.m_value = value;
        return sdt;
    };

    /**
     * Gets the type of field represented.
     * @return {solace.SDTFieldType} The type of field represented.
     */
    solace.SDTField.prototype.getType = function() {
        return this.m_type;
    };

    /**
     * Gets the field value.
     * @return Field value (as one of the supported data types).
     */
    solace.SDTField.prototype.getValue = function() {
        return this.m_value;
    };

    solace.SDTField.prototype.toString = function() {
        return "[SDTField type:" + this.getType() + " value:" + this.getValue() + "]";
    };

    /**
     * @class An enumeration of all SDT data types.
     * @static
     */
    solace.SDTFieldType = {
        /**
         * @constant
         * @description Maps to a boolean.
         */
        BOOL: 0,
        /**
         * @constant
         * @description Maps to a number.
         */
        UINT8: 1,
        /**
         * @constant
         * @description Maps to a number.
         */
        INT8: 2,
        /**
         * @constant
         * @description Maps to a number.
         */
        UINT16: 3,
        /**
         * @constant
         * @description Maps to a number.
         */
        INT16: 4,
        /**
         * @constant
         * @description Maps to a number.
         */
        UINT32: 5,
        /**
         * @constant
         * @description Maps to a number.
         */
        INT32: 6,
        /**
         * @constant
         * @description Maps to a number. <br>
         * <strong>Warning:</strong> Supports 48-bit integers (range: 0 to 2<sup>48</sup>-1). When decoding, only the lower 48 bits are considered significant.
         */
        UINT64: 7,
        /**
         * @constant
         * @description Maps to a number. <br>
         * <strong>Warning:</strong> Supports 48-bit integers + sign (range: -(2<sup>48</sup>-1) to 2<sup>48</sup>-1). When decoding, only the lower 48 bits are considered significant.
         */
        INT64: 8,
        /**
         * @constant
         * @description A single character; maps to a string.
         */
        WCHAR: 9,
        /**
         * @constant
         * @description Maps to a string.
         */
        STRING: 10,
        /**
         * @constant
         * @description Maps to a string (string representation of a byte array).
         */
        BYTEARRAY: 11,
        /**
         * @constant
         * @description Single-precision float; maps to a number.
         */
        FLOATTYPE: 12,
        /**
         * @constant
         * @description Double-precision float; maps to a number.
         */
        DOUBLETYPE: 13,
        /**
         * @constant
         * @description Maps to {@link solace.SDTMapContainer}.
         */
        MAP: 14,
        /**
         * @constant
         * @description Maps to {@link solace.SDTStreamContainer}.
         */
        STREAM: 15,
        /**
         * @constant
         * @description Maps to {@link solace.Destination}.
         */
        DESTINATION: 16,
        /**
         * @constant
         * @description Maps to <code>null</code>.
         */
        NULLTYPE: 17,
        /**
         * @constant
         * @description Maps to an unknown type.
         */
        UNKNOWN: 18
    };

    /**
     * @private
     */
    solace.SDTFieldTypeDescription = (function() {
        var description = [];
        var index;
        for (index in solace.SDTFieldType) {
            if (solace.SDTFieldType.hasOwnProperty(index)) {
                description[solace.SDTFieldType[index]] = index;
            }
        }
        return description;
    }());

    /**
     * @class
     * Defines a Structued Data Type (SDT) map container.
     */
    solace.SDTMapContainer = function SDTMapContainer(){
        this.m_map = []; //key-value mappings (keys are strings)
    };

    /**
     * Get the list of keys in this map, in unspecified order.
     * @return {Array.<string>} Array of defined keys in the map.
     */
    solace.SDTMapContainer.prototype.getKeys = function() {
        var ret = [];
        // iterates over all keys in m_map, 'i' taking the value of the key string.
        for (var i in this.m_map) {
            if (this.m_map.hasOwnProperty(i)) {
                ret.push(i);
            }
        }
        return ret;
    };

    /**
     * Return the SDTField with the given key.
     * @param {string} key The key to look up.
     * @return {solace.SDTField} The field referenced by key.
     */
    solace.SDTMapContainer.prototype.getField = function(key){
        return this.m_map[key];
    };
    /**
     * Delete an SDTField with the given key.
     * @param {string} key
     */
    solace.SDTMapContainer.prototype.deleteField = function(key){
        delete this.m_map[key];
    };

    /**
     * Adds a field to this map. If a key:value mapping already exists for this key, it is replaced.
     * <p>
     * The provided <code>value</code> argument should be an {@link solace.SDTField} instance. (Instead of an SDTField, it is also
     * possible to specify arguments (type, value), an {@link solace.SDTFieldType} and a value, respectively. The SDK wraps them in a <code>SDTField</code> of the specified type.)
     *
     * @param {string} key The key by which to store the given value.
     * @param {solace.SDTField} value A solace.SDTField instance to store in the map.
     */
    solace.SDTMapContainer.prototype.addField = function(key, value) {
        if (value instanceof solace.SDTField) {
            this.m_map[key] = value;
        } else if (arguments.length >= 3) {
            this.m_map[arguments[0]] = solace.SDTField.create(arguments[1], arguments[2]);
        }
    };

    /**
     * @class
     * Defines a Structured Data Type (SDT) stream container. A stream is an iterable collection of solace.SDTFields.
     *
     */
    solace.SDTStreamContainer = function SDTStreamContainer(){
        this.m_stream = [];
        this.m_writable = true;
        this.m_readPt = 0;
    };

    /**
     * Returns true if the stream has at least one more {@link solace.SDTField}
     * at the current position.
     * @return {boolean} true, if there is an available field at the read pointer; false, otherwise.
     */
    solace.SDTStreamContainer.prototype.hasNext = function(){
        return (this.m_stream.length > this.m_readPt);
    };

    /**
     * Returns the next field in the stream and advances the read pointer.
     * If the end of the stream is reached, it returns undefined.
     * @return {solace.SDTField} The next field in the stream.
     */
    solace.SDTStreamContainer.prototype.getNext = function() {
        return (this.m_readPt < this.m_stream.length) ? this.m_stream[this.m_readPt++] : undefined;
    };

    /**
     * Rewinds the read pointer to the beginning of the stream. Normally when {@link solace.hasNext}
	 * returns false, a client application must call rewind() to reiterate over the stream's fields. 
     * @throws {solace.OperationError} if the stream cannot be rewound.
     */
    solace.SDTStreamContainer.prototype.rewind = function(){
        this.m_readPt = 0;
    };

    /**
     * Appends a SDTField to the stream.
     * <p>
     * If <code>field</code> is a solace.SDTField,
     * this field is appended to the stream.
     * <br>
     * If <code>field</code> is a
     * solace.SDTFieldType, then the SDK will create a solace.SDTField of this type
     * with a value of <code>optValue</code> and append this new solace.SDTField to
     * the stream.
     *
     * @param {solace.SDTField} field The field to append to the stream.
     * @param [optValue] The value to wrap as an SDTField.
     */
    solace.SDTStreamContainer.prototype.addField = function(field, optValue) {
        if (this.m_writable) {
            if (field instanceof solace.SDTField) {
                this.m_stream.push(field);
            } else if (arguments.length >= 2) {
                this.m_stream.push(solace.SDTField.create(arguments[0], arguments[1]));
            }
        }
    };

    solace.sdt = solace.sdt || {};
    solace.sdt.Codec = (function() {
        var smfDTypes = {
            Null: 0x00,
            Boolean: 0x01,
            Integer: 0x02,
            UnsignedInteger: 0x03,
            Float: 0x04,
            Char: 0x05,
            ByteArray: 0x06,
            String: 0x07,
            Destination: 0x08,
            SMFMessage: 0x09,
            Map: 0x0A,
            Stream: 0x0B
        };

        //Util: decode 1, 2, 3, 4 byte UINT.
        function autoDecodeVarLengthNumber(dataStr) {
            switch (dataStr.length) {
                case 1:
                    return solace.Convert.strToInt8(dataStr);
                case 2:
                    return solace.Convert.strToInt16(dataStr);
                case 3:
                    return solace.Convert.strToInt24(dataStr);
                case 4:
                    return solace.Convert.strToInt32(dataStr);
                default:
                    return false;
            }
        }

        // shorthand
        var crSdtField = solace.SDTField.create;

        function getBinaryString(strBytes) {
            var bits = [];
            for (var i = strBytes.length - 1; i >= 0; i--) {
                var byte_i = strBytes.charCodeAt(i) & 0xFF;
                for(var j = 0; j < 8; j++) {
                    bits.push(byte_i % 2 ? 1 : 0);
                    byte_i = byte_i >> 1;
                }
            }
            bits.reverse();
            return bits.join('');
        }

        function int48ToStr(v) {
            var bytes = [];
            for (var i = 0; i < 6; i++) {
                var byte_i = (v % 256);
                v = Math.floor(v / 256);
                bytes.push(String.fromCharCode(byte_i));
            }
            bytes.reverse();
            return bytes.join("");
        }

        // Parse an integer SDT Field: [U]INT 8, 16, 32, 64.
        function parseIntegerField(bSigned, datastr) {
            var sign = false;
            var val = 0;

            switch (datastr.length) {
                case 1:
                    val = solace.Convert.strToInt8(datastr);
                    if (bSigned) {
                        sign = (val & 0x80) !== 0;
                        if (sign) {
                            val -= 256;
                        }
                        return crSdtField(solace.SDTFieldType.INT8, val);
                    } else {
                        return crSdtField(solace.SDTFieldType.UINT8, val);
                    }
                    break;
                case 2:
                    val = solace.Convert.strToInt16(datastr);
                    if (bSigned) {
                        sign = (val & 0x8000) !== 0;
                        if (sign) {
                            val -= 65536;
                        }
                        return crSdtField(solace.SDTFieldType.INT16, val);
                    } else {
                        return crSdtField(solace.SDTFieldType.UINT16, val);
                    }
                    break;
                case 4:
                    val = solace.Convert.strToInt32(datastr);
                    if (bSigned) {
                        // raw read using strToInt32 (it reads 2's complement)
                        return crSdtField(solace.SDTFieldType.INT32, val);
                    } else {
                        // conversion error with strToInt32! (we can't read back a 32bit uint)
                        // Solution is to convert byte positions ourselves without using bitwise shifts
                        // Because the UINT is guaranteed to be < 2^53 this should work.
                        var b0 = datastr.charCodeAt(0);
                        var b1 = datastr.charCodeAt(1);
                        var b2 = datastr.charCodeAt(2);
                        var b3 = datastr.charCodeAt(3);
                        val = (b0 * 16777216) + (b1 * 65536) + (b2 * 256) + b3;
                        return crSdtField(solace.SDTFieldType.UINT32, val);
                    }
                    break;
                case 8:
                    // we handle 48-bit ints safely
                    var bitstr64 = getBinaryString(datastr.substr(0, 8));
                    val = parseInt(bitstr64.substr(16, 48), 2);
                    if (bSigned) {
                        if (bitstr64.substr(0, 1) === "1") {
                            // negative (two's complement) number
                            val -= Math.pow(2, 48);
                        }
                        return crSdtField(solace.SDTFieldType.INT64, val);
                    } else {
                        return crSdtField(solace.SDTFieldType.UINT64, val);
                    }
            }
            return null;
        }

        // IEEE 754 implementation taken from node-packet library (MIT LICENSE)
        // https://github.com/bigeasy/node-packet
        var IEEE754LIB = {
            /*
             The MIT License

             Copyright (c) 2010 Alan Gutierrez

             Permission is hereby granted, free of charge, to any person obtaining a copy
             of this software and associated documentation files (the "Software"), to deal
             in the Software without restriction, including without limitation the rights
             to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
             copies of the Software, and to permit persons to whom the Software is
             furnished to do so, subject to the following conditions:

             The above copyright notice and this permission notice shall be included in
             all copies or substantial portions of the Software.

             THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
             IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
             FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
             AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
             LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
             OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
             THE SOFTWARE.
             */
            toIEEE754: function(v, ebits, fbits) {
                var bias = (1 << (ebits - 1)) - 1;

                // Compute sign, exponent, fraction
                var s, e, f;
                if (isNaN(v)) {
                    e = (1 << bias) - 1;
                    f = 1;
                    s = 0;
                }
                else if (v === Infinity || v === -Infinity) {
                    e = (1 << bias) - 1;
                    f = 0;
                    s = (v < 0) ? 1 : 0;
                }
                else if (v === 0) {
                    e = 0;
                    f = 0;
                    s = (1 / v === -Infinity) ? 1 : 0;
                }
                else {
                    s = v < 0;
                    v = Math.abs(v);

                    if (v >= Math.pow(2, 1 - bias)) {
                        var ln = Math.min(Math.floor(Math.log(v) / Math.LN2), bias);
                        e = ln + bias;
                        f = v * Math.pow(2, fbits - ln) - Math.pow(2, fbits);
                    }
                    else {
                        e = 0;
                        f = v / Math.pow(2, 1 - bias - fbits);
                    }
                }

                // Pack sign, exponent, fraction
                var i, bits = [];
                for (i = fbits; i; i -= 1) {
                    bits.push(f % 2 ? 1 : 0);
                    f = Math.floor(f / 2);
                }
                for (i = ebits; i; i -= 1) {
                    bits.push(e % 2 ? 1 : 0);
                    e = Math.floor(e / 2);
                }
                bits.push(s ? 1 : 0);
                bits.reverse();
                var str = bits.join('');

                // Bits to bytes
                var bytes = [];
                while (str.length) {
                    bytes.push(parseInt(str.substring(0, 8), 2));
                    str = str.substring(8);
                }
                return bytes;
            },
            fromIEEE754: function(bytes, ebits, fbits) {

                // Bytes to bits
                var bits = [];
                for (var i = bytes.length; i; i -= 1) {
                    var byte_i = bytes[i - 1];
                    for (var j = 8; j; j -= 1) {
                        bits.push(byte_i % 2 ? 1 : 0);
                        byte_i = byte_i >> 1;
                    }
                }
                bits.reverse();
                var str = bits.join('');

                // Unpack sign, exponent, fraction
                var bias = (1 << (ebits - 1)) - 1;
                var s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
                var e = parseInt(str.substring(1, 1 + ebits), 2);
                var f = parseInt(str.substring(1 + ebits), 2);

                // Produce number
                if (e === (1 << ebits) - 1) {
                    return f !== 0 ? NaN : s * Infinity;
                }
                else if (e > 0) {
                    return s * Math.pow(2, e - bias) * (1 + f / Math.pow(2, fbits));
                }
                else if (f !== 0) {
                    return s * Math.pow(2, -(bias - 1)) * (f / Math.pow(2, fbits));
                }
                else {
                    return s * 0;
                }
            },
            strToByteArr: function(str) {
                var bytes = [];
                for(var i = 0; i < str.length; i++) { bytes.push(str.charCodeAt(i) & 0xFF); }
                return bytes;
            },
            byteArrToStr: function(bytes) {
                var str = [];
                for (var i = 0; i < bytes.length; i++) {str.push(String.fromCharCode(bytes[i] & 0xFF));}
                return str.join("");
            },
            fromIEEE754Double: function(b) { return this.fromIEEE754(this.strToByteArr(b), 11, 52); },
            toIEEE754Double: function(v) { return this.byteArrToStr(this.toIEEE754(v, 11, 52)); },
            fromIEEE754Single: function(b) { return this.fromIEEE754(this.strToByteArr(b),  8, 23); },
            toIEEE754Single: function(v) { return this.byteArrToStr(this.toIEEE754(v,  8, 23)); }
        };

        function parseFloatField(bytes) {
            switch (bytes.length) {
                case 4:
                    return crSdtField(solace.SDTFieldType.FLOATTYPE, IEEE754LIB.fromIEEE754Single(bytes));
                case 8:
                    return crSdtField(solace.SDTFieldType.DOUBLETYPE, IEEE754LIB.fromIEEE754Double(bytes));
                default:
                    return crSdtField(solace.SDTFieldType.UNKNOWN, bytes);
            }
        }

        // Function prototypes (defined later) to resolve circular dependency)
        var parseMapFn = null;
        var parseStreamFn = null;
        var encodeMapFn = null;
        var encodeStreamFn = null;

        // Parse the header part of an SDT field.
        // Returns [TYPE, DECLARED_LENGTH, VALUE_DATA_LENGTH, CONSUMED_BYTES]
        function parseFieldHeader(data, offset) {
            var pos = offset;
            var onebyte = solace.Convert.strToInt8(data.substr(pos, 1));
            var elemType = (onebyte & 0xFC) >> 2;
            var lenBytes = (onebyte & 0x03) + 1;
            pos++;
            var elemLen = autoDecodeVarLengthNumber(data.substr(pos, lenBytes));
            pos += lenBytes;
            var elemValLen = elemLen - (1 + lenBytes);
            return [elemType, elemLen, elemValLen, pos - offset];
        }

        // Parse single SDT element, returns SDTField
        function parseSingleElement(data, offset) {
            var fieldHeader = parseFieldHeader(data, offset);
            if (!fieldHeader) {
                return false;
            }

            var pos = offset + fieldHeader[3];

            // For use inside switch
            var numeric = 0;
            var elemValLen = fieldHeader[2];
            switch (fieldHeader[0]) {
                case smfDTypes.Null:
                    return crSdtField(solace.SDTFieldType.NULLTYPE, null);
                case smfDTypes.Boolean:
                    numeric = solace.Convert.strToInt8(data.substr(pos, 1));
                    return crSdtField(solace.SDTFieldType.BOOL, numeric !== 0);
                case smfDTypes.Integer:
                    return parseIntegerField(true, data.substr(pos, elemValLen));
                case smfDTypes.UnsignedInteger:
                    return parseIntegerField(false, data.substr(pos, elemValLen));
                case smfDTypes.Float:
                    return parseFloatField(data.substr(pos, elemValLen));
                case smfDTypes.Char:
                    numeric = solace.Convert.strToInt16(data.substr(pos, 2));
                    return crSdtField(solace.SDTFieldType.WCHAR, String.fromCharCode(numeric));
                case smfDTypes.ByteArray:
                    return crSdtField(solace.SDTFieldType.BYTEARRAY, data.substr(pos, elemValLen));
                case smfDTypes.String:
                    // best effort (we don't know the encoding)
                    // strip last byte (null-terminator)
                    return crSdtField(solace.SDTFieldType.STRING, data.substr(pos, elemValLen - 1));
                case smfDTypes.Destination:
                    var destType = solace.Convert.strToInt8(data.substr(pos, 1));
                    // Name is null-terminated so strip last byte.
                    // Type 0x00 is TOPIC. 0x01 is QUEUE, currently unsupported.
                    var destName = data.substr(pos + 1, elemValLen - 2);
                    return crSdtField(
                            solace.SDTFieldType.DESTINATION,
                            (destType === 0x00 ? new solace.Topic(destName) : null));
                case smfDTypes.SMFMessage:
                    return crSdtField(solace.SDTFieldType.UNKNOWN, data.substr(pos, elemValLen));
                case smfDTypes.Map:
                    return parseMapFn(data, pos, elemValLen);
                case smfDTypes.Stream:
                    return parseStreamFn(data, pos, elemValLen);
                default:
                    return crSdtField(solace.SDTFieldType.UNKNOWN, data.substr(pos, elemValLen));

            }
        }

        function encodeHeader(tag, valueLen) {
            // Tag in first 6 bits, then (lenbytes-1) in 2 bits
            var byte0 = (tag << 2) & 0xFF;
            var strSdtLen = null;

            if (tag === smfDTypes.Map || tag === smfDTypes.Stream) {
                // force 4 bytes
                strSdtLen = solace.Convert.int32ToStr(valueLen + 5);
                byte0 |= 3; // 4 length bytes
            } else if (valueLen + 2 <= 255) {
                strSdtLen = solace.Convert.int8ToStr(valueLen + 2);
                byte0 |= 0; // 1 length byte
            } else if (valueLen + 3 <= 65535) {
                strSdtLen = solace.Convert.int16ToStr(valueLen + 3);
                byte0 |= 1; // 2 length bytes
            } else {
                strSdtLen = solace.Convert.int32ToStr(valueLen + 5);
                byte0 |= 3; // 4 length bytes
            }
            var ret = solace.Convert.int8ToStr(byte0) + strSdtLen;
            return ret;
        }

        // Encode an SDTField into provided buffer buf
        function encodeSingleElementToBuf(sdtfield, buf) {
            if (! (sdtfield instanceof solace.SDTField)) {
                return false;
            }
            // we write the header at the end, once we know the size
            var field_val = null;
            var value = sdtfield.getValue();
            var tag = 0; // SMF TAG
            var numeric = 0;
            switch (sdtfield.getType()) {
                case solace.SDTFieldType.BOOL:
                    tag = smfDTypes.Boolean;
                    field_val = solace.Convert.int8ToStr(value ? 1 : 0);
                    break;
                case solace.SDTFieldType.UINT8:
                    tag = smfDTypes.UnsignedInteger;
                    field_val = solace.Convert.int8ToStr(value);
                    break;
                case solace.SDTFieldType.INT8:
                    tag = smfDTypes.Integer;
                    field_val = solace.Convert.int8ToStr(value);
                    break;
                case solace.SDTFieldType.UINT16:
                    tag = smfDTypes.UnsignedInteger;
                    field_val = solace.Convert.int16ToStr(value);
                    break;
                case solace.SDTFieldType.INT16:
                    tag = smfDTypes.Integer;
                    field_val = solace.Convert.int16ToStr(value);
                    break;
                case solace.SDTFieldType.UINT32:
                    tag = smfDTypes.UnsignedInteger;
                    field_val = solace.Convert.int32ToStr(value);
                    break;
                case solace.SDTFieldType.INT32:
                    tag = smfDTypes.Integer;
                    field_val = solace.Convert.int32ToStr(value);
                    break;
                case solace.SDTFieldType.UINT64:
                    tag = smfDTypes.UnsignedInteger;
                    field_val = String.fromCharCode(0) + String.fromCharCode(0) + int48ToStr(value);
                    break;
                case solace.SDTFieldType.INT64:
                    tag = smfDTypes.Integer;
                    if (value >= 0) {
                        field_val = String.fromCharCode(0) + String.fromCharCode(0) + int48ToStr(value);
                    } else {
                        var two_c = Math.pow(2, 48) + value;
                        field_val = String.fromCharCode(0xFF) + String.fromCharCode(0xFF) + int48ToStr(two_c);
                    }
                    break;
                case solace.SDTFieldType.WCHAR:
                    tag = smfDTypes.Char;
                    numeric = value.charCodeAt(0);
                    field_val = solace.Convert.int16ToStr(numeric);
                    break;
                case solace.SDTFieldType.STRING:
                    tag = smfDTypes.String;
                    field_val = solace.Util.nullTerminate(value);
                    break;
                case solace.SDTFieldType.BYTEARRAY:
                    tag = smfDTypes.ByteArray;
                    field_val = value;
                    break;
                case solace.SDTFieldType.FLOATTYPE:
                    tag = smfDTypes.Float;
                    field_val = IEEE754LIB.toIEEE754Single(value);
                    break;
                case solace.SDTFieldType.DOUBLETYPE:
                    tag = smfDTypes.Float;
                    field_val = IEEE754LIB.toIEEE754Double(value);
                    break;
                case solace.SDTFieldType.MAP:
                    tag = smfDTypes.Map;
                    field_val = encodeMapFn(value);
                    break;
                case solace.SDTFieldType.STREAM:
                    tag = smfDTypes.Stream;
                    field_val = encodeStreamFn(value);
                    break;
                case solace.SDTFieldType.DESTINATION:
                    tag = smfDTypes.Destination;
                    if (value instanceof solace.Topic) {
                        field_val = solace.Convert.int8ToStr(0x00);
                        field_val += solace.Util.nullTerminate(value.getName());
                    }
                    break;
                case solace.SDTFieldType.NULLTYPE:
                    tag = smfDTypes.Null;
                    field_val = "";
                    break;
                case solace.SDTFieldType.UNKNOWN:
                    field_val = null;
                    break;
            }
            if (field_val !== null) {
                var hdr = encodeHeader(tag, field_val.length);
                buf.push(hdr);
                buf.push(field_val);
            }
        }

        function encodeSingleElement(sdtfield) {
            var buf = [];
            encodeSingleElementToBuf(sdtfield, buf);
            return buf.join("");
        }

        // encodes and returns a map value (string of mapentries)
        function encodeMap(sdtmap) {
            var buf = [];
            if (! (sdtmap instanceof solace.SDTMapContainer)) {
                return null; // skip!
            }
            var keys = sdtmap.getKeys();
            var sdtfield = null;
            var strKeyField = null;
            var strKeyName = null;
            for (var i = 0; i < keys.length; i++) {
                sdtfield = sdtmap.getField(keys[i]);
                if (sdtfield) {
                    // === KEY ===
                    strKeyName = solace.Util.nullTerminate(keys[i]);
                    strKeyField = encodeHeader(smfDTypes.String, strKeyName.length);
                    strKeyField += strKeyName;
                    buf.push(strKeyField);

                    // === VALUE ===
                    encodeSingleElementToBuf(sdtfield, buf);
                }
            } // end iter over keys
            return buf.join("");
        }
        encodeMapFn = encodeMap;

        function encodeStream(sdtstream) {
            var buf = [];
            if (! (sdtstream instanceof solace.SDTStreamContainer)) {
                return null; // skip!
            }
            var sdtfield = null;
            while(sdtstream.hasNext()) {
                sdtfield = sdtstream.getNext();
                if (sdtfield) {
                    encodeSingleElementToBuf(sdtfield, buf);
                }
            } // end iter over stream entries
            return buf.join("");
        }
        encodeStreamFn = encodeStream;

        function parseMapAt(data, offset, datalen) {
            var pos = offset;
            var mapObj = new solace.SDTMapContainer();
            while( pos < offset + datalen ) {
                // === key field ===
                var keyFieldHeader = parseFieldHeader(data, pos);
                pos += keyFieldHeader[3]; // consumed bytes
                // pos now points to start of string
                if (keyFieldHeader[0] !== smfDTypes.String) {
                    // Fail!
                    SOLACE_CONSOLE_ERROR("Error parsing SDTMAP, expected to find a string field as map key, and didn't");
                    return crSdtField(solace.SDTFieldType.MAP,  null);
                }
                var keyString = data.substr(pos, keyFieldHeader[2]-1);
                pos += keyFieldHeader[2];

                // === value field ===
                // pos now points to start of next value
                var valueField_header = parseFieldHeader(data, pos);
                var valueField = parseSingleElement(data, pos);
                pos += valueField_header[1]; // declared field length
                mapObj.addField(keyString, valueField);
            }
            return crSdtField(solace.SDTFieldType.MAP, mapObj);
        }
        parseMapFn = parseMapAt;

        function parseStreamAt(data, offset, datalen) {
            var streamObj = new solace.SDTStreamContainer();
            var pos = offset;
            while (pos < offset + datalen) {
                var valueField_header = parseFieldHeader(data, pos);
                var valueField = parseSingleElement(data, pos);
                pos += valueField_header[1]; // declared field length
                if (valueField) {
                    streamObj.addField(valueField);
                }
            }
            return crSdtField(solace.SDTFieldType.STREAM, streamObj);
        }
        parseStreamFn = parseStreamAt;

        return {
            parseSdt: parseSingleElement,
            encodeSdt: encodeSingleElement,
            IEEE754LIB: IEEE754LIB
        };
    }());

}(solace));

//
/*global solace:true window console BlobBuilder ArrayBuffer Uint8Array SOLACE_FATAL SOLACE_ERROR SOLACE_WARN SOLACE_INFO SOLACE_DEBUG SOLACE_TRACE SOLACE_CONSOLE_FATAL SOLACE_CONSOLE_ERROR SOLACE_CONSOLE_WARN SOLACE_CONSOLE_INFO SOLACE_CONSOLE_DEBUG SOLACE_CONSOLE_TRACE */
// 
// 
//
//

(function(solace) {

    // shortcuts to static or singleton class
    var ErrorSubcode = solace.ErrorSubcode;
    var SessionEventCode = solace.SessionEventCode;
    var TransportSessionEventCode = solace.TransportSessionEventCode;
    var GlobalContext = solace.GlobalContext;
    var P2PUtil = solace.P2PUtil;
    var TopicUtil = solace.TopicUtil;
    var StringUtil = solace.StringUtil;
    var Util = solace.Util;
    var StatType = solace.StatType;
    var MutableSessionProperty = solace.MutableSessionProperty;
    var SessionState = solace.SessionState;

    var SolClientRequestPrefix = "#REQ";
    var CacheRequestPrefix = "#CRQ";
    
    /**
     * @class
     * Represents a Client Session.
     * <p>
     * <strong>Note: </strong>To create an instance of solace.Session, applications should use {@link solace.SolclientFactory.createSession} and avoid
     * using the solace.Session constructor.
     * </p>
     * @param {solace.SessionProperties} sessionProperties Properties to use for constructing the session.
     * @param {solace.MessageRxCBInfo} messageCallbackInfo
     * @param {solace.SessionEventCBInfo} eventCallbackInfo
     *
     * @constructor
     * @throws {solace.OperationError} if the parameters have an invalid type or value. Subcode: {@link solace.ErrorSubcode.PARAMETER_INVALID_TYPE}.
     */
    solace.Session = function Session(sessionProperties, messageCallbackInfo, eventCallbackInfo) {
        // Must assert that the following arguments are not null
        if (!sessionProperties) {
            throw new solace.OperationError("Session properties cannot be null",
                    ErrorSubcode.PARAMETER_OUT_OF_RANGE);
        }
        sessionProperties.sol_validate();

        this.m_sessionProperties = sessionProperties.clone();

        if (!(messageCallbackInfo instanceof solace.MessageRxCBInfo)) {
            throw new solace.OperationError("Invalid parameter type for messageCallbackInfo", ErrorSubcode.PARAMETER_INVALID_TYPE);
        }
        if (!(eventCallbackInfo instanceof solace.SessionEventCBInfo)) {
             throw new solace.OperationError("Invalid parameter type for eventCallbackInfo", ErrorSubcode.PARAMETER_INVALID_TYPE);
        }

        // Callbacks to client application
        this.m_messageCallbackInfo = messageCallbackInfo;
        this.m_eventCallbackInfo = eventCallbackInfo;

        // client name generation is applicable
        if (!(StringUtil.notEmpty(this.m_sessionProperties.clientName))) {
            // Auto-gen clientName
            this.m_sessionProperties.clientName = solace.GlobalContext.GenerateClientName();
        }

        this.m_sessionState = 0;
        this.m_sessionStatistics = new solace.SessionStatistics();

        /**
         * The following fields are destroyed when disconnect is called
         * and recreated when connect is called again.
         * @private
         */
        this.m_sessionId = null;
        // Need to reschedule keepAliveTimer when some other write operation happens
        this.m_keepAliveTimer = null;
        this.m_keepAliveCounter = 0;
        this.m_outstandingCtrlReqs = {};
        this.m_outstandingDataReqs = {};

        this.m_newSession = true;
        this.m_inReconnect = false;
        this.m_disposed = false;

        this.m_smfClient = null;
        this.m_kaStats = {lastMsgWritten: 0, lastBytesWritten: 0};
        this.m_capabilities = null;
        /**
         * The following fields are destroyed when dispose is called
         * and cannot be reinitialized.
         * @private
         */
        this.m_subscriptionCache = null;
        this.m_subscriptionCacheKeys = null;
        this.m_subscriptionCacheCount = 0;
        if (this.m_sessionProperties.reapplySubscriptions) {
            this.m_subscriptionCache = {};
        }
        this.m_seqNum = 1;
    };

    /**
     * Connects the session to the router given the
     * {@link solace.SessionProperties#url}.
     * <p>
     * If the call is successful, an event is generated on the session event callback
     * stating that the session's state is changing to connecting and then connected.
     * <p>
     * If {@link solace.SessionProperties#reapplySubscriptions} is set to true,
     * this operation re-registers previously registered subscriptions.
     * The connected session event ({@link solace.SessionEventCode.UP_NOTICE}) is generated only
     * when all the subscriptions are successfully added to the router.
     * <p>
     * If the SDK is unable to connect within {@link solace.SessionProperties#connectTimeoutInMsecs}
	 * or due to login failures, the session's state transitions back to 'disconnected'
     * and an event is generated.
     * <p>
     * <strong>Note:</strong> Before the session's state transitions to 'connected',
     * a client application cannot use the session; any attempt to
     * call functions will throw {@link solace.OperationError}.
     * 
     *
     * @throws {solace.OperationError} if the session is disposed, already connected or connecting. Subcode: {@link solace.ErrorSubcode.INVALID_SESSION_OPERATION}.
     * @throws {solace.OperationError} if the underlying transport cannot be established. Subcode: {@link solace.ErrorSubcode.INTERNAL_CONNECTION_ERROR}.
     */
    solace.Session.prototype.connect = function() {
        var result = this.allowOperation(0);
        if (result) {
            throw new solace.OperationError(result, ErrorSubcode.INVALID_SESSION_OPERATION, null);
        }
        if (this.m_newSession) {
            this.m_newSession = false;
        }
        else {
            // cleanup in case connect has been previously called
            this.cleanupSession();
            this.m_inReconnect = true;
        }
        var myThis = this;

        SOLACE_CONSOLE_DEBUG("Creating transport session " + this.m_sessionProperties.url);
        this.m_kaStats = {lastMsgWritten: 0, lastBytesWritten: 0};
        this.m_smfClient = new solace.SMFClient(this.m_sessionProperties,
                function(rxData) {myThis.handleSmfMessage(rxData);},
                function(rxError) {myThis.handleSmfParseError(rxError);},
                function(transportEvent) {myThis.handleTransportEvent(transportEvent);},
                myThis
                );

        // change state
        this.changeState(2);

        // notify client
        var sessionEvent = new solace.SessionEvent(SessionEventCode.CONNECTING,
                "Establishing connection", null, null, null, null);
        this.sendEvent(sessionEvent);

        var returnCode = this.m_smfClient.connect();
        if (returnCode !== 0) {
            throw new solace.OperationError("Cannot establish transport session",
                    ErrorSubcode.INTERNAL_CONNECTION_ERROR, returnCode);
        }
    };

    /**
     * Disconnects the session.
     *
     * @throws {solace.OperationError} if the session is disposed, or has never been connected. Subcode: {@link solace.ErrorSubcode.INVALID_SESSION_OPERATION}.
     */
    solace.Session.prototype.disconnect = function() {
        var result = this.allowOperation(1);
        if (result) {
            throw new solace.OperationError(result, ErrorSubcode.INVALID_SESSION_OPERATION, null);
        }

        SOLACE_CONSOLE_INFO("Disconnecting session " + this.m_sessionId);
        if (this.m_sessionState !== 1 &&
                this.m_sessionState !== 10) {

            this.m_sessionState = 10;

        } else if (this.m_sessionState === 1) {
            // Already disconnected.
            // DO NOT send an event in this case, it can screw up session logic.
        }
        
        this.cleanupSession();
        this.destroyTransportSession();

    };

    /**
     * Release all resources associated with the session.
     */
    solace.Session.prototype.dispose = function() {
        try {
            if (this.m_disposed) {
                return;
            }
            SOLACE_CONSOLE_INFO("Release session resources");
            if (this.allowOperation(1) === null) {
                this.disconnect();
            }
            this.m_capabilities = null;
            if (this.m_sessionStatistics) {
                this.m_sessionStatistics.resetStats();
            }
            this.m_sessionStatistics = null;
            if (this.m_subscriptionCache) {
                SOLACE_CONSOLE_DEBUG("Clear subscription cache");
                for (var index in this.m_subscriptionCache) {
                    if (this.m_subscriptionCache.hasOwnProperty(index)) {
                        this.removeFromSubscriptionCache(index);
                    }
                }
            }
            this.m_subscriptionCache = null;
            this.clearSubscriptionCacheKeys();
            this.m_subscriptionCacheCount = 0;
            this.m_outstandingCtrlReqs = null;
            this.m_outstandingDataReqs = null;
            this.m_disposed = true;
        } catch (e) {
            // do nothing
        }
    };

    /**
     * Subscribe to a topic, optionally requesting a confirmation from the router.
     *
     * @param {solace.Topic} topic The topic subscription to add.
     * @param {boolean} requestConfirmation true, to request a confirmation; false
     * otherwise.
     * @param {Object} correlationKey If specified, this value is echoed in the
     * session event within {@link solace.SessionEvent}.
     * @param {number} requestTimeout The request timeout period (in milliseconds).	
     * If specified, this value overwrites readTimeoutInMsecs property
     * in {@link solace.SessionProperties}.
     *
     * @throws {solace.OperationError} if the session is disposed or disconnected. Subcode: {@link solace.ErrorSubcode.INVALID_SESSION_OPERATION}.
     * @throws {solace.OperationError} if the parameters have an invalid type. Subcode: {@link solace.ErrorSubcode.PARAMETER_INVALID_TYPE}.
     * @throws {solace.OperationError} if the parameters have an invalid value. Subcode: {@link solace.ErrorSubcode.PARAMETER_OUT_OF_RANGE}.
     * @throws {solace.OperationError} if the topic has invalid syntax. Subcode: {@link solace.ErrorSubcode.INVALID_TOPIC_SYNTAX}.
     * @throws {solace.OperationError} if there's no space in the transport to send the request. Subcode: {@link solace.ErrorSubcode.INSUFFICIENT_SPACE}.
     */
    solace.Session.prototype.subscribe = function(topic, requestConfirmation,
                                                  correlationKey, requestTimeout) {
        var result = this.allowOperation(4);
        if (result) {
            throw new solace.OperationError(result, ErrorSubcode.INVALID_SESSION_OPERATION, null);
        }
        if (!(topic instanceof solace.Topic)) {
            throw new solace.OperationError("Invalid parameter type for topic.", ErrorSubcode.PARAMETER_INVALID_TYPE);
        }
        result = TopicUtil.validateTopic(topic.getName());
        if (result) {
            throw new solace.OperationError(result, ErrorSubcode.INVALID_TOPIC_SYNTAX, null);
        }
        if (requestConfirmation !== undefined && requestConfirmation !== null && typeof requestConfirmation !== "boolean") {
             throw new solace.OperationError("Invalid parameter type for requestConfirmation.", ErrorSubcode.PARAMETER_INVALID_TYPE);
        }
        if (requestTimeout !== undefined && requestTimeout !== null) {
            if (typeof requestTimeout !== "number") {
                throw new solace.OperationError("Invalid parameter type for requestTimeout.", ErrorSubcode.PARAMETER_INVALID_TYPE);
            }
            else if (requestTimeout <= 0) {
                throw new solace.OperationError("Request timeout must be greater than 0.", ErrorSubcode.PARAMETER_OUT_OF_RANGE);
            }
        }

        var myThis = this;
        this.subscriptionUpdate(topic, requestConfirmation, correlationKey, requestTimeout,
                2,
                function (rxMsgObj, cancelledRequest) {myThis.handleSubscriptionUpdateResponse(rxMsgObj, cancelledRequest);});
    };

    /**
     * Unsubscribe from a topic, and optionally request a confirmation from the router.
     *
     * @param {solace.Topic} topic The topic subscription to remove.
     * @param {boolean} requestConfirmation true, to request a confirmation; false
     * otherwise.
     * @param {Object} correlationKey If <code>null</code> or undefined, a
     * Correlation Key is not set in the confirmation session event.
     * @param {number} requestTimeout The request timeout period (in milliseconds). 
	 * If specified, this value overwrites readTimeoutInMsecs
     * property in {@link solace.SessionProperties}.
     *
     * @throws {solace.OperationError} if the session is disposed or disconnected. Subcode: {@link solace.ErrorSubcode.INVALID_SESSION_OPERATION}.
     * @throws {solace.OperationError} if the parameters have an invalid type. Subcode: {@link solace.ErrorSubcode.PARAMETER_INVALID_TYPE}.
     * @throws {solace.OperationError} if the parameters have an invalid value. Subcode: {@link solace.ErrorSubcode.PARAMETER_OUT_OF_RANGE}.
     * @throws {solace.OperationError} if the topic has invalid syntax. Subcode: {@link solace.ErrorSubcode.INVALID_TOPIC_SYNTAX}.
     * @throws {solace.OperationError} if there's no space in the transport to send the request. Subcode: {@link solace.ErrorSubcode.INSUFFICIENT_SPACE}.
     */
    solace.Session.prototype.unsubscribe = function(topic, requestConfirmation,
                                                    correlationKey, requestTimeout) {
        var result = this.allowOperation(4);
        if (result) {
            throw new solace.OperationError(result, ErrorSubcode.INVALID_SESSION_OPERATION, null);
        }
        if (!(topic instanceof solace.Topic)) {
            throw new solace.OperationError("Invalid parameter type for topic.", ErrorSubcode.PARAMETER_INVALID_TYPE);
        }
        result = TopicUtil.validateTopic(topic.getName());
        if (result) {
            throw new solace.OperationError(result, ErrorSubcode.INVALID_TOPIC_SYNTAX, null);
        }
        if (requestConfirmation !== undefined && requestConfirmation !== null && typeof requestConfirmation !== "boolean") {
             throw new solace.OperationError("Invalid parameter type for requestConfirmation.", ErrorSubcode.PARAMETER_INVALID_TYPE);
        }
        if (requestTimeout !== undefined && requestTimeout !== null) {
            if (typeof requestTimeout !== "number") {
                throw new solace.OperationError("Invalid parameter type for requestTimeout", ErrorSubcode.PARAMETER_INVALID_TYPE);
            }
            else if (requestTimeout <= 0) {
                throw new solace.OperationError("Request timeout must be greater than 0.", ErrorSubcode.PARAMETER_OUT_OF_RANGE);
            }
        }
        var myThis = this;
        this.subscriptionUpdate(topic, requestConfirmation, correlationKey, requestTimeout,
                3,
                function (rxMsgObj, cancelledRequest) {myThis.handleSubscriptionUpdateResponse(rxMsgObj, cancelledRequest);});
    };

    /**
     * Modify a session property after creation of the session.
     *
     * @param {solace.MutableSessionProperty} mutableSessionProperty The property key to modify.
     * @param {Object} newValue The new property value.
     * @param {number} requestTimeout The request timeout period (in milliseconds). 
	 * If specified, it overwrites readTimeoutInMsecs
     * @param {Object} correlationKey If specified, this value is echoed in the
     * session event within {@link solace.SessionEvent} property
     * in {@link solace.SessionProperties}
     *
     * @throws {solace.OperationError} if the session is disposed or disconnected. Subcode: {@link solace.ErrorSubcode.INVALID_SESSION_OPERATION}.
     * @throws {solace.OperationError} if the parameters have an invalid type. Subcode: {@link solace.ErrorSubcode.PARAMETER_INVALID_TYPE}.
     * @throws {solace.OperationError} if the parameters have an invalid value. Subcode: {@link solace.ErrorSubcode.PARAMETER_OUT_OF_RANGE}.
     * @throws {solace.OperationError} if there's no space in the transport to send the request. Subcode: {@link solace.ErrorSubcode.INSUFFICIENT_SPACE}.
     */
    solace.Session.prototype.updateProperty = function(mutableSessionProperty,
                                                       newValue,
                                                       requestTimeout,
                                                       correlationKey) {
        SOLACE_CONSOLE_DEBUG("=====>updateProperty");
        var result = this.allowOperation(4);
        if (result) {
            throw new solace.OperationError(result, ErrorSubcode.INVALID_SESSION_OPERATION, null);
        }
        var valid = false;
        for (var index in MutableSessionProperty) {
            if (MutableSessionProperty.hasOwnProperty(index)) {
                if (MutableSessionProperty[index] === mutableSessionProperty) {
                    valid = true;
                }
            }
        }
        if (!valid) {
             throw new solace.OperationError("Invalid parameter value for mutableSessionProperty.", ErrorSubcode.PARAMETER_OUT_OF_RANGE);
        }
        if (requestTimeout !== undefined && requestTimeout !== null) {
            if (typeof requestTimeout !== "number") {
                throw new solace.OperationError("Invalid parameter type for requestTimeout.", ErrorSubcode.PARAMETER_INVALID_TYPE);
            }
            else if (requestTimeout <= 0) {
                throw new solace.OperationError("Request timeout must be greater than 0.", ErrorSubcode.PARAMETER_OUT_OF_RANGE);
            }
        }        

        var req_types = [];
        req_types[MutableSessionProperty.CLIENT_DESCRIPTION] = 6;
        req_types[MutableSessionProperty.CLIENT_NAME] = 5;

        var correlationTag = this.m_smfClient.nextCorrelationTag();
        var cc = solace.smf.ClientCtrlMessage.getUpdate(
                mutableSessionProperty, newValue, correlationTag);

        var myThis = this;
        var sessionEvent;
        var PROPERTY_UPDATE_OK = SessionEventCode.PROPERTY_UPDATE_OK;
        var PROPERTY_UPDATE_ERROR = SessionEventCode.PROPERTY_UPDATE_ERROR;

        var returnCode = this.m_smfClient.send(cc);
        if (returnCode !== 0) {
            // change session state
            this.changeState(9);

            if (returnCode === 2) {
                sessionEvent = new solace.SessionEvent(PROPERTY_UPDATE_ERROR,
                    "Property update failed - no space in transport",
                    null, ErrorSubcode.INSUFFICIENT_SPACE, null, null);
            } else {
                sessionEvent = new solace.SessionEvent(PROPERTY_UPDATE_ERROR,
                    "Property update failed",
                    null, ErrorSubcode.INVALID_SESSION_OPERATION, null, null);
            }
            this.sendEvent(sessionEvent);
        } else {
            this.updateTxStats(cc);
            /*
             Response CB to the CLIENTCTRL UPDATE response

             This is pretty complicated: the reason we need to define the whole logical process in here using
             callbacks is that it's a way to preserve state such as the correlationKey of the user request.
             That is, this entire multi-step process executes under the context of that one call to updateProperty
             with a single correlationKey value.
             */
            var response_cb = function(respMsg) {
                var response = respMsg.getResponse();
                if (response.ResponseCode === 200) {
                    if (mutableSessionProperty === MutableSessionProperty.CLIENT_DESCRIPTION) {
                        // update property and notify client
                        myThis.m_sessionProperties.applicationDescription = newValue;
                        sessionEvent = new solace.SessionEvent(PROPERTY_UPDATE_OK,
                                response.ResponseString, response.ResponseCode, 0, correlationKey, null);
                        myThis.sendEvent(sessionEvent);
                    } else if (mutableSessionProperty === MutableSessionProperty.CLIENT_NAME) {
                        // replace P2P subscription: REM and ADD
                        var oldP2pTopic = P2PUtil.getP2PTopicSubscription(myThis.m_sessionProperties.p2pInboxBase);
                        var newP2pTopic = P2PUtil.getP2PTopicSubscription(respMsg.getP2PTopicValue());

                        var cb_after_add = function(smpResp) {
                            var resp = smpResp.getResponse();
                            if (resp.ResponseCode === 200) {
                                // notify client
                                myThis.m_sessionProperties.p2pInboxBase = respMsg.getP2PTopicValue()||"";
                                myThis.m_sessionProperties.p2pInboxInUse = P2PUtil.getP2PInboxTopic(myThis.m_sessionProperties.p2pInboxBase);
                                myThis.m_sessionProperties.clientName = newValue;
                                sessionEvent = new solace.SessionEvent(PROPERTY_UPDATE_OK,
                                resp.ResponseString, resp.ResponseCode, 0, correlationKey, null);
                                myThis.sendEvent(sessionEvent);
                            }
                            else {
                                var errorSubCode = solace.ErrorResponseSubCodeMapper.getErrorSubCode(resp.ResponseCode, resp.ResponseString);
                                if (errorSubCode === ErrorSubcode.SUBSCRIPTION_ALREADY_PRESENT &&
                                        myThis.m_sessionProperties.ignoreDuplicateSubscriptionError) {
                                    // notify client
                                    sessionEvent = new solace.SessionEvent(PROPERTY_UPDATE_OK,
                                    resp.ResponseString, resp.ResponseCode, 0, correlationKey, null);
                                    myThis.sendEvent(sessionEvent);
                                }
                                else if (errorSubCode === ErrorSubcode.SUBSCRIPTION_ALREADY_PRESENT ||
                                        errorSubCode === ErrorSubcode.SUBSCRIPTION_ATTRIBUTES_CONFLICT ||
                                        errorSubCode === ErrorSubcode.SUBSCRIPTION_INVALID ||
                                        errorSubCode === ErrorSubcode.SUBSCRIPTION_ACL_DENIED ||
                                        errorSubCode === ErrorSubcode.SUBSCRIPTION_TOO_MANY) {
                                    // notify client
                                    sessionEvent = new solace.SessionEvent(PROPERTY_UPDATE_ERROR,
                                            resp.ResponseString, resp.ResponseCode, errorSubCode, correlationKey, null);
                                    myThis.sendEvent(sessionEvent);
                                }
                                else {
                                    // notify client
                                    sessionEvent = new solace.SessionEvent(PROPERTY_UPDATE_ERROR,
                                            resp.ResponseString, resp.ResponseCode, ErrorSubcode.SUBSCRIPTION_ERROR_OTHER,
                                            correlationKey, null);
                                    myThis.sendEvent(sessionEvent);
                                }
                            }
                        };

                        var cb_after_rem = function(smpResp) {
                            var resp = smpResp.getResponse();
                            if (resp.ResponseCode === 200) {
                                myThis.sendUpdateP2PInboxReg(true, newP2pTopic, correlationKey, cb_after_add);
                            }
                            else {
                                var errorSubCode = solace.ErrorResponseSubCodeMapper.getErrorSubCode(resp.ResponseCode, resp.ResponseString);
                                if (errorSubCode === ErrorSubcode.SUBSCRIPTION_NOT_FOUND &&
                                        myThis.m_sessionProperties.ignoreSubscriptionNotFoundError) {
                                    myThis.sendUpdateP2PInboxReg(true, newP2pTopic, correlationKey, cb_after_add);
                                }
                                else if (errorSubCode === ErrorSubcode.SUBSCRIPTION_ATTRIBUTES_CONFLICT ||
                                        errorSubCode === ErrorSubcode.SUBSCRIPTION_INVALID ||
                                        errorSubCode === ErrorSubcode.SUBSCRIPTION_NOT_FOUND ||
                                        errorSubCode === ErrorSubcode.SUBSCRIPTION_ACL_DENIED) {
                                    // notify client
                                    sessionEvent = new solace.SessionEvent(PROPERTY_UPDATE_ERROR,
                                            resp.ResponseString, resp.ResponseCode, errorSubCode, null, null);
                                    myThis.sendEvent(sessionEvent);
                                }
                                else {
                                    // notify client
                                    sessionEvent = new solace.SessionEvent(PROPERTY_UPDATE_ERROR,
                                            resp.ResponseString, resp.ResponseCode,
                                            ErrorSubcode.SUBSCRIPTION_ERROR_OTHER, null, null);
                                    myThis.sendEvent(sessionEvent);
                                }
                            }

                        };

                        // fire remove old P2P
                        myThis.sendUpdateP2PInboxReg(false, oldP2pTopic, correlationKey, cb_after_rem);
                    }
                } else {
                    // notify client error
                    var errorSubCode = solace.ErrorResponseSubCodeMapper.getErrorSubCode(response.ResponseCode, response.ResponseString);
                    sessionEvent = new solace.SessionEvent(PROPERTY_UPDATE_ERROR,
                            response.ResponseString, response.ResponseCode, errorSubCode, correlationKey, null);
                    myThis.sendEvent(sessionEvent);
                }
            }; // end CB (response to UPDATE request)
            this.enqueueOutstandingCtrlReq(correlationTag,
                    function() {
                        myThis.handleOperationTimeout(correlationTag, "Update request timeout");
                    },
                    requestTimeout || this.m_sessionProperties.readTimeoutInMsecs,
                    req_types[mutableSessionProperty] || 0,
                    correlationKey,
                    response_cb);
        }
    };

    /**
     * Publish (send) a message over the session. The message is sent to its set destination.
     *
     * @param {solace.Message} message The message to send. It must have a destination set.
     * 
     * @throws {solace.OperationError} if the session is disposed or disconnected. Subcode: {@link solace.ErrorSubcode.INVALID_SESSION_OPERATION}.
     * @throws {solace.OperationError} if the parameters have an invalid type. Subcode: {@link solace.ErrorSubcode.PARAMETER_INVALID_TYPE}.
     * @throws {solace.OperationError} if the message does not have a topic. Subcode: {@link solace.ErrorSubcode.TOPIC_MISSING}.
     * @throws {solace.OperationError} if there's no space in the transport to send the request. Subcode: {@link solace.ErrorSubcode.INSUFFICIENT_SPACE}.
     */
    solace.Session.prototype.send = function(message) {
        var result = this.allowOperation(5);
        if (result) {
            throw new solace.OperationError(result, ErrorSubcode.INVALID_SESSION_OPERATION, null);
        }
        if (!(message instanceof solace.Message)) {
            throw new solace.OperationError("Invalid parameter type for message", ErrorSubcode.PARAMETER_INVALID_TYPE);
        }

        this.handleSendMessage(message);
    };

    /**
     * Sends a request using user-specified callback functions.
     * <br>
     * <strong>Note:</strong>
     * The SDK sets the correlationId and replyTo fields of the message being sent;
     * this overwrites any existing correlationId and replyTo values on the message.
     *
     * @param {solace.Message} message The request message to send.
     * @param {number} timeout The timeout value (in milliseconds). The minimum value is 100 msecs.
     * @param {function(solace.Session, solace.Message, Object, Object)} replyReceivedCBFunction The prototype of this function
     * is: ({@link solace.Session}, {@link solace.Message},
     * userObject {Object}, RFUObject {Object})
     * @param {function(solace.Session, solace.SessionEvent, Object, Object)} requestFailedCBFunction 
	 * The prototype of this function is: ({@link solace.Session}, {@link solace.SessionEvent},
     * userObject {Object}, RFUObject {Object})
     * @param {Object} userObject An optional correlation object to use in the response callback.
     * 
     * @throws {solace.OperationError} if the session is disposed or disconnected. Subcode: {@link solace.ErrorSubcode.INVALID_SESSION_OPERATION}.
     * @throws {solace.OperationError} if the parameters have an invalid type. Subcode: {@link solace.ErrorSubcode.PARAMETER_INVALID_TYPE}.
     * @throws {solace.OperationError} if the parameters have an invalid value. Subcode: {@link solace.ErrorSubcode.PARAMETER_OUT_OF_RANGE}.
     * @throws {solace.OperationError} if the message does not have a topic. Subcode: {@link solace.ErrorSubcode.TOPIC_MISSING}.
     * @throws {solace.OperationError} if there's no space in the transport to send the request. Subcode: {@link solace.ErrorSubcode.INSUFFICIENT_SPACE}.
     */
    solace.Session.prototype.sendRequest = function(message, timeout, replyReceivedCBFunction,
           requestFailedCBFunction, userObject) {
        var result = this.allowOperation(5);
        if (result) {
            throw new solace.OperationError(result, ErrorSubcode.INVALID_SESSION_OPERATION, null);
        }
        if (!(message instanceof solace.Message)) {
            throw new solace.OperationError("Invalid parameter type for message.", ErrorSubcode.PARAMETER_INVALID_TYPE);
        }
        if (timeout !== undefined && timeout !== null) {
            Util.checkParamTypeOf(timeout, "number", "timeout");
            if (timeout < 100) {
                throw new solace.OperationError("Request timeout must be greater than or equal to 100.", ErrorSubcode.PARAMETER_OUT_OF_RANGE);
            }
        }
        if (replyReceivedCBFunction === undefined || replyReceivedCBFunction === null || typeof replyReceivedCBFunction !== "function") {
            throw new solace.OperationError("Invalid parameter type for replyReceivedCBFunction.", ErrorSubcode.PARAMETER_INVALID_TYPE);
        }
        if (requestFailedCBFunction === undefined || requestFailedCBFunction === null || typeof requestFailedCBFunction !== "function") {
            throw new solace.OperationError("Invalid parameter type for requestFailedCBFunction.", ErrorSubcode.PARAMETER_INVALID_TYPE);
        }

        // set correlationId and replyTo fields
        message.setCorrelationId(SolClientRequestPrefix + GlobalContext.NextId());
        var replyToTopic = solace.SolclientFactory.createTopic(this.m_sessionProperties.p2pInboxInUse);
        message.setReplyTo(replyToTopic);

        this.handleSendMessage(message);
        // update stats
        this.m_sessionStatistics.incStat(StatType.TX_REQUEST_SENT);
        // enqueue request
        this.enqueueOutstandingDataReq(message.getCorrelationId(), requestFailedCBFunction, timeout,
                replyReceivedCBFunction, userObject);

    };

    /**
     * Sends a reply message to the destination specified in messageToReplyTo.
     * <p>
     *
     * If <code>messageToReplyTo</code> is non-null, the following message properties
     * are copied to replyMessage:
     * <ul>
     *     <li>ReplyTo is copied to Destination, unless ReplyTo is null.
     *     <li>CorrelationId, unless it is null.
     * </ul>
     * <p>
     * If MessageToReplyTo is null, the application is responsible for setting
     * the Destination and CorrelationId on the replyMessage.
     * @param {solace.Message} messageToReplyTo The message to which a reply will be sent.
     * @param {solace.Message} replyMessage The reply to send.
     * 
     * @throws {solace.OperationError} if the session is disposed or disconnected. Subcode: {@link solace.ErrorSubcode.INVALID_SESSION_OPERATION}.
     * @throws {solace.OperationError} if the parameters have an invalid type. Subcode: {@link solace.ErrorSubcode.PARAMETER_INVALID_TYPE}.
     * @throws {solace.OperationError} if the parameters have an invalid value. Subcode: {@link solace.ErrorSubcode.PARAMETER_OUT_OF_RANGE}.
     * @throws {solace.OperationError} if the message does not have a topic. Subcode: {@link solace.ErrorSubcode.TOPIC_MISSING}.
     * @throws {solace.OperationError} if there's no space in the transport to send the request. Subcode: {@link solace.ErrorSubcode.INSUFFICIENT_SPACE}.
     */
    solace.Session.prototype.sendReply = function(messageToReplyTo, replyMessage) {
        var result = this.allowOperation(5);
        if (result) {
            throw new solace.OperationError(result, ErrorSubcode.INVALID_SESSION_OPERATION, null);
        }
        if (messageToReplyTo !== undefined && messageToReplyTo !== null && !(messageToReplyTo instanceof solace.Message)) {
            throw new solace.OperationError("Invalid parameter type for messageToReplyTo.", ErrorSubcode.PARAMETER_INVALID_TYPE);
        }
        if (!(replyMessage instanceof solace.Message)) {
             throw new solace.OperationError("Invalid parameter type for replyMessage.", ErrorSubcode.PARAMETER_INVALID_TYPE);
        }

        replyMessage.setAsReplyMessage(true);
        if (messageToReplyTo !== undefined && messageToReplyTo !== null) {
            replyMessage.setCorrelationId(messageToReplyTo.getCorrelationId());
            if (messageToReplyTo.getReplyTo() === null) {
                throw new solace.OperationError("ReplyTo destination may not be null.", ErrorSubcode.PARAMETER_OUT_OF_RANGE);
            }
            replyMessage.setDestination(messageToReplyTo.getReplyTo());
        }
        this.handleSendMessage(replyMessage);
    };

    /**
     * Returns the value of a given {@link solace.StatType}.
     * <br>
     * @param {solace.StatType} statType The statistic to query.
     * @return {number}
     *
     * @throws {solace.OperationError} if the session is disposed. Subcode: {@link solace.ErrorSubcode.INVALID_SESSION_OPERATION}.
     * @throws {solace.OperationError} if the StatType is invalid. Subcode: {@link solace.ErrorSubcode.PARAMETER_OUT_OF_RANGE}.
     */
    solace.Session.prototype.getStat = function(statType) {
        var result = this.allowOperation(7);
        if (result) {
            throw new solace.OperationError(result, ErrorSubcode.INVALID_SESSION_OPERATION, null);
        }
        var valid = false;
        for (var index in StatType) {
            if (StatType.hasOwnProperty(index)) {
                if (StatType[index] === statType) {
                    valid = true;
                }
            }
        }
        if (!valid) {
             throw new solace.OperationError("Invalid parameter value for statType.", ErrorSubcode.PARAMETER_OUT_OF_RANGE);
        }
        return this.m_sessionStatistics.getStat(statType);
    };

    /**
     * Reset session statistics to 0.
     * 
     * @throws {solace.OperationError} if the session is disposed. Subcode: {@link solace.ErrorSubcode.INVALID_SESSION_OPERATION}.
     */
    solace.Session.prototype.resetStats = function() {
        var result = this.allowOperation(7);
        if (result) {
            throw new solace.OperationError(result, ErrorSubcode.INVALID_SESSION_OPERATION, null);
        }
        this.m_sessionStatistics.resetStats();
    };

    /**
     * Returns a clone of the SessionProperties for this session.
     *
     * @return {solace.SessionProperties}
     * @throws {solace.OperationError} if the session is disposed. Subcode: {@link solace.ErrorSubcode.INVALID_SESSION_OPERATION}.
     */
    solace.Session.prototype.getSessionProperties = function() {
        var result = this.allowOperation(7);
        if (result) {
            throw new solace.OperationError(result, ErrorSubcode.INVALID_SESSION_OPERATION, null);
        }
        // need to add clone function for session properties
        return this.m_sessionProperties.clone();
    };    

    /**
     * Check the value of a boolean router capability.
     *
     * This function is a shortcut for <code>getCapability(...)</code>. It performs the same operation, only instead of
     * returning an <code>solace.SDTField</code> wrapping a capability value, it just returns the boolean value.
     * <p>
     * Attempting to query a non-boolean capability will return <code>null</code>.
     *
     * @param {solace.CapabilityType} capabilityType The capability to check.
     * @return {boolean} the value of the capability queried.
     * @throws {solace.OperationError} if the session is disposed. Subcode: {@link solace.ErrorSubcode.INVALID_SESSION_OPERATION}.
     * @throws {solace.OperationError} if the parameters have an invalid type or value. Subcode: {@link solace.ErrorSubcode.PARAMETER_INVALID_TYPE}.
     */
    solace.Session.prototype.isCapable = function(capabilityType) {
        var result = this.allowOperation(7);
        if (result) {
            throw new solace.OperationError(result, ErrorSubcode.INVALID_SESSION_OPERATION, null);
        }
        if (typeof capabilityType !== "number") {
            throw new solace.OperationError("Invalid parameter type for capabilityType.", ErrorSubcode.PARAMETER_INVALID_TYPE);
        }
        var caps = this.m_capabilities;
        if (!caps) {
            return false;
        }
        // Guard for undefined OR non-boolean capability
        return (typeof caps[capabilityType] === "boolean") ? caps[capabilityType] : false;
    };

    /**
     * Get the value of a router capability, or null if unknown. This function must 
	 * be called after connecting the session.
     * <br>
     * SDT Type conversions:
     * <ul>
     * <li>String values are returned as SDTFieldType.STRING.
     * <li>Boolean values are returned as SDTFieldType.BOOL.
     * <li>All numeric values are returned as SDTFieldType.INT64.
     * </ul>
     * @param {solace.CapabilityType} capabilityType
     * @return {solace.SDTField}
     * @throws {solace.OperationError} if the session is disposed. Subcode: {@link solace.ErrorSubcode.INVALID_SESSION_OPERATION}.
     * @throws {solace.OperationError} if the parameters have an invalid type or value. Subcode: {@link solace.ErrorSubcode.PARAMETER_INVALID_TYPE}.
     */
    solace.Session.prototype.getCapability = function(capabilityType) {
        var result = this.allowOperation(7);
        if (result) {
            throw new solace.OperationError(result, ErrorSubcode.INVALID_SESSION_OPERATION, null);
        }
        if (typeof capabilityType !== "number") {
            throw new solace.OperationError("Invalid parameter type for capabilityType", ErrorSubcode.PARAMETER_INVALID_TYPE);
        }

        var caps = this.m_capabilities;
        if (!caps || typeof caps[capabilityType] === "undefined") {
            return null;
        }

        var val = caps[capabilityType];
        if (typeof val === "boolean") {
            return solace.SDTField.create(solace.SDTFieldType.BOOL, val);
        } else if (typeof val === "number") {
            return solace.SDTField.create(solace.SDTFieldType.INT64, val);
        } else if (typeof val === "string") {
            return solace.SDTField.create(solace.SDTFieldType.STRING, val);
        } else {
            return null;
        }
    };

    /**
     * Returns the session's state.
     * 
     * @return {solace.SessionState}
     * @throws {solace.OperationError} if the session is disposed. Subcode: {@link solace.ErrorSubcode.INVALID_SESSION_OPERATION}.
     */
    solace.Session.prototype.getSessionState = function() {
        var result = this.allowOperation(7);
        if (result) {
            throw new solace.OperationError(result, ErrorSubcode.INVALID_SESSION_OPERATION, null);
        }
        switch (this.m_sessionState) {
            case 0:
                return SessionState.NEW;
            case 8:
                return SessionState.CONNECTED;
            case 10:
                return SessionState.DISCONNECTING;
            case 1:
                return SessionState.DISCONNECTED;
            case 9:
                return SessionState.SESSION_ERROR;
            default:
                return SessionState.CONNECTING;
        }
    };

    /**
     * @private
     * @param smfMessage
     */
    solace.Session.prototype.updateRxStats = function(smfMessage) {
        var smfHeader = smfMessage.getSmfHeader();
        if (smfHeader) {
            var msgLength = smfHeader.m_messageLength;
            switch (smfHeader.m_smf_protocol) {
                case 0x0d:
                    var respCode = smfHeader.m_pm_respcode;
                    if (respCode === 0) {
                        this.m_sessionStatistics.incStat(StatType.RX_TOTAL_DATA_MSGS);
                        this.m_sessionStatistics.incStat(StatType.RX_DIRECT_MSGS);
                        this.m_sessionStatistics.incStat(StatType.RX_TOTAL_DATA_BYTES, msgLength);
                        this.m_sessionStatistics.incStat(StatType.RX_DIRECT_BYTES, msgLength);
                        if (smfMessage.m_discardIndication) {
                            this.m_sessionStatistics.incStat(StatType.RX_DISCARD_MSG_INDICATION);
                        }
                    }
                    break;
                case 0x0c:
                case 0x0f:
                case 0x0a:
                case 0x0b:
                    this.m_sessionStatistics.incStat(StatType.RX_CONTROL_MSGS);
                    this.m_sessionStatistics.incStat(StatType.RX_CONTROL_BYTES, msgLength);
                    break;
            }
        }
    };

    /**
     * @private
     * @param smfMessage
     */
    solace.Session.prototype.updateTxStats = function(smfMessage) {
        var smfHeader = smfMessage.getSmfHeader();
        if (smfHeader) {
            var msgLength = smfHeader.m_messageLength;
            switch (smfHeader.m_smf_protocol) {
                case 0x0d:
                    this.m_sessionStatistics.incStat(StatType.TX_TOTAL_DATA_MSGS);
                    this.m_sessionStatistics.incStat(StatType.TX_DIRECT_MSGS);
                    this.m_sessionStatistics.incStat(StatType.TX_TOTAL_DATA_BYTES, msgLength);
                    this.m_sessionStatistics.incStat(StatType.TX_DIRECT_BYTES, msgLength);
                    break;
                case 0x0c:
                case 0x0f:
                case 0x0a:
                case 0x0b:
                    this.m_sessionStatistics.incStat(StatType.TX_CONTROL_MSGS);
                    this.m_sessionStatistics.incStat(StatType.TX_CONTROL_BYTES, msgLength);
                    break;
            }
        }
    };

    /**
     * @private
     * @param sessionEvent
     */
    solace.Session.prototype.sendEvent = function(sessionEvent) {
        if (sessionEvent) {
            if (this.m_eventCallbackInfo) {
                SOLACE_CONSOLE_DEBUG(sessionEvent);
                if (this.m_eventCallbackInfo.userObject) {
                    this.m_eventCallbackInfo.sessionEventCBFunction(this, sessionEvent,
                            this.m_eventCallbackInfo.userObject);
                }
                else {
                    this.m_eventCallbackInfo.sessionEventCBFunction(this, sessionEvent);
                }
            }
        }
    };

    /**
     * @private
     * @return false if session is already in unusable state, no need to notify client
     */
    solace.Session.prototype.shallNotifyClient = function() {
        return (this.m_sessionState !== 9 &&
            this.m_sessionState !== 10 &&
            this.m_sessionState !== 1);
    };

    /**
     * @private
     * @param newState
     */
    solace.Session.prototype.changeState = function(newState) {
      if (newState && this.m_sessionState !== newState) {
          var oldState = this.m_sessionState;
          if ((oldState === 10 || oldState === 1) &&
                  newState !== 1) {
              if (oldState === 1 && this.m_inReconnect &&
                      newState === 2) {
                  this.m_sessionState = newState;
                  SOLACE_CONSOLE_DEBUG("Session state is changed from " + solace.InternalSessionStateDescription[oldState] + " to " +
                    solace.InternalSessionStateDescription[newState]);
                  return;
              }
              else {
                  SOLACE_CONSOLE_DEBUG("Session state is " + solace.InternalSessionStateDescription[oldState] + ", no need to change to " +
                    solace.InternalSessionStateDescription[newState]);
                  return;
              }
          }
          this.m_sessionState = newState;
          SOLACE_CONSOLE_DEBUG("Session state is changed from " + solace.InternalSessionStateDescription[oldState] + " to " +
                  solace.InternalSessionStateDescription[newState]);
          if (newState === 9) {
              this.destroyTransportSession();
          }
      }
    };

    /**
     * @private
     * @param operationEnum the id of the operation
     * @return {?string} error message if not allowed; otherwise null
     */
    solace.Session.prototype.allowOperation = function (operationEnum) {
        var allow = true;
        if (this.m_disposed) {
            allow = false;
        }
        else {
            if (operationEnum !== undefined && operationEnum !== null) {
                switch (operationEnum) {
                    case 0:
                        if (this.m_sessionState !== 0 &&
                                this.m_sessionState !== 1) {
                            allow = false;
                        }
                        break;
                    case 1:
                        if (this.m_sessionState === 0) {
                            allow = false;
                        }
                        break;
                    case 2:
                        if (this.m_sessionState !== 3) {
                            allow = false;
                        }
                        break;
                    case 3:
                        if (this.m_sessionState !== 5) {
                            allow = false;
                        }
                        break;
                    case 4:
                        if (this.m_sessionState !== 8) {
                            allow = false;
                        }
                        break;
                    case 5:
                        if (this.m_sessionState !== 8) {
                            allow = false;
                        }
                        break;
                    case 6:
                        if (!(this.m_sessionProperties.reapplySubscriptions &&
                                this.m_sessionState === 7)) {
                            allow = false;
                        }
                        break;
                    case 7:
                        allow = true;
                        break;
                    default:
                        allow = false;
                }
            }
            else {
                allow = false;
            }
        }
        if (allow) {
            return null;
        }
        else {
           var errorMsg = new solace.StringBuffer("Cannot perform operation ");
           errorMsg.append(solace.SessionOperationDescription[operationEnum] || "");
           errorMsg.append(" while in state ").append(solace.InternalSessionStateDescription[this.m_sessionState]);
           errorMsg.append(this.m_disposed?"(already disposed)":"");
           return errorMsg.toString();
        }
    };

    /**
     * @private
     * @param {solace.smf.ClientCtrlMessage} clientCtrlRespMsg
     */
    solace.Session.prototype.updateReadonlySessionProps = function(clientCtrlRespMsg) {
        this.m_sessionProperties.vpnNameInUse = clientCtrlRespMsg.getVpnNameInUseValue() || "";
        var oldVirtualRouterName = this.m_sessionProperties.virtualRouterName;
        var newVirtualRouterName = clientCtrlRespMsg.getVridInUseValue() || "";
        this.m_sessionProperties.virtualRouterName = newVirtualRouterName;
        if (oldVirtualRouterName !== "" && oldVirtualRouterName !== newVirtualRouterName) {
            var sessionEvent = new solace.SessionEvent(SessionEventCode.VIRTUALROUTER_NAME_CHANGED,
                    "Virtual router name is changed from " + oldVirtualRouterName + " to " + newVirtualRouterName,
                    null, 0,  null, null);
            this.sendEvent(sessionEvent);
        }

        // The router login response should always contain a P2P topic for this client name.
        // If it doesn't that's an error (and we store "").
        this.m_sessionProperties.p2pInboxBase = clientCtrlRespMsg.getP2PTopicValue() || "";
        this.m_sessionProperties.p2pInboxInUse = P2PUtil.getP2PInboxTopic(this.m_sessionProperties.p2pInboxBase);
        this.m_capabilities = clientCtrlRespMsg.getRouterCapabilities();
    };

    /**
     * @private
     * @description This method is responsible for add/remove subscriptions
     * @param {solace.Topic} topic
     * @param requestConfirmation
     * @param correlationKey
     * @param requestTimeout
     * @param requestType
     * @param respRecvdCallback
     */
    solace.Session.prototype.subscriptionUpdate = function(topic, requestConfirmation,
            correlationKey, requestTimeout, requestType, respRecvdCallback) {
        var errorMsg;
        switch (requestType) {
            case 2:
            case 4:
                errorMsg = "Cannot add subscription";
                break;
            case 3:
                errorMsg = "Cannot remove subscription";
                break;
            case 1:
                errorMsg = "Cannot register P2P inbox subscripiton";
                break;
            case 7:
            case 8:
                errorMsg = "Cannot update P2P inbox subscription";
                break;
            default:
                errorMsg = "Subscription update failed";
        }
        var timeoutMsg;
        switch (requestType) {
            case 2:
            case 4:
                timeoutMsg = "Add subscription request timeout";
                break;
            case 3:
                timeoutMsg = "Remove subscription request timeout";
                break;
            case 7:
            case 1:
                timeoutMsg = "Add P2P inbox subscripiton timeout";
                break;
            case 8:
                timeoutMsg = "Remove P2P inbox subscription timeout";
                break;
            default:
                timeoutMsg = "Request timeout";
        }

        var add = (requestType === 2 ||
                requestType === 4 ||
                requestType === 1 ||
                requestType === 7);
        var correlationTag = this.m_smfClient.nextCorrelationTag();
        var smpMsg = solace.smf.SMPMessage.getSubscriptionMessage(
                correlationTag, topic, add, requestConfirmation);

        var myThis = this;
        var sessionEvent;
        var returnCode = this.m_smfClient.send(smpMsg);
        if (returnCode !== 0) {
            var errorSubcode;
            if (returnCode === 2) {
                errorSubcode = ErrorSubcode.INSUFFICIENT_SPACE;
                errorMsg += " - no space in transport";
            }
            else {
                errorSubcode = ErrorSubcode.INVALID_SESSION_OPERATION;
            }

            switch (requestType) {
                case 1:
                    sessionEvent = new solace.SessionEvent(SessionEventCode.P2P_SUB_ERROR,
                        errorMsg, null, errorSubcode, null, null);
                    break;
                case 7:
                case 8:
                    sessionEvent = new solace.SessionEvent(SessionEventCode.PROPERTY_UPDATE_ERROR,
                        errorMsg, null, errorSubcode, null, null);
                    break;
                default:
                    // client calling subscribe/unsubscribe/reapply subscription, should throw OperationError
                    throw new solace.OperationError(errorMsg, errorSubcode, returnCode);
            }

            // change session state
            this.changeState(9);
            // notify client
            this.sendEvent(sessionEvent);
        }
        else {
            this.updateTxStats(smpMsg);
            if (requestConfirmation) {
                 this.enqueueOutstandingCtrlReq(correlationTag,
                        function() {myThis.handleOperationTimeout(correlationTag, timeoutMsg);},
                        requestTimeout || this.m_sessionProperties.readTimeoutInMsecs,
                        requestType,
                        correlationKey,
                        respRecvdCallback);
            }
            if (requestType === 2 &&
                        this.m_sessionProperties.reapplySubscriptions) {
                    this.addToSubscriptionCache(topic);
            }
            else if (requestType === 3 &&
                    this.m_sessionProperties.reapplySubscriptions) {
                this.removeFromSubscriptionCache(topic);
            }
        }
    };

    /**
     * @private
     * @param message
     */
    solace.Session.prototype.handleSendMessage = function (message) {
       //Sanity checks on the message before attempting to send it
        //  * do we have a destination?
        var sendDest = message.getDestination();
        if (!(sendDest !== null && StringUtil.notEmpty(sendDest.getName()))) {
            throw new solace.OperationError("Message must have a valid Destination", ErrorSubcode.TOPIC_MISSING);
        }

        if (this.m_sessionProperties.generateSendTimestamps && message.getSenderTimestamp() === null) {
            var now = new Date();
            message.setSenderTimestamp(now.getTime());
        }
        if (this.m_sessionProperties.generateSequenceNumber && message.getSequenceNumber() === null) {
            message.setSequenceNumber(this.m_seqNum++);
        }
        if (this.m_sessionProperties.includeSenderId && message.getSenderId() === null) {
            message.setSenderId(this.m_sessionProperties.clientName);
        }
        
        var returnCode = this.m_smfClient.send(message);
        if (returnCode !== 0) {
            if (returnCode === 2) {
               throw new solace.OperationError("Cannot send message - no space in transport",
                        ErrorSubcode.INSUFFICIENT_SPACE, returnCode);
            }
            else {
                throw new solace.OperationError("Cannot send message",
                        ErrorSubcode.INVALID_SESSION_OPERATION, returnCode);
            }
        }
        else {
            this.updateTxStats(message);
        }
    };

    /**
     * @private
     * @param {string} correlationId
     * @param {function(...[*])} reqFailedCb
     * @param {number} reqTimeout
     * @param {function(*)} replyRecvdCb
     * @param {Object} userObject
     */
    solace.Session.prototype.enqueueOutstandingDataReq = function (correlationId, reqFailedCb, reqTimeout, replyRecvdCb, userObject) {
        if (correlationId !== undefined && correlationId !== null) {
            SOLACE_CONSOLE_DEBUG("Enqueue outstanding data request correlationId=" + correlationId);
            var outstandingReq;
            var timer;
            var myThis = this;
            timer = setTimeout(function() {
                    myThis.m_sessionStatistics.incStat(StatType.TX_REQUEST_TIMEOUT);
                    // remove request from queue
                    try {
                        if (!(delete myThis.m_outstandingDataReqs[correlationId])) {
                            SOLACE_CONSOLE_ERROR("Cannot delete data request " + correlationId);
                        }
                    } catch (e) {
                        SOLACE_CONSOLE_ERROR("Cannot delete data request " + correlationId + ", exception: " + e);
                    }

                    if (reqFailedCb !== undefined && reqFailedCb !== null) {
                        var sessionEvent = new solace.SessionEvent(
                                SessionEventCode.REQUEST_TIMEOUT, "Request timeout", null,
                                ErrorSubcode.TIMEOUT, null, null);

                        reqFailedCb(myThis, sessionEvent, userObject);
                    }
                },
                reqTimeout || this.m_sessionProperties.readTimeoutInMsecs);

            outstandingReq = new solace.OutstandingDataRequest(correlationId, timer, replyRecvdCb, reqFailedCb, userObject);
            this.m_outstandingDataReqs[correlationId] = outstandingReq;
        }
    };

    /**
     * @private
     * @param {string} correlationId
     * @return {solace.OutstandingDataRequest} request
     */
    solace.Session.prototype.cancelOutstandingDataReq = function(correlationId) {
        if (this.m_outstandingDataReqs && correlationId !== undefined && correlationId !== null) {
            var req = this.m_outstandingDataReqs[correlationId];
            if (req !== undefined) {
                SOLACE_CONSOLE_DEBUG("Cancel outstanding data request correlationId=" + correlationId);
                if (req.timer !== undefined && req.timer !== null) {
                    clearTimeout(req.timer);
                    req.timer = null;
                }
                try {
                    if (!(delete this.m_outstandingDataReqs[correlationId])) {
                        SOLACE_CONSOLE_ERROR("Cannot delete data request " + correlationId);
                    }
                } catch (e) {
                    SOLACE_CONSOLE_ERROR("Cannot delete data request " + correlationId + ", exception: " + e);
                }
                return req;
            }
        }
        return null;
    };

    /**
     * @private
     * @param {string} correlationTag
     * @param {function(*)} reqTimeoutCb
     * @param {number} reqTimeout
     * @param {number} requestType
     * @param {Object} correlationKey
     * @param {function(*)} respRecvCallback
     */
    solace.Session.prototype.enqueueOutstandingCtrlReq = function (correlationTag, reqTimeoutCb, reqTimeout, requestType, correlationKey, respRecvCallback) {
        if (correlationTag !== undefined && correlationTag !== null) {
            SOLACE_CONSOLE_DEBUG("Enqueue outstanding ctrl request correlationTag=" + correlationTag);
            var outstandingReq;
            var timer;
            timer = setTimeout(reqTimeoutCb,
                reqTimeout || this.m_sessionProperties.readTimeoutInMsecs);

            outstandingReq = new solace.OutstandingCtrlRequest(correlationTag, timer, requestType, correlationKey, respRecvCallback);
            this.m_outstandingCtrlReqs[correlationTag] = outstandingReq;
        }
    };

    /**
     * @private
     * @param {string} correlationTag
     * @return {solace.OutstandingCtrlRequest} request
     */
    solace.Session.prototype.cancelOutstandingCtrlReq = function(correlationTag) {
        if (this.m_outstandingCtrlReqs && correlationTag !== undefined && correlationTag !== null) {
            var req = this.m_outstandingCtrlReqs[correlationTag];
            if (req !== undefined) {
                SOLACE_CONSOLE_DEBUG("Cancel outstanding ctrl request correlationTag=" + correlationTag);
                if (req.timer !== undefined && req.timer !== null) {
                    clearTimeout(req.timer);
                    req.timer = null;
                }
                try {
                    if (!(delete this.m_outstandingCtrlReqs[correlationTag])) {
                        SOLACE_CONSOLE_ERROR("Cannot delete ctrl request " + correlationTag);
                    }
                } catch (e) {
                    SOLACE_CONSOLE_ERROR("Cannot delete ctrl request " + correlationTag + ", exception: " + e);
                }
                return req;
            }
        }
        return null;
    };

    /**
     * @private
     * @param {solace.Topic} topic
     */
    solace.Session.prototype.addToSubscriptionCache = function(topic) {
        if (this.m_subscriptionCache && typeof topic !== "undefined" && topic !== null) {
            var key = topic.getKey();
            if (typeof this.m_subscriptionCache[key] === "undefined") {
                SOLACE_CONSOLE_DEBUG("Cache subscription " + key);
                this.m_subscriptionCache[key] = topic;
                SOLACE_CONSOLE_DEBUG("Increment cache count");
                this.m_subscriptionCacheCount++;
            }
            else {
                SOLACE_CONSOLE_DEBUG("Cache subscription " + key);
                this.m_subscriptionCache[key] = topic;
            }
        }
    };

    /**
     * @private
     * @param {solace.Topic} topic
     */
    solace.Session.prototype.removeFromSubscriptionCache = function(topic) {
        if (this.m_subscriptionCache && typeof topic !== "undefined" && topic !== null) {
            var key;
            if (topic instanceof solace.Topic) {
                key = topic.getKey();
            }
            else {
                key = topic;
            }
            SOLACE_CONSOLE_DEBUG("Remove subscription " + key);
            var sub = this.m_subscriptionCache[key];
            if (typeof sub !== "undefined") {
                try {
                    if (!(delete this.m_subscriptionCache[key])) {
                        SOLACE_CONSOLE_ERROR("Cannot remove subscription " + key);
                    }
                    else {
                        this.m_subscriptionCacheCount--;
                    }
                } catch (e) {
                    SOLACE_CONSOLE_ERROR("Cannot remove subscription " + key + ", exception: " + e);
                }
                return sub;
            }
        }
        return null;
    };

    solace.Session.prototype.resetKeepAliveCounter = function() {
        // Reset the KA counter. Called by the SMFClient on each SMF chunk received (whether full message or not).
        this.m_keepAliveCounter = 0;
    };

    /**
     * @private
     */
    solace.Session.prototype.handleSmfMessage = function(rxMsgObj) {
         if (!this.shallNotifyClient()) {
            SOLACE_CONSOLE_WARN("Ignore data received on a session in state " + solace.InternalSessionStateDescription[this.m_sessionState]);
            return;
        }

        var sessionEvent;
        var errorSubcode;
        try {
            // update stats
            this.updateRxStats(rxMsgObj);

            // process rxMsgObj
            var smfRespHeader = rxMsgObj.getSmfHeader();
            var respCode = smfRespHeader.m_pm_respcode;
            var respText = smfRespHeader.m_pm_respstr;
            var cancelledRequest;

            switch (smfRespHeader.m_smf_protocol) {
                case 0x0d:
                    if (respCode !== 0) {
                        // It is trmsg response. For direct message, it must be a failure response
                         errorSubcode = solace.ErrorResponseSubCodeMapper.getErrorSubCode(respCode, respText);
                         sessionEvent = new solace.SessionEvent(SessionEventCode.REJECTED_MESSAGE_ERROR,
                                 respText, respCode, errorSubcode, null, null);
                         this.sendEvent(sessionEvent);
                    }
                    else {
                        this.handleDataMessage(rxMsgObj);
                    }
                    break;
                case 0x0c:
                    var correlationTag = smfRespHeader.m_pm_corrtag || "";

                    // find matching correlationTag to cancel timer
                    cancelledRequest = this.cancelOutstandingCtrlReq(correlationTag);
                    if (cancelledRequest === undefined || cancelledRequest === null) {
                        // change state
                        this.changeState(9);

                        // notify client
                        sessionEvent = new solace.SessionEvent(SessionEventCode.INTERNAL_ERROR,
                                "Cannot find matching request for response: " + respText, respCode,
                                ErrorSubcode.INTERNAL_ERROR, null, null);
                        this.sendEvent(sessionEvent);

                    } else {
                        // call callback referenced by cancelledRequest
                        // login or update property
                        if (cancelledRequest.respRecvdCallback) {
                            cancelledRequest.respRecvdCallback(rxMsgObj);
                        }
                    }
                    break;
                case 0x0f:
                    correlationTag = smfRespHeader.m_pm_corrtag || "";

                    // find matching correlationTag to cancel timer
                    cancelledRequest = this.cancelOutstandingCtrlReq(correlationTag);
                    if (this.m_sessionState === 6) {
                        if (cancelledRequest === undefined || cancelledRequest === null) {
                            // change state
                            this.changeState(9);

                            // notify client
                            sessionEvent = new solace.SessionEvent(SessionEventCode.INTERNAL_ERROR,
                                    "Cannot find matching request for response: " + respText, respCode,
                                    ErrorSubcode.INTERNAL_ERROR, null, null);
                            this.sendEvent(sessionEvent);
                        }
                        else {
                            // must be 1
                            // calling handleP2pInboxRegResponse
                            if (cancelledRequest.respRecvdCallback) {
                                cancelledRequest.respRecvdCallback(rxMsgObj);
                            }
                        }
                    }
                    else if (this.m_sessionState === 11) {
                        if (cancelledRequest === undefined || cancelledRequest === null) {
                            // must be error response for apply subscription requests without confirm
                            errorSubcode = solace.ErrorResponseSubCodeMapper.getErrorSubCode(respCode, respText);
                            if (!(errorSubcode === ErrorSubcode.SUBSCRIPTION_ALREADY_PRESENT &&
                                    this.m_sessionProperties.ignoreDuplicateSubscriptionError)) {
                                this.m_inReconnect = false;
                                // change state
                                this.changeState(9);

                                // notify client
                                sessionEvent = new solace.SessionEvent(SessionEventCode.REAPPLY_SUBSCRIPTION_ERROR,
                                        respText, respCode, errorSubcode, null, null);
                                this.sendEvent(sessionEvent);
                            }
                        }
                        else {
                            // must be 4
                            // calling handleApplySubscriptnResponse
                            if (cancelledRequest.respRecvdCallback) {
                                cancelledRequest.respRecvdCallback(rxMsgObj);
                            }
                        }
                    }
                    else {
                        if (cancelledRequest === undefined || cancelledRequest === null) {
                            // must be error response from subscriber/unsubscribe requests without confirm
                            this.handleSubscriptionUpdateError(respCode, respText, null);
                        }
                        else {
                            // subscribe/unsubscribe with confirm, or add/remove p2p inbox registration during update property operation
                            if (cancelledRequest.respRecvdCallback) {
                                cancelledRequest.respRecvdCallback(rxMsgObj, cancelledRequest);
                            }
                        }
                    }
                    break;
                case 0x0a:
                case 0x0b:
                    // do nothing
                    break;
                default:
                    // unknown protocol
                    // change state
                    this.changeState(9);

                    // notify client
                    sessionEvent = new solace.SessionEvent(SessionEventCode.PARSE_FAILURE,
                            "Received message with unknown protocol", null, ErrorSubcode.DATA_ERROR_OTHER,
                            null, null);
                    this.sendEvent(sessionEvent);
            }
        } catch (e) {
            SOLACE_CONSOLE_ERROR("Exception in handleSmfMessage: " + e);
            this.changeState(9);

            // notify client
            sessionEvent = new solace.SessionEvent(SessionEventCode.INTERNAL_ERROR,
                    ("Exception in handleSmfMessage: " + e), 0, ErrorSubcode.INTERNAL_ERROR, null, null);
            this.sendEvent(sessionEvent);
        }
    };

    /**
     * @private
     * @param {solace.Message} dataMessage
     */
    solace.Session.prototype.handleDataMessage = function(dataMessage) {
        var correlationId;
        var dataReq;

        if (this.m_sessionProperties.generateReceiveTimestamps) {
            var now = new Date();
            dataMessage.m_receiverTimestamp = now.getTime();
        }

        if (dataMessage.isReplyMessage()) {
            // if a reply message doesn't have outstanding request and correlationId starts with #REQ
            // or #CRQ, it is assumed to be a delayed reply and has to be discarded; otherwise
            // deliver as normal message
            correlationId = dataMessage.getCorrelationId();
            if (correlationId !== undefined && correlationId !== null) {
                dataReq = this.cancelOutstandingDataReq(correlationId);
                if (dataReq === null) {
                    if (correlationId.indexOf(SolClientRequestPrefix) === 0 ||
                            correlationId.indexOf(CacheRequestPrefix) === 0) {
                        SOLACE_CONSOLE_WARN("DROP: Discard reply message due to missing outstanding request");
                        this.m_sessionStatistics.incStat(StatType.RX_REPLY_MSG_DISCARD);
                        return;
                    }
                }
                else {
                    this.m_sessionStatistics.incStat(StatType.RX_REPLY_MSG_RECVED);
                    dataReq.replyReceivedCBFunction(this, dataMessage, dataReq.userObject);
                    return;
                }
            }
        }

        // notify client message callback
        if (this.m_messageCallbackInfo) {
            if (this.m_messageCallbackInfo.userObject) {
                this.m_messageCallbackInfo.messageRxCBFunction(this, dataMessage,
                        this.m_messageCallbackInfo.userObject);
            }
            else {
                this.m_messageCallbackInfo.messageRxCBFunction(this, dataMessage);
            }
        }
    };

    /**
     * @private
     */
    solace.Session.prototype.handleSmfParseError = function(transportError) {
        if (!this.shallNotifyClient()) {
            SOLACE_CONSOLE_WARN("Ignore errors received on a session in state " + solace.InternalSessionStateDescription[this.m_sessionState]);
            return;
        }

        // change state
        this.changeState(9);

        // notify client
        var sessionEvent = new solace.SessionEvent(SessionEventCode.PARSE_FAILURE,
                transportError.message, null, transportError.subcode || ErrorSubcode.DATA_ERROR_OTHER,
                null, null);
        this.sendEvent(sessionEvent);
    };

    /**
     * @private
     */
    solace.Session.prototype.handleTransportEvent = function(transportEvent) {
        var sEventCode;
        var infoStr = transportEvent.getInfoStr() || "";
        var transportEventStr = transportEvent.toString();
        var sessionEvent;

        SOLACE_CONSOLE_DEBUG("Receive transport event: " + transportEvent);
        if (transportEvent.getSessionEventCode() !== TransportSessionEventCode.DESTROYED_NOTICE &&
                !this.shallNotifyClient()) {
            SOLACE_CONSOLE_WARN("Ignore transport event on a session in state " + solace.InternalSessionStateDescription[this.m_sessionState]);
            return;
        }

        switch (transportEvent.getSessionEventCode()) {
            case TransportSessionEventCode.UP_NOTICE:
                // change state
                this.changeState(3);
                this.m_sessionId = transportEvent.getSessionId() || "";
                SOLACE_CONSOLE_INFO("Transport session is up (sessionId=" + this.m_sessionId + ")");

                this.m_sessionProperties.transportScheme =
                        this.m_smfClient.getTransportSession().isUsingBinaryTransport() ?
                                solace.TransportScheme.HTTP_BASIC : solace.TransportScheme.HTTP_BASE64;
                // no need to notify client

                // initiate login process - send client ctrl
                this.sendClientCtrl();
                break;
            case TransportSessionEventCode.DESTROYED_NOTICE:
                // change state
                this.changeState(1);
                // clean up session cache
                this.cleanupSession();

                // notify client
                sEventCode = SessionEventCode.DISCONNECTED;
                sessionEvent = new solace.SessionEvent(sEventCode, infoStr, null,
                        transportEvent.getResponseCode(), null, transportEventStr);
                this.sendEvent(sessionEvent);

                // set client callbacks to null so that they will no longer receive any event or message
                if (this.m_disposed) {
                    this.m_messageCallbackInfo = null;
                    this.m_eventCallbackInfo = null;
                }
                break;
            case TransportSessionEventCode.CONNECTING:
                if (this.m_sessionState !== 2) {
                    // change state
                    this.changeState(2);

                    // no need to notify client
                }
                break;
            case TransportSessionEventCode.CAN_ACCEPT_DATA:
                // no state change, session remain connected
                if (this.m_sessionState === 11) {
                    this.reapplySubscriptions();
                }
                else {
                    // notify client
                    sEventCode = SessionEventCode.CAN_ACCEPT_DATA;
                    sessionEvent = new solace.SessionEvent(sEventCode, infoStr, null,
                            transportEvent.getResponseCode(), null, transportEventStr);
                    this.sendEvent(sessionEvent);
                }
                break;
            case TransportSessionEventCode.CONNECTION_ERROR:
//                // change state
//                this.changeState(9);
//
//                // notify client
//                sEventCode = SessionEventCode.DOWN_ERROR;
//                sessionEvent = new solace.SessionEvent(sEventCode, infoStr, null,
//                        transportEvent.getResponseCode(), null, transportEventStr);
//                this.sendEvent(sessionEvent);
//                break;
            case TransportSessionEventCode.DATA_DECODE_ERROR:
//                // change state
//                this.changeState(9);
//
//                // notify client
//                sEventCode = SessionEventCode.DATA_DECODE_ERROR;
//                sessionEvent = new solace.SessionEvent(sEventCode, infoStr, null,
//                        transportEvent.getResponseCode(), null, transportEventStr);
//                this.sendEvent(sessionEvent);
//                break;
            case TransportSessionEventCode.PARSE_FAILURE:
//                // change state
//                this.changeState(9);
//
//                // notify client
//                sEventCode = SessionEventCode.PARSE_FAILURE;
//                sessionEvent = new solace.SessionEvent(sEventCode, infoStr, null,
//                        transportEvent.getResponseCode(), null, transportEventStr);
//                this.sendEvent(sessionEvent);
                    
                // fatal connection error
                this.destroyTransportSession(infoStr, transportEvent.getResponseCode());
                break;
            default:
                SOLACE_CONSOLE_WARN("Received unknown transport session event: " + transportEventStr);
        }
    };


    /**
     * Initiates the ClientCtrl handshake, called from transportSessionEvent callback
     * @private
     */
    solace.Session.prototype.sendClientCtrl = function () {
        var sessionEvent;

        var result = this.allowOperation(2);
        if (result) {
            // notify client
            sessionEvent = new solace.SessionEvent(SessionEventCode.LOGIN_FAILURE,
                    result, null,
                    ErrorSubcode.INVALID_SESSION_OPERATION, null, null);
            this.sendEvent(sessionEvent);
            return;
        }

        // change state
        this.changeState(4);

        var clientCtrlMsg = solace.smf.ClientCtrlMessage.getLogin(this.m_sessionProperties);
        var correlationTag = clientCtrlMsg.getSmfHeader().m_pm_corrtag || "";

        var myThis = this;
        var returnCode = this.m_smfClient.send(clientCtrlMsg);
        if (returnCode !== 0) {
            // change session state
            this.changeState(9);

            // notify client
            if (returnCode === 2) {
                sessionEvent = new solace.SessionEvent(SessionEventCode.LOGIN_FAILURE,
                        "Cannot send client control - no space in transport",
                        null, ErrorSubcode.INSUFFICIENT_SPACE, null, null);
            }
            else {
                sessionEvent = new solace.SessionEvent(SessionEventCode.LOGIN_FAILURE,
                        "Cannot send client ctrl",
                        null, ErrorSubcode.INVALID_SESSION_OPERATION, null, null);
            }
            this.sendEvent(sessionEvent);
        }
        else {
            // update stats
            this.updateTxStats(clientCtrlMsg);

            // enqueue outstanding request
            this.enqueueOutstandingCtrlReq(correlationTag,
                    function() {myThis.handleOperationTimeout(correlationTag, "Login request timeout");},
                    this.m_sessionProperties.readTimeoutInMsecs,
                    0, null,
                    function(rxMsgObj) {myThis.handleClientCtrlResponse(rxMsgObj);});

            SOLACE_CONSOLE_INFO("Sent client ctrl");
        }
    };

    /**
     * @private
     * @param clientCtrlMsg
     */
    solace.Session.prototype.handleClientCtrlResponse = function(clientCtrlMsg) {
        var response = clientCtrlMsg.getResponse();
        var respCode = response.ResponseCode;
        var respText = response.ResponseString;
        var sessionEvent;
        var errorSubCode;

        // login
        if (respCode === 200) {
            if (this.m_sessionProperties.noLocal === true) {
                var caps = clientCtrlMsg.getRouterCapabilities();
                var noLocalSupported = true;
                if (!caps) {
                    noLocalSupported = false;
                }
                else {
                // Guard for undefined OR non-boolean capability
                    noLocalSupported = (typeof caps[solace.CapabilityType.NO_LOCAL] === "boolean") ? caps[solace.CapabilityType.NO_LOCAL] : false;
                }
                if (!noLocalSupported) {
                    this.m_inReconnect = false;
                    // change state
                    this.changeState(9);

                    // notify client
                    sessionEvent = new solace.SessionEvent(SessionEventCode.LOGIN_FAILURE,
                            "No Local is not supported by the router", respCode, ErrorSubcode.NO_LOCAL_NOT_SUPPORTED, null, null);
                    this.sendEvent(sessionEvent);
                    return;
                }
            }
            // change state
            this.changeState(5);
            // no need to notify client

            // update session properties
            this.updateReadonlySessionProps(clientCtrlMsg);

            // do p2pInbox registration
            this.sendP2PInboxReg();
        }
        else {
            SOLACE_CONSOLE_INFO("Login Failure");
            this.m_inReconnect = false;
            // change state
            this.changeState(9);

            // notify client
            errorSubCode = solace.ErrorResponseSubCodeMapper.getErrorSubCode(respCode, respText);
            sessionEvent = new solace.SessionEvent(SessionEventCode.LOGIN_FAILURE,
                    respText, respCode, errorSubCode, null, null);
            this.sendEvent(sessionEvent);
        }
    };

    /**
     * @private
     * Initiate P2PInbox subscription. Called from smf client rxMessage callback
     */
    solace.Session.prototype.sendP2PInboxReg = function() {
        var result = this.allowOperation(3);
        if (result) {
            // notify client
            var sessionEvent = new solace.SessionEvent(SessionEventCode.P2P_SUB_ERROR,
                        result, null,
                        ErrorSubcode.INVALID_SESSION_OPERATION, null, null);
            this.sendEvent(sessionEvent);
            return;
        }

        // change state
        this.changeState(6);

        var p2pTopic = P2PUtil.getP2PTopicSubscription(this.m_sessionProperties.p2pInboxBase);
        var myThis = this;
        this.subscriptionUpdate(new solace.Topic(p2pTopic), true, null, this.m_sessionProperties.readTimeoutInMsecs,
                1,
                function(rxMsgObj) {myThis.handleP2PRegResponse(rxMsgObj);});
    };

    /**
     * @private
     * @param smpMsg
     */
    solace.Session.prototype.handleP2PRegResponse = function(smpMsg) {
        var response = smpMsg.getResponse();
        var respCode = response.ResponseCode;
        var respText = response.ResponseString;
        var sessionEvent;
        var errorSubCode;

        if (respCode === 200) {
            if (this.m_inReconnect && this.m_sessionProperties.reapplySubscriptions &&
                    this.m_subscriptionCache && this.m_subscriptionCacheCount > 0) {
                this.changeState(7);

                // no need to notify client

                // reapply subscriptions if applicable
                this.clearSubscriptionCacheKeys();
                this.m_subscriptionCacheKeys = [];
                for (var key in this.m_subscriptionCache) {
                    if (this.m_subscriptionCache.hasOwnProperty(key)) {
                        this.m_subscriptionCacheKeys.push(key);
                    }
                }
                this.reapplySubscriptions();
            }
            else {
                this.m_inReconnect = false;
                this.changeState(8);

                // start keep alive timer
                this.scheduleKeepAlive();

                // notify client
                sessionEvent = new solace.SessionEvent(SessionEventCode.UP_NOTICE,
                        "Session is up", respCode, 0, null, null);
                this.sendEvent(sessionEvent);
            }
        }
        else {
            // change state
            this.m_inReconnect = false;
            this.changeState(9);

            // notify client
            errorSubCode = solace.ErrorResponseSubCodeMapper.getErrorSubCode(respCode, respText);
            sessionEvent = new solace.SessionEvent(SessionEventCode.P2P_SUB_ERROR,
                    respText, respCode, errorSubCode, null, null);
            this.sendEvent(sessionEvent);
        }
    };


    /**
     * @private
     * Initiate update P2PInbox subscription. Called from smf client rxMessage callback
     */
    solace.Session.prototype.sendUpdateP2PInboxReg = function(add, p2pTopic, correlationKey, responseCb) {
        var result = this.allowOperation(4);
        if (result) {
            // notify client
            var sessionEvent = new solace.SessionEvent(SessionEventCode.PROPERTY_UPDATE_ERROR,
                        result, null,
                        ErrorSubcode.INVALID_SESSION_OPERATION, correlationKey, null);
            this.sendEvent(sessionEvent);
            return;
        }
        this.subscriptionUpdate(new solace.Topic(p2pTopic), true, null, this.m_sessionProperties.readTimeoutInMsecs,
                add ? 7 : 8,
                responseCb);
    };

    /**
     * Handle control request timeout
     * @param correlationTag
     * @param timeoutMsg
     * @private
     */
    solace.Session.prototype.handleOperationTimeout = function(correlationTag, timeoutMsg) {
        this.m_inReconnect = false;
        // remove request from queue
        try {
            if (!(delete this.m_outstandingCtrlReqs[correlationTag])) {
                SOLACE_CONSOLE_ERROR("Cannot delete ctrl request " + correlationTag);
            }
        } catch (e) {
            SOLACE_CONSOLE_ERROR("Cannot delete ctrl request " + correlationTag + ", exception: " + e);
        }

        if (this.shallNotifyClient()) {
            // change state
            this.changeState(9);

            // notify client
            var sessionEvent = new solace.SessionEvent(SessionEventCode.REQUEST_TIMEOUT,
                    timeoutMsg, null, ErrorSubcode.TIMEOUT, null, null);
            this.sendEvent(sessionEvent);
        }
        else {
           SOLACE_CONSOLE_WARN("Ignore timeout error on a session in state " + solace.InternalSessionStateDescription[this.m_sessionState]);
        }
    };

    /**
     * @private
     * Schedule keep alive task
     */
    solace.Session.prototype.scheduleKeepAlive = function() {
        var myThis = this;
        if (this.m_keepAliveTimer) {
            clearInterval(this.m_keepAliveTimer);
        }
        if (this.m_kaWatchdog) {
            clearInterval(this.m_kaWatchdog);
        }
        myThis.m_kaWatchdog = 0;
        myThis.m_kaWatchdogCount = 0;

        this.m_keepAliveTimer = setInterval(function() {
            try {
                myThis.sendKeepAlive();
                myThis.m_kaWatchdogCount = 0;
            } catch (e) {
                SOLACE_CONSOLE_INFO("Error occurred in sendKeepAlive " + e);
                SOLACE_CONSOLE_INFO("Stack " + e.stack);
            }
        }, this.m_sessionProperties.keepAliveIntervalInMsecs);

        this.m_kaWatchdog = setInterval(function() {
            myThis.m_kaWatchdogCount++;
            if (myThis.m_kaWatchdogCount >= 2) {
                SOLACE_CONSOLE_INFO("KeepAlive watchdog: restarting KA (" + myThis.m_kaWatchdogCount + ")");
                myThis.scheduleKeepAlive();
            }
        }, this.m_sessionProperties.keepAliveIntervalInMsecs * 3);
        SOLACE_CONSOLE_DEBUG("========>Create Keepalive timer " + this.m_keepAliveTimer);
    };

    /**
     * @private
     * Call from keep alive scheduled task
     */
    solace.Session.prototype.sendKeepAlive = function() {
        SOLACE_CONSOLE_DEBUG("sendKeepAlive called...");
        var sessionEvent;

        var result = this.allowOperation(4);
        if (result) {
            SOLACE_CONSOLE_INFO("sendKeepAlive: disallowed op " + result);
            if (this.shallNotifyClient()) {
                sessionEvent = new solace.SessionEvent(SessionEventCode.KEEP_ALIVE_ERROR,
                        result, null,
                        ErrorSubcode.INVALID_SESSION_OPERATION, null, null);
                this.sendEvent(sessionEvent);
            }
            else {
               SOLACE_CONSOLE_INFO("Ignore keep alive error on a session in state " + solace.InternalSessionStateDescription[this.m_sessionState]);
            }
            return;
        }

        // session is in connected state but hasn't received keep alive response
        if (this.m_keepAliveCounter > this.m_sessionProperties.keepAliveIntervalsLimit) {
            SOLACE_CONSOLE_ERROR("Exceed maximum keep alive intervals limit " + this.m_sessionProperties.keepAliveIntervalsLimit);
            // change session state
            this.changeState(9);

            // send event
            sessionEvent = new solace.SessionEvent(SessionEventCode.KEEP_ALIVE_ERROR,
                    "Exceed maximum keep alive intervals limit",
                    null, ErrorSubcode.KEEP_ALIVE_FAILURE, null, null);
            this.sendEvent(sessionEvent);
            return;
        }

        SOLACE_CONSOLE_DEBUG("About to send keep alive");
        var kaMsg = new solace.smf.KeepAliveMessage();
        var smfClient = this.m_smfClient;
        var prestat_msgWritten = smfClient.getClientStats().msgWritten;
        var prestat_bytesWritten = smfClient.getClientStats().bytesWritten;
        
        var returnCode = this.m_smfClient.send(kaMsg, true);
        if (returnCode !== 0) {
            if (returnCode === 2) {
                // no need to disconnect session right now
                this.m_keepAliveCounter++;
                SOLACE_CONSOLE_INFO("Incremement keep alive counter due to insufficent space, keep alive count=" + this.m_keepAliveCounter);
            }
            else {
                if (this.shallNotifyClient()) {
                    // change session state
                    this.changeState(9);
                    sessionEvent = new solace.SessionEvent(SessionEventCode.KEEP_ALIVE_ERROR,
                            "Cannot send keep alive message",
                            null, ErrorSubcode.COMMUNICATION_ERROR, null, null);
                    this.sendEvent(sessionEvent);
                }
                else {
                    SOLACE_CONSOLE_INFO("Ignore keep alive error on a session in state " + solace.InternalSessionStateDescription[this.m_sessionState]);
                }
            }
        }
        else {
            // update stats
            this.updateTxStats(kaMsg);
            this.m_keepAliveCounter++;

            // We need to avoid incrementing the KA counter if we're in the process of
            // sending a huge message and we've had no opportunity to write a KA message.
            // Detection: last KA's snapshot of messages written is equal to right now, but number of bytes written has gone up.
            if (this.m_kaStats.lastMsgWritten === prestat_msgWritten &&
                this.m_kaStats.lastBytesWritten < prestat_bytesWritten) {
                this.m_keepAliveCounter--;
            }
            this.m_kaStats.lastBytesWritten = smfClient.getClientStats().bytesWritten;
            this.m_kaStats.lastMsgWritten = smfClient.getClientStats().msgWritten;

            SOLACE_CONSOLE_INFO("Incremement keep alive counter, keep alive count=" + this.m_keepAliveCounter);
        }
    };


    /**
     * Reapply subscriptions. This method is called only when subscription cache is not empty.
     * @private
     */
    solace.Session.prototype.reapplySubscriptions = function() {
        if (this.m_sessionState !== 11) {
            var result = this.allowOperation(6);
            if (result) {
                this.m_inReconnect = false;
                this.clearSubscriptionCacheKeys();
                var sessionEvent = new solace.SessionEvent(SessionEventCode.SUBSCRIPTION_ERROR,
                        result, null,
                        ErrorSubcode.INVALID_SESSION_OPERATION, null, null);
                this.sendEvent(sessionEvent);
                return;
            }
    
            this.changeState(11);
        }

        SOLACE_CONSOLE_DEBUG("Reapplying subscriptions");
        // add subscriptions and ask for confirm on last one
        var myThis = this;
        var applyCallback = function (rxMsgObj) {
            myThis.handleApplySubscriptnResponse(rxMsgObj);
        };

        if (this.m_subscriptionCacheKeys) {
            var key = null;
            try {
                while (this.m_subscriptionCacheKeys.length > 0) {
                    key = this.m_subscriptionCacheKeys[0];
                    if (this.m_subscriptionCacheKeys.length === 1) {
                        this.subscriptionUpdate(this.m_subscriptionCache[key], true, null,
                                    this.m_sessionProperties.readTimeoutInMsecs, 4,
                                    applyCallback);
                    }
                    else {
                        this.subscriptionUpdate(this.m_subscriptionCache[key], false, null,
                                    this.m_sessionProperties.readTimeoutInMsecs, 4, null);
                    }
                    // remove applied subscription
                    this.m_subscriptionCacheKeys.shift();
                }
            } catch (e) {
                if (e.name && e.name === "OperationError" && e.subcode === ErrorSubcode.INSUFFICIENT_SPACE) {
                    SOLACE_CONSOLE_INFO("Apply subscriptions blocked due to insufficient space, wait for can accept data event");
                }
                else {
                    throw e;
                }
            }
        }
    };

    /**
     * @private
     * Callback function for applySubscription response
     * @param smpMsg
     */
    solace.Session.prototype.handleApplySubscriptnResponse = function(smpMsg) {
        var response = smpMsg.getResponse();
        var respCode = response.ResponseCode;
        var respText = response.ResponseString;
        var sessionEvent;
        var errorSubCode;

        // for reapply subscriptions operations, only the last subscription add require confirm
        // so if success response received, should change the session state to connected and send
        // out a session up event
        this.m_inReconnect = false;
        this.clearSubscriptionCacheKeys();

        if (respCode === 200) {
            // change state
            this.changeState(8);

            // start keep alive
            this.scheduleKeepAlive();

            // notify client
            sessionEvent = new solace.SessionEvent(SessionEventCode.UP_NOTICE,
                    "Session is up", respCode, 0, null, null);
            this.sendEvent(sessionEvent);
        }
        else {
            errorSubCode = solace.ErrorResponseSubCodeMapper.getErrorSubCode(respCode, respText);
            if (errorSubCode === ErrorSubcode.SUBSCRIPTION_ALREADY_PRESENT &&
                this.m_sessionProperties.ignoreDuplicateSubscriptionError) {
                // change state
                this.changeState(8);

                // start keep alive
                this.scheduleKeepAlive();

                // notify client
                sessionEvent = new solace.SessionEvent(SessionEventCode.UP_NOTICE,
                        "Session is up", respCode, 0, null, null);
                this.sendEvent(sessionEvent);
            }
            else {
                 // change state
                this.changeState(9);

                // notify client
                sessionEvent = new solace.SessionEvent(SessionEventCode.REAPPLY_SUBSCRIPTION_ERROR,
                        respText, respCode, errorSubCode, null, null);
                this.sendEvent(sessionEvent);
            }
        }
    };

    /**
     * @private
     * Callback function for subscribe/unsubscribe response
     * @param smpMsg
     * @param {solace.OutstandingCtrlRequest} request
     */
    solace.Session.prototype.handleSubscriptionUpdateResponse = function (smpMsg, request) {
        var response = smpMsg.getResponse();
        var respCode = response.ResponseCode;
        var respText = response.ResponseString;
        var sessionEvent;

        if (respCode === 200) {
            var correlationKey = request.correlationKey;

            // notify client
            sessionEvent = new solace.SessionEvent(SessionEventCode.SUBSCRIPTION_OK,
                    respText, respCode, 0, correlationKey, null);
            this.sendEvent(sessionEvent);
        }
        else {
            this.handleSubscriptionUpdateError(respCode, respText, request);
        }
    };

    /**
     * @private
     * @param respCode
     * @param respText
     * @param request
     */
    solace.Session.prototype.handleSubscriptionUpdateError = function (respCode, respText, request) {
        var errorSubCode = solace.ErrorResponseSubCodeMapper.getErrorSubCode(respCode, respText);
        var SUBSCRIPTION_ERROR = SessionEventCode.SUBSCRIPTION_ERROR;
        var correlationKey = null;
        if (request !== null) {
            correlationKey = request.correlationKey;
        }
        var sessionEvent;
        if ((errorSubCode === ErrorSubcode.SUBSCRIPTION_ALREADY_PRESENT &&
                this.m_sessionProperties.ignoreDuplicateSubscriptionError) ||
                 (errorSubCode === ErrorSubcode.SUBSCRIPTION_NOT_FOUND &&
                        this.m_sessionProperties.ignoreSubscriptionNotFoundError)) {
            // if request is not null, this request needs confirm
            if (request !== null) {
                // notify client
                sessionEvent = new solace.SessionEvent(
                        SessionEventCode.SUBSCRIPTION_OK,
                        respText, respCode, 0, correlationKey, null);
                this.sendEvent(sessionEvent);
            }
        }
        else if (errorSubCode === ErrorSubcode.SUBSCRIPTION_ALREADY_PRESENT ||
                errorSubCode === ErrorSubcode.SUBSCRIPTION_ATTRIBUTES_CONFLICT ||
                errorSubCode === ErrorSubcode.SUBSCRIPTION_INVALID ||
                errorSubCode === ErrorSubcode.SUBSCRIPTION_NOT_FOUND ||
                errorSubCode === ErrorSubcode.SUBSCRIPTION_ACL_DENIED ||
                errorSubCode === ErrorSubcode.SUBSCRIPTION_TOO_MANY) {
            // notify client
            sessionEvent = new solace.SessionEvent(
                    SUBSCRIPTION_ERROR, respText, respCode,
                    errorSubCode, correlationKey, null);
            this.sendEvent(sessionEvent);
        }
        else {
            // notify client
            sessionEvent = new solace.SessionEvent(
                    SUBSCRIPTION_ERROR, respText, respCode,
                    ErrorSubcode.SUBSCRIPTION_ERROR_OTHER, correlationKey, null);
            this.sendEvent(sessionEvent);
        }
    };


    /**
     * @private
     */
    solace.Session.prototype.cleanupSession = function() {
        SOLACE_CONSOLE_DEBUG("Clean up session");
        this.m_sessionId = null;
        this.m_inReconnect = false;

//        SOLACE_CONSOLE_DEBUG("========>Keepalive timer " + this.m_keepAliveTimer);
        if (this.m_keepAliveTimer !== undefined && this.m_keepAliveTimer !== null) {
            SOLACE_CONSOLE_DEBUG("Cancel keepalive timer");
            clearInterval(this.m_keepAliveTimer);
            clearInterval(this.m_kaWatchdog);
            this.m_keepAliveTimer = null;
        }
        this.resetKeepAliveCounter();
        var index;
        if (this.m_outstandingCtrlReqs) {
            SOLACE_CONSOLE_DEBUG("Cancel all outstanding ctrl requests");
            for (index in this.m_outstandingCtrlReqs) {
                if (this.m_outstandingCtrlReqs.hasOwnProperty(index)) {
                    this.cancelOutstandingCtrlReq(index);
                }
            }
        }

        if (this.m_outstandingDataReqs) {
            SOLACE_CONSOLE_DEBUG("Cancel all outstanding data requests");
            var dataReq;
            for (index in this.m_outstandingDataReqs) {
                if (this.m_outstandingDataReqs.hasOwnProperty(index)) {
                    dataReq = this.cancelOutstandingDataReq(index);
                    if (dataReq !== null && dataReq.reqFailedCBFunction !== undefined && dataReq.reqFailedCBFunction !== null) {
                        var sessionEvent = new solace.SessionEvent(
                                SessionEventCode.REQUEST_ABORTED, "Request aborted", null,
                                ErrorSubcode.SESSION_NOT_CONNECTED, null, null);

                        dataReq.reqFailedCBFunction(this, sessionEvent, dataReq.userObject);
                    }
                }
            }
        }
    };

    /**
     * @private
     */
    solace.Session.prototype.destroyTransportSession = function(msg, subCode) {
        if (this.m_smfClient !== undefined && this.m_smfClient !== null) {
            SOLACE_CONSOLE_INFO("Destroy transport session");
            var returnCode = this.m_smfClient.destroy(true, msg, subCode);
            if (returnCode !== 0) {
                SOLACE_CONSOLE_ERROR("Failed to destroy transport session, return code: " + returnCode);
            }
            this.m_smfClient = null; // release resource
        }
    };

    /**
     * @private
     */
    solace.Session.prototype.clearSubscriptionCacheKeys = function() {
        if (this.m_subscriptionCacheKeys) {
            try {
                while (this.m_subscriptionCacheKeys.length > 0) {
                    this.m_subscriptionCacheKeys.shift();
                }
            }
            catch (e) {
                SOLACE_CONSOLE_ERROR(("Failed to remove item from subscription cache keys"));
            }
            this.m_subscriptionCacheKeys = null;
        }
    };

    /**
     * Gets a transport session information string.
     * This string is informative only, and applications should not attempt to parse it.
     *
     * @return {string}
     */
    solace.Session.prototype.getTransportInfo = function() {
        if (typeof this.m_smfClient === "undefined" || this.m_smfClient !== null) {
            return "Not connected.";
        }
        return this.m_smfClient.getTransportSessionInfoStr();
    };

    /**
     * @class
     * @private
     * Construct a mapping between {solace.ErrorResponseSubCodeMapper.ResponseCode},
     * {solace.ErrorResponseSubCodeMapper.ResponseErrorStr} and
     * {solace.ErrorSubcode}.
     *
     * @param {solace.ErrorResponseSubCodeMapper.ResponseCode} respErrorCode
     * @param {solace.ErrorResponseSubCodeMapper.ResponseErrorStr} respErrorStr
     * @param {solace.ErrorSubcode} errSubCode
     */
    solace.ResponseErrorMap = function(respErrorCode, respErrorStr, errSubCode) {
        this.respErrorCode = respErrorCode;
        this.respErrorStr = respErrorStr;
        this.errSubCode = errSubCode;
    };

    /**
     * @class
     * @private
     * @description Return {solace.ErrorSubcode} based on response code and response string
     * from the router.
     */
    solace.ErrorResponseSubCodeMapper = {
    };

    /**
     * @private
     * Static method
     * @param {number} respErrorCode
     * @param {string} respStr
     */
    solace.ErrorResponseSubCodeMapper.getErrorSubCode = function(respErrorCode, respStr) {
        if (respErrorCode === solace.ErrorResponseSubCodeMapper.ResponseCode.E200_OK) {
            // success response, error subcode is 0 -  transport session use 0 as OK
            return 0;
        }
        var i;
        var errorMap;
        var ResponseErrorMapping = solace.ErrorResponseSubCodeMapper.ResponseErrorMapping;
        var len = ResponseErrorMapping.length;
        for (i = 0; i < len; i++) {
            errorMap = ResponseErrorMapping[i];
            if (errorMap.respErrorCode === respErrorCode) {
                if (errorMap.respErrorStr === null || respStr.toLowerCase().indexOf(errorMap.respErrorStr.toLowerCase()) >= 0) {
                    return errorMap.errSubCode;
                }
            }
        }

        var buf = new solace.StringBuffer("Cannot find error subcode for response error code=");
        buf.append(respErrorCode).append(", response string");
        buf.append(respStr);
        SOLACE_CONSOLE_ERROR(buf.toString());

        return ErrorSubcode.UNKNOWN_ERROR;
    };

    /**
     * @private
     * Static class property
     */
    solace.ErrorResponseSubCodeMapper.ResponseCode = {
        E200_OK: 200,
        E400: 400,
        E401: 401,
        E403: 403,
        E404: 404,
        E503: 503,
        E507: 507
    };

    /**
     * @private
     * Static class property
     */
    solace.ErrorResponseSubCodeMapper.ResponseErrorStr = {
//        ER_UNAUTHORIZED: "unauthorized",
//		ER_NOT_FOUND: "not found",
//		ER_UNKNOWN_CLIENT_NAME: "unknown client name",
//		ER_INVALID_USERNAME: "invalid username",
		ER_XML_PARSE_ERROR: "xml parse error",
		ER_DOC_TOO_LARGE: "document is too large",
		ER_MSG_TOO_LARGE: "message too long",
		ER_TOO_MANY_CLIENTS: "too many clients",
		ER_SUB_DELETE_IN_PROGRESS: "subscriber delete in progress",
		ER_INVALID_VIRTUAL_IP: "invalid virtual router address",
		ER_SUB_ALREADY_PRESENT: "subscription already exists",
		ER_SUB_NOT_FOUND: "subscription not found",
		ER_SUB_PARSE_ERROR: "subscription parse error",
		ER_SUB_MAX_NUMBER_EXCEEDED: "max num subscriptions exceeded",
		ER_TOPIC_PARSE_ERROR: "topic parse error",
		ER_NOT_ENOUGH_SPACE: "not enough space",
		ER_MSG_VPN_NOT_ALLOWED: "message vpn not allowed",
		ER_MSG_VPN_UNAVAILABLE: "message vpn unavailable",
		ER_CLIENT_USERNAME_IS_SHUTDOWN: "client username is shutdown",
		ER_DYNAMIC_CLIENTS_NOT_ALLOWED: "dynamic clients not allowed",
		ER_CLIENT_NAME_ALREADY_IN_USE: "client name already in use",
		ER_CLIENT_NAME_PARSE_ERROR: "client name parse error",
		ER_FORBIDDEN: "Forbidden",
		ER_SUBSCRIPTION_ACL_DENIED: "Subscription ACL Denied",
		ER_PUBLISH_ACL_DENIED: "Publish ACL Denied",
		ER_SUBSCRIPTION_ATTRIBUTES_CONFLICT_WITH_EXISTING_SUBSCRIPTION: "Subscription Attributes Conflict With Existing Subscription",
		ER_INACTIVITY_TIMEOUT: "Inactivity Timeout",
		ER_UNKNOWN_TRANSPORT_SESSION_ID: "Unknown Transport Session Identifier"
    };

    /**
     * @private
     * Static class property
     */
    solace.ErrorResponseSubCodeMapper.ResponseErrorMapping = (function() {
        var ResponseCode = solace.ErrorResponseSubCodeMapper.ResponseCode;
        var ResponseErrorStr = solace.ErrorResponseSubCodeMapper.ResponseErrorStr;
        return [
            new solace.ResponseErrorMap(ResponseCode.E401, null, ErrorSubcode.LOGIN_FAILURE),
            new solace.ResponseErrorMap(ResponseCode.E404, null, ErrorSubcode.LOGIN_FAILURE),
            new solace.ResponseErrorMap(ResponseCode.E403, ResponseErrorStr.ER_INVALID_VIRTUAL_IP, ErrorSubcode.INVALID_VIRTUAL_ADDRESS),
            new solace.ResponseErrorMap(ResponseCode.E403, ResponseErrorStr.ER_MSG_VPN_NOT_ALLOWED, ErrorSubcode.MESSAGE_VPN_NOT_ALLOWED),
            new solace.ResponseErrorMap(ResponseCode.E403, ResponseErrorStr.ER_CLIENT_USERNAME_IS_SHUTDOWN, ErrorSubcode.CLIENT_USERNAME_IS_SHUTDOWN),
            new solace.ResponseErrorMap(ResponseCode.E403, ResponseErrorStr.ER_DYNAMIC_CLIENTS_NOT_ALLOWED, ErrorSubcode.DYNAMIC_CLIENTS_NOT_ALLOWED),
            new solace.ResponseErrorMap(ResponseCode.E403, ResponseErrorStr.ER_CLIENT_NAME_ALREADY_IN_USE, ErrorSubcode.CLIENT_NAME_ALREADY_IN_USE),
            new solace.ResponseErrorMap(ResponseCode.E503, ResponseErrorStr.ER_SUB_DELETE_IN_PROGRESS, ErrorSubcode.CLIENT_DELETE_IN_PROGRESS),
            new solace.ResponseErrorMap(ResponseCode.E503, ResponseErrorStr.ER_TOO_MANY_CLIENTS, ErrorSubcode.TOO_MANY_CLIENTS),
            new solace.ResponseErrorMap(ResponseCode.E503, ResponseErrorStr.ER_MSG_VPN_UNAVAILABLE, ErrorSubcode.MESSAGE_VPN_UNAVAILABLE),
            new solace.ResponseErrorMap(ResponseCode.E400, ResponseErrorStr.ER_CLIENT_NAME_PARSE_ERROR, ErrorSubcode.CLIENT_NAME_INVALID),
            new solace.ResponseErrorMap(ResponseCode.E403, ResponseErrorStr.ER_FORBIDDEN, ErrorSubcode.CLIENT_ACL_DENIED),
            new solace.ResponseErrorMap(ResponseCode.E400, ResponseErrorStr.ER_XML_PARSE_ERROR, ErrorSubcode.XML_PARSE_ERROR),
            new solace.ResponseErrorMap(ResponseCode.E400, ResponseErrorStr.ER_DOC_TOO_LARGE, ErrorSubcode.MESSAGE_TOO_LARGE),
            new solace.ResponseErrorMap(ResponseCode.E400, ResponseErrorStr.ER_MSG_TOO_LARGE, ErrorSubcode.MESSAGE_TOO_LARGE),
            new solace.ResponseErrorMap(ResponseCode.E400, ResponseErrorStr.ER_TOPIC_PARSE_ERROR, ErrorSubcode.INVALID_TOPIC_SYNTAX),
            new solace.ResponseErrorMap(ResponseCode.E403, ResponseErrorStr.ER_PUBLISH_ACL_DENIED, ErrorSubcode.PUBLISH_ACL_DENIED),
            new solace.ResponseErrorMap(ResponseCode.E400, ResponseErrorStr.ER_SUB_ALREADY_PRESENT, ErrorSubcode.SUBSCRIPTION_ALREADY_PRESENT),
            new solace.ResponseErrorMap(ResponseCode.E400, ResponseErrorStr.ER_SUB_NOT_FOUND, ErrorSubcode.SUBSCRIPTION_NOT_FOUND),
            new solace.ResponseErrorMap(ResponseCode.E400, ResponseErrorStr.ER_SUB_PARSE_ERROR, ErrorSubcode.SUBSCRIPTION_INVALID),
            new solace.ResponseErrorMap(ResponseCode.E400, ResponseErrorStr.ER_SUB_MAX_NUMBER_EXCEEDED, ErrorSubcode.SUBSCRIPTION_TOO_MANY),
            new solace.ResponseErrorMap(ResponseCode.E400, ResponseErrorStr.ER_NOT_ENOUGH_SPACE, ErrorSubcode.OUT_OF_RESOURCES),
            new solace.ResponseErrorMap(ResponseCode.E403, ResponseErrorStr.ER_SUBSCRIPTION_ACL_DENIED, ErrorSubcode.SUBSCRIPTION_ACL_DENIED),
            new solace.ResponseErrorMap(ResponseCode.E400, ResponseErrorStr.ER_SUBSCRIPTION_ATTRIBUTES_CONFLICT_WITH_EXISTING_SUBSCRIPTION, ErrorSubcode.SUBSCRIPTION_ATTRIBUTES_CONFLICT),
            new solace.ResponseErrorMap(ResponseCode.E400, ResponseErrorStr.ER_INACTIVITY_TIMEOUT, ErrorSubcode.INACTIVITY_TIMEOUT),
            new solace.ResponseErrorMap(ResponseCode.E400, ResponseErrorStr.ER_UNKNOWN_TRANSPORT_SESSION_ID, ErrorSubcode.UNKNOWN_TRANSPORT_SESSION_ID)
        ];
    }());

    /**
     * @private
     * @param correlationId
     * @param timer
     * @param userObject
     *  @param replyReceivedCBFunction
     */
    solace.OutstandingDataRequest = function OutstandingDataRequest(correlationId, timer, replyReceivedCBFunction, reqFailedCBFunction, userObject) {
        this.correlationId = correlationId;
        this.timer = timer;
        this.replyReceivedCBFunction = replyReceivedCBFunction;
        this.reqFailedCBFunction = reqFailedCBFunction;
        this.userObject = userObject;
    };
    

    /**
     * @class Represents an outstanding control request
     * @private
     *
     * @param {string} correlationTag
     * @param {number} timer
     * @param {number} requestType
     * @param {Object} correlationKey
     * @param {function(*)} respRecvdCallback
     */
    solace.OutstandingCtrlRequest = function OutstandingCtrlRequest(correlationTag, timer, requestType, correlationKey, respRecvdCallback) {
        this.correlationTag = correlationTag;
        this.timer = timer;
        this.requestType = requestType;
        this.correlationKey = correlationKey;
        this.respRecvdCallback = respRecvdCallback;
    };

}(solace));
//
/*global solace:true window console BlobBuilder ArrayBuffer Uint8Array SOLACE_FATAL SOLACE_ERROR SOLACE_WARN SOLACE_INFO SOLACE_DEBUG SOLACE_TRACE SOLACE_CONSOLE_FATAL SOLACE_CONSOLE_ERROR SOLACE_CONSOLE_WARN SOLACE_CONSOLE_INFO SOLACE_CONSOLE_DEBUG SOLACE_CONSOLE_TRACE */
// 
// 

(function(solace){
    solace.smf = solace.smf || {};

    var bits = function(val, shift, num_bits){
        return (val >>> shift) & ((0x01 << num_bits) - 1);
    };

    var setBits = function(data, val, shift, num_bits) {
        var curMask = (1 << num_bits) - 1;
        var shiftedVal = (val & curMask) << shift;
        data &= ~(curMask << shift);
        return (data | shiftedVal);
    };

    solace.smf.Codec = {
        // alias bits/setBits for public use
        bits: bits,
        setBits: setBits
    };

    solace.smf.Codec.isSmfAvailable = function(data, offset){
        var remaining = data.length - offset;
        if (remaining < 12) {
            return false;
        }

        var version = solace.Convert.strToInt8(data.substr(offset + 0, 1)) & 0x7;
        //var protocol = solace.Convert.strToInt8(data.substr(offset + 1, 1)) & 0x3f;
        //var hdrLen = solace.Convert.strToInt32(data.substr(offset + 4, 4));
        var totalLen = solace.Convert.strToInt32(data.substr(offset + 8, 4));
        if (version !== 3) {
            return false;
        }
        return (totalLen <= remaining);
    };

    solace.smf.Codec.parseSmfAt = function(data, offset){
        if (!this.isSmfAvailable(data, offset)) {
            SOLACE_CONSOLE_INFO("Smf header not available");
            return false;
        }
        var pos = offset;

        // Reading fixed header block (12 bytes)
        var word1 = solace.Convert.strToInt32(data.substr(pos + 0, 4));
        var headerLen = solace.Convert.strToInt32(data.substr(pos + 4, 4));
        var word3 = solace.Convert.strToInt32(data.substr(pos + 8, 4));

        var smfHeader = new solace.smf.SMFHeader();
        smfHeader.m_smf_di = bits(word1, 31, 1);
        smfHeader.m_smf_elidingeligible = bits(word1, 30, 1);
        smfHeader.m_smf_dto = bits(word1, 29, 1);
        smfHeader.m_smf_adf = bits(word1, 28, 1);
        smfHeader.m_smf_version = bits(word1, 24, 3);
        smfHeader.m_smf_uh = bits(word1, 22, 2);
        smfHeader.m_smf_protocol = bits(word1, 16, 6);
        smfHeader.m_smf_priority = bits(word1, 12, 4);
        smfHeader.m_smf_ttl = bits(word1, 0, 8);

        var payloadLen = word3 - headerLen;
        if (payloadLen < 0) {
            SOLACE_CONSOLE_INFO("SMF parse error: lost framing");
            return false; // SMF parse error: lost framing
        }
        smfHeader.setMessageSizes(headerLen, payloadLen);
        pos += 12;

        // Reading variable-length params
        while (pos < (offset + headerLen)) {
            var prm_byte1 = solace.Convert.strToInt8(data.substr(pos, 1));
            pos++;
            var prm_uh = bits(prm_byte1, 6, 2);
            var prm_isLW = (bits(prm_byte1, 5, 1) !== 0);
            var prm_type = 0;
            var prm_len = 0;
            var prm_valueLen = 0;

            if (prm_isLW) {
                // LIGHTWEIGHT param
                // Yeah, I'm sure saving that extra byte was worth the trouble
                prm_type = bits(prm_byte1, 2, 3);
                prm_len = bits(prm_byte1, 0, 2) + 1;
                prm_valueLen = prm_len - 1;
                if (prm_len <= 0) {
                    return false; // Invalid parameter
                }
                switch (prm_type) {
                    case 0x00:
                        smfHeader.m_pm_corrtag = solace.Convert.strToInt24(data.substr(pos, 3));
                        break;
                    case 0x01:
                        var parsed_qo = this.ParamParse.parseTopicQueueOffsets(data, pos);
                        smfHeader.m_pm_queue_offset = parsed_qo[0];
                        smfHeader.m_pm_queue_len = parsed_qo[1];
                        break;
                    case 0x02:
                        var parsed_to = this.ParamParse.parseTopicQueueOffsets(data, pos);
                        smfHeader.m_pm_topic_offset = parsed_to[0];
                        smfHeader.m_pm_topic_len = parsed_to[1];
                        break;
                }
                pos += prm_valueLen;
            }
            else {
                // REGULAR encoded param
                prm_type = bits(prm_byte1, 0, 5);
                if (prm_type === 0) {
                    break; // PADDING (break while: header finished)
                }
                prm_len = solace.Convert.strToInt8(data.substr(pos, 1));
                pos++;
                if (prm_len === 0) {
                    // extended-length parameter (32-bit)
                    prm_len = solace.Convert.strToInt32(data.substr(pos, 4));
                    pos += 4;
                    prm_valueLen = prm_len - 6;
                }
                else {
                    prm_valueLen = prm_len - 2;
                }
                if (prm_len <= 0) {
                    return false; // Invalid parameter
                }
                switch (prm_type) {
                    case 0x03:
                        smfHeader.m_pm_msg_priority = solace.Convert.strToInt8(data.substr(pos, 1));
                        break;
                    case 0x04:
                        smfHeader.m_pm_userdata = data.substr(pos, prm_valueLen);
                        break;
                    case 0x06:
                        // only useful on SDK -> ROUTER
                        smfHeader.m_pm_username = solace.base64_decode(data.substr(pos, prm_valueLen));
                        break;
                    case 0x07:
                        // only useful on SDK -> ROUTER
                        smfHeader.m_pm_password = solace.base64_decode(data.substr(pos, prm_valueLen));
                        break;
                    case 0x08:
                        var response_parsed = this.ParamParse.parseResponseParam(data, pos, prm_valueLen);
                        smfHeader.m_pm_respcode = response_parsed[0];
                        smfHeader.m_pm_respstr = response_parsed[1];
                        break;
                    case 0x0A:
                    case 0x0B:
                    case 0x0C:
                        // deprecated
                        break;
                    case 0x10:
                        smfHeader.m_pm_deliverymode = this.ParamParse.parseDeliveryMode(data, pos);
                        break;
                    case 0x11:
                        smfHeader.m_pm_ad_msgid = 0; //No support
                        break;
                    case 0x12:
                        smfHeader.m_pm_ad_prevmsgid = 0; //No support
                        break;
                    case 0x13:
                        smfHeader.m_pm_ad_redelflag = true;
                        break;
                    case 0x14:
                        smfHeader.m_pm_ad_ttl = 0; //AD unsupported
                        break;
                    case 0x16:
                        smfHeader.m_pm_content_summary = this.ParamParse.parseContentSummary(data, pos, prm_valueLen);
                        break;
                    case 0x17:
                        smfHeader.m_pm_ad_flowid = 0; // AD unsupported
                        break;
                    case 0x18:
                        // copy bytes but strip null-terminator (last byte)
                        smfHeader.m_pm_tr_topicname_bytes = data.substr(pos, prm_valueLen - 1);
                        break;
                    case 0x19:
                        smfHeader.m_pm_ad_flowredelflag = true;
                        break;

                } // end param type switch block
                pos += prm_valueLen;
            } // end (regular param)
        } // end while
        return smfHeader;
    };


    // ParamParse module
    solace.smf.Codec.ParamParse = (function() {
        // private data
        var LUT_delModeToEnum = (function() {
            var lut = [];
            lut[0x00] = solace.MessageDeliveryModeType.NON_PERSISTENT;
            lut[0x01] = solace.MessageDeliveryModeType.PERSISTENT;
            lut[0x02] = solace.MessageDeliveryModeType.DIRECT;
            return lut;
        }());
        var LUT_enumToDelMode = (function() {
            var lut = [];
            lut[solace.MessageDeliveryModeType.NON_PERSISTENT] = solace.Convert.int8ToStr(0x00);
            lut[solace.MessageDeliveryModeType.PERSISTENT] = solace.Convert.int8ToStr(0x01);
            lut[solace.MessageDeliveryModeType.DIRECT] = solace.Convert.int8ToStr(0x02);
            return lut;
        }());

        // public members: can be called to encode/decode SMF parameters
        return {
            parseTopicQueueOffsets: function(data, offset) {
                var result = [];
                result[0] = solace.Convert.strToInt8(data.substr(offset, 1));
                result[1] = solace.Convert.strToInt8(data.substr(offset + 1, 1));
                return result;
            },
            parseResponseParam: function(data, offset, param_len) {
                var result = [];
                result[0] = solace.Convert.strToInt32(data.substr(offset, 4));
                var resp_string_len = param_len - 4;
                if (resp_string_len > 0) {
                    result[1] = data.substr(offset + 4, resp_string_len);
                }
                else {
                    result[1] = "";
                }
                return result;
            },
            parseDeliveryMode: function(data, offset) {
                var delmode = solace.Convert.strToInt8(data.substr(offset, 1));
                return LUT_delModeToEnum[delmode] || solace.MessageDeliveryModeType.DIRECT;
            },
            encDeliveryMode: function(delmode) {
                var lut = LUT_enumToDelMode;
                return lut[delmode] || lut[solace.MessageDeliveryModeType.DIRECT];
            },
            ContentSummaryType: {
                // the type in here matches the SMF encoding value
                XML_META: 0,
                XML_PAYLOAD: 1,
                BINARY_ATTACHMENT: 2,
                CID_LIST: 3,
                BINARY_METADATA: 4
            },
            ContentSummaryElement: function() {
                this.Type = null;
                this.Position = 0;
                this.Length = 0;
            },
            parseContentSummary: function(data, offset, length) {
                var elements = [];
                var cumul_size = 0;
                var pos = offset;
                while (pos < offset + length) {
                    var byte1 = solace.Convert.strToInt8(data.substr(pos, 1));
                    var elem_type = bits(byte1, 4, 4);
                    var elem_decl_length = bits(byte1, 0, 4);
                    var elem_size = 0;
                    switch (elem_decl_length) {
                        case 2:
                            elem_size = solace.Convert.strToInt8(data.substr(pos + 1, 1));
                            break;
                        case 3:
                            elem_size = solace.Convert.strToInt16(data.substr(pos + 1, 2));
                            break;
                        case 4:
                            elem_size = solace.Convert.strToInt24(data.substr(pos + 1, 3));
                            break;
                        case 5:
                            elem_size = solace.Convert.strToInt32(data.substr(pos + 1, 4));
                            break;
                    }
                    pos += elem_decl_length;
                    var cur_element = new this.ContentSummaryElement();
                    cur_element.Position = cumul_size;
                    cur_element.Length = elem_size;
                    cumul_size += elem_size;
                    switch (elem_type) {
                        case 0:
                            cur_element.Type = this.ContentSummaryType.XML_META;
                            break;
                        case 1:
                            cur_element.Type = this.ContentSummaryType.XML_PAYLOAD;
                            break;
                        case 2:
                            cur_element.Type = this.ContentSummaryType.BINARY_ATTACHMENT;
                            break;
                        case 3:
                            cur_element.Type = this.ContentSummaryType.CID_LIST;
                            break;
                        case 4:
                            cur_element.Type = this.ContentSummaryType.BINARY_METADATA;
                            break;
                    }
                    elements.push(cur_element);
                } // end while loop
                return elements;
            },
            encContentSummary: function(cs_array) {
                var msg_element_descriptions = [];
                for (var i = 0; i < cs_array.length; i++) {
                    // a ContentSummaryElement
                    var cur_cs = cs_array[i];
                    var cur_sz = "";
                    var firstByte = 0;
                    firstByte = setBits(firstByte, cur_cs.Type, 4, 4);
                    if (cur_cs.Length <= 255) {
                        // element length: 2
                        firstByte = setBits(firstByte, 2, 0, 4);
                        cur_sz = solace.Convert.int8ToStr(cur_cs.Length);
                    } else if (cur_cs.Length <= 65535) {
                        firstByte = setBits(firstByte, 3, 0, 4);
                        cur_sz = solace.Convert.int16ToStr(cur_cs.Length);
                    } else if (cur_cs.Length <= 16777215) {
                        firstByte = setBits(firstByte, 4, 0, 4);
                        cur_sz = solace.Convert.int24ToStr(cur_cs.Length);
                    } else {
                        firstByte = setBits(firstByte, 5, 0, 4);
                        cur_sz = solace.Convert.int32ToStr(cur_cs.Length);
                    }
                    msg_element_descriptions.push(solace.Convert.int8ToStr(firstByte));
                    msg_element_descriptions.push(cur_sz);
                }
                return msg_element_descriptions.join("");
            },
            encSmfParam: function(uh, paramtype, value) {
                var data = [];
                var byte1 = 0;
                var byte2 = 0;
                byte1 = setBits(byte1, uh, 6, 2);
                byte1 = setBits(byte1, paramtype, 0, 5);
                data.push(solace.Convert.int8ToStr(byte1));
                if (value.length <= 253) {
                    byte2 = value.length + 2; // full length of param
                    data.push(solace.Convert.int8ToStr(byte2));
                } else {
                    byte2 = 0; // extended-length
                    data.push(solace.Convert.int8ToStr(byte2));
                    data.push(solace.Convert.int32ToStr(value.length + 6));
                }
                data.push(value);
                return data.join("");
            },
            encLightSmfParam: function(uh, paramtype, value) {
                var data = [];
                var byte1 = 0;
                byte1 = setBits(byte1, uh, 6, 2);
                byte1 = setBits(byte1, 1, 5, 1);
                byte1 = setBits(byte1, paramtype, 2, 3);
                byte1 = setBits(byte1, value.length, 0, 2);
                data.push(solace.Convert.int8ToStr(byte1));
                data.push(value);
                return data.join("");
            }

        };
    }());

    solace.smf.Codec.encSmf = function(message) {
        var output = [];

        // First 4 bytes: protocol, ttl, etc
        var w1 = 0;

        // every set is guarded to check for undefined
        if (message.m_smf_di) {
            w1 = setBits(w1, message.m_smf_di, 31, 1);
        }
        if (message.m_smf_elidingeligible) {
            w1 = setBits(w1, message.m_smf_elidingeligible, 30, 1);
        }
        if (message.m_smf_dto) {
            w1 = setBits(w1, message.m_smf_dto, 29, 1);
        }
        if (message.m_smf_adf) {
            w1 = setBits(w1, message.m_smf_adf, 28, 1);
        }
        if (message.m_smf_version) {
            w1 = setBits(w1, message.m_smf_version,  24, 3);
        }
        if (message.m_smf_uh) {
            w1 = setBits(w1, message.m_smf_uh, 22, 2);
        }
        if (message.m_smf_protocol) {
            w1 = setBits(w1, message.m_smf_protocol, 16, 6);
        }
        if (message.m_smf_priority) {
            w1 = setBits(w1, message.m_smf_priority, 12, 4);
        }
        if (message.m_smf_ttl) {
            w1 = setBits(w1, message.m_smf_ttl, 0, 8);
        }

        var paramspace = [];
        // Encode all standard SMF parameters
        // Topic name and queue/topic offsets are supposed to come first
        if (message.m_pm_tr_topicname_bytes) {
            paramspace.push(
                    solace.smf.Codec.ParamParse.encSmfParam(2, 0x18, message.m_pm_tr_topicname_bytes + "\u0000"));
        }
        var tmptwobytes = 0;
        if (message.m_pm_queue_len) {
            tmptwobytes = 0;
            tmptwobytes = setBits(tmptwobytes, message.m_pm_queue_offset, 8, 8);
            tmptwobytes = setBits(tmptwobytes, message.m_pm_queue_len, 0, 8);
            paramspace.push(
                    solace.smf.Codec.ParamParse.encLightSmfParam(
                            0,
                            0x02,
                            solace.Convert.int16ToStr(tmptwobytes)));
        }
        if (message.m_pm_topic_len) {
            tmptwobytes = 0;
            tmptwobytes = setBits(tmptwobytes, message.m_pm_topic_offset, 8, 8);
            tmptwobytes = setBits(tmptwobytes, message.m_pm_topic_len, 0, 8);
            paramspace.push(
                    solace.smf.Codec.ParamParse.encLightSmfParam(
                            0,
                            0x01,
                            solace.Convert.int16ToStr(tmptwobytes)));
        }
        if (message.m_pm_corrtag !== null) {
            paramspace.push(
                    solace.smf.Codec.ParamParse.encLightSmfParam(
                            0,
                            0x00,
                            solace.Convert.int24ToStr(message.m_pm_corrtag)));
        }
        if (message.m_pm_msg_priority !== null) {
            paramspace.push(
                    solace.smf.Codec.ParamParse.encSmfParam(
                            0,
                            0x03,
                            solace.Convert.int8ToStr(message.m_pm_msg_priority)));
        }
        if (message.m_pm_userdata !== null && message.m_pm_userdata !== "") {
            paramspace.push(
                    solace.smf.Codec.ParamParse.encSmfParam(
                            0,
                            0x04,
                            message.m_pm_userdata));
        }
        if (message.m_pm_username) {
            //do a sloppy base64 (no newlines)
            var username_b64 = solace.base64_encode(message.m_pm_username);
            paramspace.push(
                    solace.smf.Codec.ParamParse.encSmfParam(
                            0,
                            0x06,
                            username_b64));
        }
        if (message.m_pm_password) {
            //do a sloppy base64 (no newlines)
            var passw_b64 = solace.base64_encode(message.m_pm_password);
            paramspace.push(
                    solace.smf.Codec.ParamParse.encSmfParam(
                            0,
                            0x07,
                            passw_b64));
        }
        if (message.m_pm_respcode) {
            // not useful SDK->ROUTER
            var resp = solace.Convert.int32ToStr(message.m_pm_respcode);
            resp += message.m_pm_respstr;
            paramspace.push(
                    solace.smf.Codec.ParamParse.encSmfParam(0, 0x08, resp));
        }
        if (message.m_pm_deliverymode !== null) {
            paramspace.push(
                    solace.smf.Codec.ParamParse.encSmfParam(
                            0,
                            0x10,
                            solace.smf.Codec.ParamParse.encDeliveryMode(message.m_pm_deliverymode)));
        }
        if (message.m_pm_ad_flowid ||
                message.m_pm_ad_flowredelflag ||
                message.m_pm_ad_msgid ||
                message.m_pm_ad_prevmsgid ||
                message.m_pm_ad_redelflag ||
                message.m_pm_ad_ttl) {
            // don't care: AD parameters
        }
        if (message.m_pm_content_summary) {
            paramspace.push(
                    solace.smf.Codec.ParamParse.encSmfParam(
                            2,
                            0x16,
                            solace.smf.Codec.ParamParse.encContentSummary(message.m_pm_content_summary)));
        }
        // done common SMF parameters!

        // compute header size and full message size
        var encodedParams = paramspace.join("");
        var hdrlen = 12 + encodedParams.length;
        var msglen = hdrlen + message.m_payloadLength;
        output.push(solace.Convert.int32ToStr(w1));
        output.push(solace.Convert.int32ToStr(hdrlen));
        output.push(solace.Convert.int32ToStr(msglen));
        output.push(encodedParams);
        message.setMessageSizes(hdrlen, message.m_payloadLength);

        return output.join("");
    };


// ========== SMP ==========
    solace.smf.Codec.Smp = {
        parseSmpAt: function(data, offset) {
            if ((offset + 8) > data.length) {
                //not enough data
                SOLACE_CONSOLE_DEBUG("Not enough data to read an SMP message.");
                return false;
            }
            var pos = offset;
            var onebyte = solace.Convert.strToInt8(data.substr(pos, 1));
            pos++;
            var msgUh = bits(onebyte, 7, 1);
            var msgType = bits(onebyte, 0, 7);
            var smpMsg = new solace.smf.SMPMessage();

            if (msgType === 0x00 || msgType === 0x01) {
                var msgLength = solace.Convert.strToInt32(data.substr(pos, 4));
                pos += 4;
                if ((offset + msgLength) > data.length) {
                    //not enough data
                    SOLACE_CONSOLE_DEBUG("Invalid declared length of " + msgLength + ", unable to read SMP message.");
                    return false;
                }
                var msgFlags = solace.Convert.strToInt8(data.substr(pos, 1));
                pos++;

                smpMsg.MsgType = msgType;
                smpMsg.SmpFlags = msgFlags;
                smpMsg.EncodedUtf8Subscription = data.substr(pos, msgLength - 6); //6 is the base len
                return smpMsg;
            } else {
                SOLACE_CONSOLE_DEBUG("Found unsupported SMP messageType " + msgType);
                return false; //unsupported type
            }
        },
        encSmp: function(smpMsg) {
            if (!(smpMsg.MsgType === 0x00 || smpMsg.MsgType === 0x01)) {
                SOLACE_CONSOLE_DEBUG("Unsupported SMP message for encoding: " + smpMsg);
                return false;
            }
            var data = [];
            var onebyte = 0;
            onebyte = setBits(onebyte, 1, 7, 1);
            onebyte = setBits(onebyte, smpMsg.MsgType, 0, 7);
            data.push(solace.Convert.int8ToStr(onebyte));
            data.push(solace.Convert.int32ToStr(6 + smpMsg.EncodedUtf8Subscription.length)); //length
            data.push(solace.Convert.int8ToStr(smpMsg.SmpFlags));
            data.push(smpMsg.EncodedUtf8Subscription);

            return data.join("");
        }
    };

    // ========== END SMP ==========

    // ========== CLIENT CTRL ==========
    solace.smf.Codec.ClientCtrl = {
        parseCCAt: function(data, offset, payloadLen) {
            var ccMsg = new solace.smf.ClientCtrlMessage();
            if (payloadLen < 6 || offset + 6 > data.length) {
                // not enough data! Return empty.
                // This is required because we can get an empty CC payload as a router response
                return ccMsg;
            }
            var pos = offset;
            var twobytes = solace.Convert.strToInt16(data.substr(pos, 2));
            pos += 2;
            var uh = bits(twobytes, 15, 1);
            var version = bits(twobytes, 8, 3);
            var msgType = bits(twobytes, 0, 8);
            var len = solace.Convert.strToInt32(data.substr(pos, 4));
            pos += 4;

            // Sanity check: we support ClientCtrl v1
            if (version !== 1) {
                return false;
            }
            if (len <= 0 || (offset + len) > data.length) {
                return false;
            }

            ccMsg.MsgType = msgType;
            ccMsg.Version = version;
            while(pos < (offset + len)) {
                var onebyte = solace.Convert.strToInt8(data.substr(pos, 1));
                pos++;
                var prm_uh = bits(onebyte, 7, 1);
                var prm_type = bits(onebyte, 0, 7);
                var prm_len = solace.Convert.strToInt32(data.substr(pos, 4));
                if (prm_len <= 0) {
                    return false; // SMF parsing fail
                }
                pos += 4;
                var prm_valueLen = prm_len - 5;
                var prm_value = data.substr(pos, prm_valueLen);
                ccMsg.addParameter(new solace.smf.SMFParameter(prm_uh, prm_type, prm_value));
                pos += prm_valueLen;
            }
            return ccMsg;
        },
        encCC: function(ccMsg) {
            var paramspace = [];
            var paramarray = ccMsg.getParameterArray();
            /*
            ClientCtrl Parameter formatting:
                1 byte uh/type
                4 bytes length
                N bytes value
             */
            for( var p=0; p < paramarray.length; p++ ) {
                var cur_p = paramarray[p];
                // It's not a flat array, we have gaps!
                if (cur_p === undefined) {
                    continue;
                }
                var cur_p_onebyte = 0;
                cur_p_onebyte = setBits(cur_p_onebyte, cur_p.getUh(), 7, 1);
                cur_p_onebyte = setBits(cur_p_onebyte, cur_p.getType(), 0, 7);
                paramspace.push(solace.Convert.int8ToStr(cur_p_onebyte));
                paramspace.push(solace.Convert.int32ToStr(cur_p.getValue().length + 5));
                paramspace.push(cur_p.getValue());
            }
            var paramdata = paramspace.join("");

            var twobytes = 0;
            twobytes = setBits(twobytes, 0, 15, 1); // uh
            twobytes = setBits(twobytes, 0, 11, 4); // RFU
            twobytes = setBits(twobytes, 1, 8, 3); // version
            twobytes = setBits(twobytes, ccMsg.MsgType, 0, 8); // msgtype
            var data = [];
            data.push(solace.Convert.int16ToStr(twobytes)); // first 2B (uh, version, msgtype)
            data.push(solace.Convert.int32ToStr(6 + paramdata.length)); //length: 6B header + params
            data.push(paramdata);
            return data.join("");
        }
    };
    // ========== END CLIENT CTRL ==========

    // ========== TSSMF ==========
    function remains(data, offset) { return data.length - offset; }
    
    solace.smf.Codec.TsSmf = {
        parseTsSmfAt: function(data, offset, smfheader) {
            var pos = offset;
            if (remains(data, pos) < 10) {
                SOLACE_CONSOLE_ERROR("TsSmf parse failed: not enough data, expected at least 10B");
                return false;
            }
            var ts_msg = new solace.TransportSmfMessage();
            ts_msg.setSmfHeader(smfheader);
            var twobyte = solace.Convert.strToInt16(data.substr(pos, 2));
            pos +=2;
            ts_msg.UH = bits(twobyte, 15, 1);
            ts_msg.MessageType = bits(twobyte, 8, 7);
            var tsHdrLen = bits(twobyte, 0, 8);
            ts_msg.SessionId = data.substr(pos, 8);
            pos += 8;

            if (ts_msg.MessageType === 1) {
                // parse extra chunk: routerTag
                var rtrTagLen = solace.Convert.strToInt8(data.substr(pos, 1));
                pos++;
                if (remains(data, pos) < rtrTagLen) {
                    SOLACE_CONSOLE_ERROR("TsSmf parse failed: not enough data for RouterTag, expected " + rtrTagLen + "B");
                    return false;
                }
                ts_msg.RouterTag = data.substr(pos, rtrTagLen);
                pos += rtrTagLen;
            }

            //FFWD any remaining TsSmf padding?
            pos = offset + tsHdrLen;

            // Length of encapsulated message payload:
            // the SMF msg payload length - bytes consumed in TsSmf
            var payloadLen = smfheader.m_payloadLength - tsHdrLen;
            if (remains(data, pos) < payloadLen) {
                SOLACE_CONSOLE_ERROR("Couldn't read full encapsulated TsSmf payload, expected " + payloadLen + "B");
                return false;
            }
            ts_msg.Payload = data.substr(pos, payloadLen);
            return ts_msg;
        }
    };
    // ========== END TSSMF ==========

    var LUT_userCosForPriority = (function() {
        var arr = [];
        arr[0] = solace.MessageUserCosType.COS1;
        arr[1] = solace.MessageUserCosType.COS2;
        arr[2] = solace.MessageUserCosType.COS3;
        return arr;
    }());

    function getUserCos(priority_value) {
        return LUT_userCosForPriority[priority_value] || solace.MessageUserCosType.COS1;
    }

    var LUT_priorityForUserCos = (function() {
        var arr = [];
        arr[solace.MessageUserCosType.COS1] = 0;
        arr[solace.MessageUserCosType.COS2] = 1;
        arr[solace.MessageUserCosType.COS3] = 2;
        return arr;
    }());

    function getSmfPriorityFromUserCos(userCos) {
        return LUT_priorityForUserCos[userCos] || 0;
    }

    function adaptBinaryMetaToMessage(binmeta, message) {
        var messageSdt = solace.sdt.Codec.parseSdt(binmeta.Payload, 0);
        if (messageSdt && messageSdt.getType() === solace.SDTFieldType.STREAM) {
            var sdtstream = messageSdt.getValue();
            var sdtfield = sdtstream.getNext();
            if (sdtfield && sdtfield.getType() === solace.SDTFieldType.BYTEARRAY) {
                // Preamble byte array is present
                var preambleByte0 = sdtfield.getValue().charCodeAt(0) & 0xFF;
                if ((preambleByte0 & 0x80) === 0) {
                    // structured message: override default "BIN" message type
                    var structypes = {
                        0x0A: solace.MessageType.MAP,
                        0x0B: solace.MessageType.STREAM,
                        0x07: solace.MessageType.TEXT};
                    message.m_messageType = structypes[preambleByte0 & 0x0F] || solace.MessageType.BINARY;
                }
                if (sdtfield.getValue().length >= 1) {
                    var preambleByte1 = sdtfield.getValue().charCodeAt(1) & 0xFF;
                    message.setAsReplyMessage((preambleByte1 & 0x80) !== 0);
                }
            }
            sdtfield = sdtstream.getNext();
            if (sdtfield && sdtfield.getType() === solace.SDTFieldType.MAP) {
                var sdtmap = sdtfield.getValue();
                if (sdtmap.getField("p")) {
                    var userpropmap = sdtmap.getField("p").getValue();
                    message.setUserPropertyMap(userpropmap);
                }
                if (sdtmap.getField("h")) {
                    var headermap = sdtmap.getField("h").getValue();
                    if (headermap.getField("ci")) {
                        message.setCorrelationId(headermap.getField("ci").getValue());
                    }
                    if (headermap.getField("mi")) {
                        message.setApplicationMessageId(headermap.getField("mi").getValue());
                    }
                    if (headermap.getField("mt")) {
                        message.setApplicationMessageType(headermap.getField("mt").getValue());
                    }
                    if (headermap.getField("rt")) {
                        message.setReplyTo(headermap.getField("rt").getValue());
                    }
                    if (headermap.getField("si")) {
                        message.setSenderId(headermap.getField("si").getValue());
                    }
                    if (headermap.getField("sn")) {
                        message.setSequenceNumber(headermap.getField("sn").getValue());
                    }
                    if (headermap.getField("ts")) {
                        message.setSenderTimestamp(headermap.getField("ts").getValue());
                    }
                }
            }
        }
    }

    function adaptMessageToBinaryMeta(message) {
        // solace header map
        var headermap = new solace.SDTMapContainer();
        function addToMapIfPresent(key, type, value_fn) {
            // if the getter function value_fn returns something add it to hmap
            var value = value_fn();
            if (value !== undefined && value !== null) {
                headermap.addField(key, solace.SDTField.create(type, value));
            }
        }
        addToMapIfPresent("ci", solace.SDTFieldType.STRING, function() { return message.getCorrelationId(); });
        addToMapIfPresent("mi", solace.SDTFieldType.STRING, function() { return message.getApplicationMessageId(); });
        addToMapIfPresent("mt", solace.SDTFieldType.STRING, function() { return message.getApplicationMessageType(); });
        addToMapIfPresent("rt", solace.SDTFieldType.DESTINATION, function() { return message.getReplyTo(); });
        addToMapIfPresent("si", solace.SDTFieldType.STRING, function() { return message.getSenderId(); });
        addToMapIfPresent("sn", solace.SDTFieldType.INT64, function() { return message.getSequenceNumber(); });
        addToMapIfPresent("ts", solace.SDTFieldType.INT64, function() { return message.getSenderTimestamp(); });

        // container map: solace headers + user prop map
        var sdtMap = new solace.SDTMapContainer();
        if (message.getUserPropertyMap()) {
            sdtMap.addField("p", solace.SDTField.create(solace.SDTFieldType.MAP,  message.getUserPropertyMap()));
        }
        if (headermap.getKeys().length > 0) {
            sdtMap.addField("h", solace.SDTField.create(solace.SDTFieldType.MAP,  headermap));
        }

        var enc_sdtpayload = null;
        var preamble_b0 = 0;
        switch(message.getType()) {
            case solace.MessageType.BINARY:
                preamble_b0 |= 0x80;
                break;
            case solace.MessageType.MAP:
                preamble_b0 |= 0x0A;
                enc_sdtpayload = solace.sdt.Codec.encodeSdt(message.m_structuredContainer);
                if (enc_sdtpayload) {
                    message.setBinaryAttachment(enc_sdtpayload);
                }
                break;
            case solace.MessageType.STREAM:
                preamble_b0 |= 0x0B;
                enc_sdtpayload = solace.sdt.Codec.encodeSdt(message.m_structuredContainer);
                if (enc_sdtpayload) {
                    message.setBinaryAttachment(enc_sdtpayload);
                }
                break;
            case solace.MessageType.TEXT:
                preamble_b0 |= 0x07;
                enc_sdtpayload = solace.sdt.Codec.encodeSdt(message.m_structuredContainer);
                if (enc_sdtpayload) {
                    message.setBinaryAttachment(enc_sdtpayload);
                }
                break;
        }
        var preamble_b1 = 0;
        if (message.isReplyMessage()) {
            preamble_b1 |= 0x80;
        }
        var sdtPreamble = solace.SDTField.create(solace.SDTFieldType.BYTEARRAY, String.fromCharCode(preamble_b0, preamble_b1));

        // Putting it all together: a stream with the preamble and map
        var sdtStreamContainer = new solace.SDTStreamContainer();
        sdtStreamContainer.addField(sdtPreamble);
        sdtStreamContainer.addField(solace.SDTField.create(solace.SDTFieldType.MAP, sdtMap));

        var binmeta = new solace.smf.BinaryMetaBlock();
        binmeta.Type = 0;
        binmeta.Payload = solace.sdt.Codec.encodeSdt(solace.SDTField.create(solace.SDTFieldType.STREAM, sdtStreamContainer));
        message.setBinaryMetadataChunk(binmeta);
    }

    function adaptSmfToMessage(smfHeader, message, stream, offset) {
        message.setDeliverToOne(smfHeader.m_smf_dto ? true : false);
        message.setDeliveryMode(smfHeader.m_pm_deliverymode || solace.MessageDeliveryModeType.DIRECT);
        message.setDestination(new solace.Topic(smfHeader.m_pm_tr_topicname_bytes));
        message.setDiscardIndication(smfHeader.m_smf_di ? true : false);
        message.setElidingEligible(smfHeader.m_smf_elidingeligible ? true : false);
        message.setUserCos(getUserCos(smfHeader.m_smf_priority));
        message.setUserData(smfHeader.m_pm_userdata ? smfHeader.m_pm_userdata : null);
        message.m_redelivered = smfHeader.m_pm_ad_redelflag ? true : false;

        // Copy content into fields (from input bytes)
        var payload_offset = offset + smfHeader.m_headerLength;
        var cs = smfHeader.m_pm_content_summary;
        var CSType = solace.smf.Codec.ParamParse.ContentSummaryType;
        if (cs && cs.length > 0) {
            for(var i = 0; i < cs.length; i++) {
                var cur_chunk = cs[i];
                var chunk_data = stream.substr(payload_offset + cur_chunk.Position, cur_chunk.Length);
                if (cur_chunk.Type === CSType.BINARY_ATTACHMENT) {
                    message.setBinaryAttachment(chunk_data);
                } else if (cur_chunk.Type === CSType.BINARY_METADATA) {
                    var binmeta = solace.smf.BinaryMetaBlock.fromEncodedSmf(chunk_data, 0);
                    message.setBinaryMetadataChunk(binmeta);
                    if (binmeta.Type === 0) {
                        // we have SDT JMS metadata
                        adaptBinaryMetaToMessage(binmeta, message);
                    }
                } else if (cur_chunk.Type === CSType.CID_LIST) {
                    // Ignore! No support for CID
                } else if (cur_chunk.Type === CSType.XML_META) {
                    message.setXmlMetadata(chunk_data);
                } else if (cur_chunk.Type === CSType.XML_PAYLOAD) {
                    message.setXmlContent(chunk_data);
                }
            }
        } else {
            // No content-summary, assume binary attachment
            message.setBinaryAttachment(smfHeader.m_payloadLength > 0 ? stream.substr(payload_offset, smfHeader.m_payloadLength) : null);
        }
    }

    function addContentElementToCsArray(cs_array, payload_arr, data_chunk, cstype) {
        if (typeof data_chunk !== "undefined" &&
                data_chunk !== null &&
                data_chunk.length > 0) {
            var cse = new solace.smf.Codec.ParamParse.ContentSummaryElement();
            cse.Type = cstype;
            cse.Length = data_chunk.length;
            cs_array.push(cse);
            payload_arr.push(data_chunk);
        }
    }

    function adaptMessageToSmf(message, smfHeader) {
        smfHeader.m_smf_dto = message.isDeliverToOne() ? true : false;
        smfHeader.m_pm_deliverymode = message.getDeliveryMode();
        smfHeader.m_smf_di = message.isDiscardIndication() ? true : false;
        smfHeader.m_smf_elidingeligible = message.isElidingEligible() ? true : false;

        var dest = message.getDestination();
        if (dest !== null && dest instanceof solace.Topic) {
            smfHeader.m_pm_tr_topicname_bytes = dest.getName();
        }

        // Setup user properties, header properties, msgtype
        if (message.getCorrelationId() ||
                message.getApplicationMessageId() ||
                message.getApplicationMessageType() ||
                message.getReplyTo() ||
                message.getSenderId() ||
                message.getSequenceNumber() ||
                message.getSenderTimestamp() ||
                message.getUserPropertyMap() ||
                message.isReplyMessage() ||
                (message.getType() !== solace.MessageType.BINARY)) {
            // add SDT binary metadata
            adaptMessageToBinaryMeta(message);
        }
        
        smfHeader.m_smf_priority = getSmfPriorityFromUserCos(message.getUserCos());
        smfHeader.m_pm_userdata = message.getUserData() === null ? null : message.getUserData();

        // Build array of ContentSummaryElements
        var CSType = solace.smf.Codec.ParamParse.ContentSummaryType;
        var cs_array = [];
        var payload = [];
        addContentElementToCsArray(cs_array, payload, message.getXmlMetadata(), CSType.XML_META);
        addContentElementToCsArray(cs_array, payload, message.getXmlContent(), CSType.XML_PAYLOAD);
        addContentElementToCsArray(cs_array, payload, message.getBinaryAttachment(), CSType.BINARY_ATTACHMENT);
        var binmeta = null;
        if ((binmeta = message.getBinaryMetadataChunk()) !== null) {
            var binmeta_smf = binmeta.asEncodedSmf();
            addContentElementToCsArray(cs_array, payload, binmeta_smf, CSType.BINARY_METADATA);
        }
        if (cs_array.length === 0 || (cs_array.length === 1 && cs_array[0].Type === CSType.BINARY_ATTACHMENT)) {
            // NULL or RAW payload (no content-summary)
        } else {
            smfHeader.m_pm_content_summary = cs_array;
        }
        var payload_bytes = payload.join("");
        smfHeader.m_payload = payload_bytes;
        smfHeader.setPayloadSize(payload_bytes.length);
    }

    solace.smf.Codec.decodeCompoundMessage = function(data, pos) {
        var smfheader = solace.smf.Codec.parseSmfAt(data, pos);
        if (smfheader) {
            // the parser determined there was a full SMF message
            var payload_position = pos + smfheader.m_headerLength;
            var payload_len = smfheader.m_payloadLength;
            switch (smfheader.m_smf_protocol) {
                case 0x14:
                    var tsmsg = solace.smf.Codec.TsSmf.parseTsSmfAt(data, payload_position, smfheader);
                    if (tsmsg) {
                        tsmsg.setSmfHeader(smfheader);
                        return tsmsg;
                    }
                    break;
                case 0x0d:
                    var pubmsg = new solace.Message();
                    pubmsg.m_smfHeader = smfheader;
                    adaptSmfToMessage(smfheader, pubmsg, data, pos);
                    return pubmsg;
                case 0x0c:
                    var cc = solace.smf.Codec.ClientCtrl.parseCCAt(data, payload_position, payload_len);
                    if (cc) {
                        cc.setSmfHeader(smfheader);
                        return cc;
                    }
                    break;
                case 0x0f:
                    var smp = solace.smf.Codec.Smp.parseSmpAt(data, payload_position);
                    if (smp) {
                        smp.setSmfHeader(smfheader);
                        return smp;
                    }
                    break;
                case 0x0a:
                case 0x0b:
                    var keepalive = new solace.smf.KeepAliveMessage();
                    keepalive.setSmfHeader(smfheader);
                    return keepalive;
                default:
                    SOLACE_CONSOLE_INFO("Unknown protocol: " + smfheader.m_smf_protocol);
                    break;
            }
        }
        else {
            SOLACE_CONSOLE_INFO("Smfheader not available: " + smfheader);
        }
        return null;
    };
    
    solace.smf.Codec.encodeCompoundMessage = function(msg){
        var payload = [], header = [];
        if (msg instanceof solace.smf.ClientCtrlMessage) {
            payload = solace.smf.Codec.ClientCtrl.encCC(msg);
            msg.getSmfHeader().setPayloadSize(payload.length);
            header = solace.smf.Codec.encSmf(msg.getSmfHeader());
        } else if (msg instanceof solace.smf.SMPMessage) {
            payload = solace.smf.Codec.Smp.encSmp(msg);
            msg.getSmfHeader().setPayloadSize(payload.length);
            header = solace.smf.Codec.encSmf(msg.getSmfHeader());
        } else if (msg instanceof solace.smf.KeepAliveMessage) {
            msg.getSmfHeader().setPayloadSize(0);
            header = solace.smf.Codec.encSmf(msg.getSmfHeader());
        } else if (msg instanceof solace.Message) {
            if (msg.m_smfHeader === null) {
                var newheader = new solace.smf.SMFHeader();
                newheader.m_smf_protocol = 0x0d;
                newheader.m_smf_ttl = 255;
                msg.m_smfHeader = newheader;
            }
            adaptMessageToSmf(msg, msg.m_smfHeader);
            payload = msg.m_smfHeader.m_payload;
            header = solace.smf.Codec.encSmf(msg.m_smfHeader);
        }
        return header + payload;
    };

}(solace));
//
/*global solace:true window console BlobBuilder ArrayBuffer Uint8Array SOLACE_FATAL SOLACE_ERROR SOLACE_WARN SOLACE_INFO SOLACE_DEBUG SOLACE_TRACE SOLACE_CONSOLE_FATAL SOLACE_CONSOLE_ERROR SOLACE_CONSOLE_WARN SOLACE_CONSOLE_INFO SOLACE_CONSOLE_DEBUG SOLACE_CONSOLE_TRACE */
// 
// 

(function(solace) {
    solace.smf = solace.smf || {};

    // import bit twiddling functions
    var bits = solace.smf.Codec.bits;
    var setBits = solace.smf.Codec.setBits;

    /**
     * Base class for headers containing parameters
     * @constructor
     */
    function BaseMessage() {
        this.m_parameters = [];
        this.m_smfHeader = null;
    }
    BaseMessage.prototype.addParameter = function(param){
        this.m_parameters[param.getType()] = param;
    };
    BaseMessage.prototype.getParameter = function(paramType){
        return this.m_parameters[paramType];
    };
    BaseMessage.prototype.getParameterArray = function(){
        if (this.m_parameters === undefined) {
            return false;
        }
        return this.m_parameters;
    };
    BaseMessage.prototype.getSmfHeader = function() {
        return this.m_smfHeader;
    };
    BaseMessage.prototype.setSmfHeader = function(smfh) {
        this.m_smfHeader = smfh;
    };

    BaseMessage.prototype.getResponse = function() {
        var smf = this.getSmfHeader();
        if (smf && smf.m_pm_respcode && smf.m_pm_respstr) {
            return {ResponseCode: smf.m_pm_respcode, ResponseString: smf.m_pm_respstr};
        } else {
            return null;
        }
    };

    /**
     * Control messages wrap an SMFHeader instance
     * @constructor
     */
    function SMFHeader(){
        // header properties
        // header block
        // SMF parameters
        // payload
        this.m_parameters = []; //override parent

        // Common SMF header field values
        this.m_smf_version = 3;
        this.m_smf_uh = 0;
        this.m_smf_protocol = 0;
        this.m_smf_priority = 0;
        this.m_smf_ttl = 0;
        this.m_smf_msgLen = 0;
        this.m_smf_di = 0;
        this.m_smf_tqd = 0;
        this.m_smf_elidingeligible = 0;
        this.m_smf_dto = 0;
        this.m_smf_adf = 0; //AD (unused)
        // Common SMF protocol parameters
        this.m_pm_userdata = null;
        this.m_pm_respcode = 0;
        this.m_pm_respstr = null;
        this.m_pm_username = null;
        this.m_pm_password = null;
        this.m_pm_tr_topicname_bytes = null;
        this.m_pm_deliverymode = null;
        this.m_pm_ad_msgid = 0; //AD (unused)
        this.m_pm_ad_redelflag = 0; //AD (unused)
        this.m_pm_ad_flowredelflag = 0; //AD (unused)
        this.m_pm_ad_ttl = 0; //AD (unused)
        this.m_pm_content_summary = null;
        this.m_pm_corrtag = null;
        this.m_pm_topic_offset = 0;
        this.m_pm_topic_len = 0;
        this.m_pm_queue_offset = 0;
        this.m_pm_queue_len = 0;
        this.m_pm_ad_prevmsgid = 0; //AD (unused)
        this.m_pm_msg_priority = null; // A number, but 0 is allowed
        this.m_pm_ad_flowid = 0; //AD (unused)

        // housekeeping
        this.m_unknownProtoFlag = false;
        this.m_messageLength = 0;
        this.m_payloadLength = 0;
        this.m_headerLength = 0;
        this.m_payload = null;

    }
    //SMFHeader.prototype = new BaseMessage();
    SMFHeader.prototype.setMessageSizes = function(header_sz, payload_sz) {
        this.m_headerLength = header_sz;
        this.m_payloadLength = payload_sz;
        this.m_messageLength = header_sz + payload_sz;
    };
    SMFHeader.prototype.setPayloadSize = function(payload_sz) {
        this.m_payloadLength = payload_sz;
    };
    solace.smf.SMFHeader = SMFHeader;

    /**
     * @constructor
     */
    function SMFParameter(uh, type, value){
        this.m_type = type;
        this.m_value = value;
        this.m_uh = uh;
    }
    SMFParameter.prototype.getType = function(){
        return this.m_type;
    };
    SMFParameter.prototype.getValue = function(){
        return this.m_value;
    };
    SMFParameter.prototype.getUh = function(){
        return this.m_uh;
    };
    solace.smf.SMFParameter = SMFParameter;

    // Internal API use only.
    /**
     Represents a binary metadata block in a TrMsg
     @constructor
     */
    function BinaryMetaBlock() {
        this.Type = 0;
        this.Payload = "";
    }

    BinaryMetaBlock.prototype.asEncodedSmf = function() {
        var smf = [];
        smf.push(solace.Convert.int8ToStr(1));
        smf.push(solace.Convert.int8ToStr(this.Type));
        smf.push(solace.Convert.int24ToStr(this.Payload.length));
        smf.push(this.Payload);
        return smf.join("");
    };
    BinaryMetaBlock.fromEncodedSmf = function(strSmf, offset) {
        if (typeof offset === "undefined") {
            offset = 0;
        }
        if ((strSmf.length - offset) < 6) {
            return null; // not enough data
        }
        var chunkCount = solace.Convert.strToInt8(strSmf.substr(offset, 1));
        var fourbyte = solace.Convert.strToInt32(strSmf.substr(offset + 1, 4));
        var metaBlock = new BinaryMetaBlock();
        metaBlock.Type = bits(fourbyte, 24, 8);
        var payloadLen = bits(fourbyte, 0, 24);
        var payloadOffset = chunkCount * 4 + 1;
        metaBlock.Payload = strSmf.substr(offset + payloadOffset, payloadLen);
        return metaBlock;
    };
    solace.smf.BinaryMetaBlock = BinaryMetaBlock;

    /**
     * Represents an SMP request or reply message
     * @constructor
     */
    function SMPMessage(){
        this.m_smfHeader = new solace.smf.SMFHeader(); //override prototype's
        this.m_smfHeader.m_smf_protocol = 0x0f;
        this.m_smfHeader.m_smf_ttl = 1;

        // Field: msgtype
        this.MsgType = 0;

        // Field: subscription string
        this.EncodedUtf8Subscription = null;

        this.SmpFlags = (0 | 4); //default flags
        this.m_encodedQueueName = null; //unused in solclientjs
        this.m_encodedClientName = null; //unused in solclientjs
    }
    SMPMessage.prototype = new BaseMessage();
    SMPMessage.prototype.isFlag = function(flagMask){
        return (this.SmpFlags & flagMask);
    };
    SMPMessage.prototype.setFlag = function(flagMask, value){
        if (value) {
            this.SmpFlags |= flagMask;
        }
        else {
            this.SmpFlags &= (~ flagMask);
        }
    };
    SMPMessage.prototype.encodeTopic = function encodeTopic(topic) {
        this.EncodedUtf8Subscription = solace.Util.nullTerminate(topic);
    };

    /*
     Get an SMP add/remove topic subscription object.

     smfclient: the transport SMFClient object that tracks correlation tags
     topicObj: a string or solace.Destination representing the topic
     add: boolean - add or remove
     requestConfirm: boolean - whether to set the response required flag
     */
    SMPMessage.getSubscriptionMessage = function(correlationTag, topicObj, add, requestConfirm) {
        var topicString = "";
        if (typeof topicObj === "string") {
            topicString = topicObj;
        } else if (topicObj instanceof solace.Destination) {
            topicString = topicObj.getName();
        }
        var smp = new SMPMessage();
        smp.MsgType = add ? 0x00 : 0x01;
        smp.encodeTopic(topicString);
        smp.setFlag(4, true);
        if (requestConfirm) {
            smp.setFlag(8, true);
        }

        // Always put a correlation tag
        smp.m_smfHeader.m_pm_corrtag = correlationTag;
        return smp;
    };
    solace.smf.SMPMessage = SMPMessage;

    var ZERO = solace.Convert.int8ToStr(0);

    /**
     * Represents a ClientCtrl request or reply message
     * @constructor
     */
    function ClientCtrlMessage(){
        this.m_smfHeader = new solace.smf.SMFHeader(); //override prototype's
        this.m_smfHeader.m_smf_protocol = 0x0c;
        this.m_smfHeader.m_smf_ttl = 1;

        this.m_parameters = []; // override parent

        // Field: msgtype
        this.MsgType = 0;

        // Field: version
        this.Version = 1;
    }
    var CCM_proto = new BaseMessage();
    ClientCtrlMessage.prototype = CCM_proto;
    CCM_proto.getP2PTopicValue = function() {
        var p2pParam = null;
        if ((p2pParam = this.getParameter(0x08))) {
            return solace.Util.stripNullTerminate(p2pParam.getValue());
        }
        else {
            return null;
        }
    };

    CCM_proto.getVpnNameInUseValue = function() {
        var vpnParam = null;
        if ((vpnParam = this.getParameter(0x06))) {
            return solace.Util.stripNullTerminate(vpnParam.getValue());
        }
        else {
            return null;
        }
    };

    CCM_proto.getVridInUseValue = function() {
        var vridParam = null;
        if ((vridParam = this.getParameter(0x0a))) {
            return solace.Util.stripNullTerminate(vridParam.getValue());
        }
        else {
            return null;
        }
    };

    CCM_proto.getUserIdValue = function() {
        var userIdParam = null;
        if ((userIdParam = this.getParameter(0x03))) {
            return solace.Util.stripNullTerminate(userIdParam.getValue());
        }
        else {
            return null;
        }
    };

    CCM_proto.prmGetDtoPriorityValue = function(dto) {
        if (dto.local === undefined || dto.network === undefined) {
            return false;
        }
        var twobyte = 0;
        twobyte = solace.smf.Codec.setBits(twobyte, dto.local, 8, 8);
        twobyte = solace.smf.Codec.setBits(twobyte, dto.network, 0, 8);
        return solace.Convert.int16ToStr(twobyte);
    };

    CCM_proto.prmParseDtoPriorityValue = function(strDtoPriority) {
        var dto = {};
        var twobyte = solace.Convert.strToInt16(strDtoPriority.substr(0, 2));
        dto.local = solace.smf.Codec.bits(twobyte, 8, 8);
        dto.network = solace.smf.Codec.bits(twobyte, 0, 8);
        return dto;
    };

    /*
    strCapabilities: parameter value
    caps: an already existing hash array of CapabilityType
     */
    CCM_proto.prmParseCapabilitiesValue = function(strCapabilities, caps) {
        if (! (strCapabilities && caps)) {
            return false;
        }
        var CT = solace.CapabilityType;
        var pos = 0;

        // parse boolean capabilities
        var bool_cap_count = solace.Convert.strToInt8(strCapabilities.substr(pos, 1));
        pos++;
        var onebyte = 0;
        if (bool_cap_count >= 1) {
            onebyte = solace.Convert.strToInt8(strCapabilities.substr(pos, 1));
            pos++;
            // no solclientjs capabilities yet
        }
        if (bool_cap_count >= 9) {
            onebyte = solace.Convert.strToInt8(strCapabilities.substr(pos, 1));
            pos++;
            caps[CT.MESSAGE_ELIDING] = bits(onebyte, 3, 1) ? true : false;
            caps[CT.NO_LOCAL] = bits(onebyte, 1, 1) ? true : false;
        }
        if (bool_cap_count > 16) {
            // We don't know about these capabilities yet
            pos += Math.ceil((bool_cap_count-16)/8); //advance and skip
        }

        // parse non-boolean capabilities
        var sanity_loop = 500;
        while(pos < strCapabilities.length && sanity_loop-- > 0) {
            onebyte = solace.Convert.strToInt8(strCapabilities.substr(pos, 1)); //type
            pos++;
            var capLen = solace.Convert.strToInt32(strCapabilities.substr(pos, 4)); 
            pos += 4;
            capLen -= 5;
            var strValue = strCapabilities.substr(pos, capLen);
            pos += capLen;
            switch (onebyte) {
                case 0x00:
                    caps[CT.PEER_PORT_SPEED] = (strValue.length === 4) ? solace.Convert.strToInt32(strValue) : 0;
                    break;
                case 0x01:
                    caps[CT.PEER_PORT_TYPE] = (strValue.length === 1) ? solace.Convert.strToInt8(strValue) : 0;
                    break;
                case 0x02:
                    // NOOP (max guaranteed message size)
                    break;
                case 0x03:
                    caps[CT.MAX_DIRECT_MSG_SIZE] = (strValue.length === 4) ? solace.Convert.strToInt32(strValue) : 0;
                    break;
            }
        }
        return caps;
    };

    CCM_proto.getRouterCapabilities = function() {
        var caps = [];
        var cap_param = null;
        // Parse the composite capabilities parameter
        if ((cap_param = this.getParameter(0x09))) {
            caps = this.prmParseCapabilitiesValue(cap_param.getValue(), caps);
        }

        // Parse out the router status strings
        if ((cap_param = this.getParameter(0x00))) {
            caps[solace.CapabilityType.PEER_SOFTWARE_VERSION] = solace.Util.stripNullTerminate(cap_param.getValue());
        }
        if ((cap_param = this.getParameter(0x01))) {
            caps[solace.CapabilityType.PEER_SOFTWARE_DATE] = solace.Util.stripNullTerminate(cap_param.getValue());
        }
        if ((cap_param = this.getParameter(0x02))) {
            caps[solace.CapabilityType.PEER_PLATFORM] = solace.Util.stripNullTerminate(cap_param.getValue());
        }
        if ((cap_param = this.getParameter(0x0c))) {
            caps[solace.CapabilityType.PEER_ROUTER_NAME] = solace.Util.stripNullTerminate(cap_param.getValue());
        }
        return caps;
    };

    // static method (put it on the function def)
    ClientCtrlMessage.getLogin = function(sprop, correlationTag) {
        var cc = new solace.smf.ClientCtrlMessage();
        if (!(sprop instanceof solace.SessionProperties)) {
            return false;
        }
        cc.MsgType = 0x00;
        var smfHeader = cc.m_smfHeader;
        smfHeader.m_pm_corrtag = correlationTag;
        if (sprop.password) {
            smfHeader.m_pm_password = sprop.password;
        }
        if (sprop.userName) {
            smfHeader.m_pm_username = sprop.userName;
        }
        if (sprop.subscriberLocalPriority && sprop.subscriberNetworkPriority) {
            cc.addParameter(new SMFParameter(
                    0,
                    0x07,
                    this.prototype.prmGetDtoPriorityValue({local: sprop.subscriberLocalPriority, network: sprop.subscriberNetworkPriority})));
        }
        if (sprop.vpnName && sprop.vpnName.length > 0) {
            cc.addParameter(new SMFParameter(
                    1,
                    0x06,
                    solace.Util.nullTerminate(sprop.vpnName)));
        }
        var appDesc = "";
        if (sprop.applicationDescription && sprop.applicationDescription.length > 0) {
            appDesc = sprop.applicationDescription;
        } else {
            // auto-gen description
            appDesc = "solclientjs / " + navigator.userAgent;
            appDesc = appDesc.substr(0, 250);
        }
        cc.addParameter(new SMFParameter(
                0,
                0x04,
                solace.Util.nullTerminate(appDesc)));
        
        cc.addParameter(new SMFParameter(
                0,
                0x05,
                solace.Util.nullTerminate(sprop.clientName)));
        cc.addParameter(new SMFParameter(
                0,
                0x02,
                solace.Util.nullTerminate(navigator.platform)));

        if (sprop.noLocal) {
            cc.addParameter(new SMFParameter(
                    0,
                    0x0f,
                    solace.Convert.int8ToStr(1)));
        }

        cc.addParameter(new SMFParameter(0, 0x01, solace.Util.nullTerminate("20111117-1252")));
        cc.addParameter(new SMFParameter(0, 0x00, solace.Util.nullTerminate("5.3.0.14")));
        return cc;
    };

    /**
     * Get a CC update message.
     *
     * @param {solace.MutableSessionProperty} mutableSessionProperty
     * @param {String} newValue
     */
    ClientCtrlMessage.getUpdate = function getUpdate(mutableSessionProperty, newValue, correlationTag) {
        var cc = new ClientCtrlMessage();
        cc.MsgType = 0x01;
        var smfHeader = cc.m_smfHeader;
        smfHeader.m_pm_corrtag = correlationTag;
        if (mutableSessionProperty === solace.MutableSessionProperty.CLIENT_DESCRIPTION) {
            var appdesc = (newValue + "").substr(0, 250);
            cc.addParameter(new SMFParameter(
                    0,
                    0x04,
                    solace.Util.nullTerminate(appdesc)));
        } else if (mutableSessionProperty === solace.MutableSessionProperty.CLIENT_NAME) {
            var result = ClientCtrlMessage.validateClientName(newValue);
            if (result) {
                throw new solace.OperationError(result, solace.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
            }
            cc.addParameter(new SMFParameter(
                    0,
                    0x05,
                    solace.Util.nullTerminate(newValue)));
        }
        return cc;
    };

    ClientCtrlMessage.validateClientName = function(strName) {
        var result = solace.TopicUtil.validateTopic(strName);
        if (result) {
            return result;
        }
        result = strName.length <= 160 ? null : "Client Name too long (max length: 160).";
        if (result) {
            return result;
        }
        return null;
    };
    solace.smf.ClientCtrlMessage = ClientCtrlMessage;

    /**
     * KeepAlive message object.
     * @constructor
     */
    function KeepAliveMessage() {
        var smfh = new solace.smf.SMFHeader();
        smfh.m_smf_protocol = 0x0b;
        smfh.m_smf_uh = 2;
        smfh.m_smf_ttl = 1;
        this.m_smfHeader = smfh; // override prototype's
    }
    KeepAliveMessage.prototype = new BaseMessage();
    solace.smf.KeepAliveMessage = KeepAliveMessage;

    /**
     * Transport SMF Message
     * @constructor
     */
    function TransportSmfMessage() {
        this.UH = 0;
        this.MessageType = null;
        this.SessionId = null;
        this.RouterTag = null;
        this.Payload = null;

        // override parent
        this.m_smfHeader = null;
        this.m_parameters = null;
    }
    TransportSmfMessage.prototype = new BaseMessage();
    solace.TransportSmfMessage = TransportSmfMessage;
}(solace));
//
/*global solace:true window console BlobBuilder ArrayBuffer Uint8Array SOLACE_FATAL SOLACE_ERROR SOLACE_WARN SOLACE_INFO SOLACE_DEBUG SOLACE_TRACE SOLACE_CONSOLE_FATAL SOLACE_CONSOLE_ERROR SOLACE_CONSOLE_WARN SOLACE_CONSOLE_INFO SOLACE_CONSOLE_DEBUG SOLACE_CONSOLE_TRACE */
// 
// 

(function(solace) {
    // This contains SMF formatting for SMF Transport Session headers
    solace.TsSmf = (function() {
        // Generates an SMF header up to, but not including the the total length
        // This is fixed for all client generated transport session messages
        function genTsHeaderPreLength() {
            return (
                    solace.Convert.int32ToStr(0x03140001) + // SMF version, TransportSession, TTL
                            solace.Convert.int32ToStr(12)   // Header length
                    );
        }

        // Generate a full Transport Session Create header
        function genTsCreateHeader() {
            return (
                    genTsHeaderPreLength() + // Header up to the message length field
                            solace.Convert.int32ToStr(22) + // Total length
                            solace.Convert.int16ToStr(0x800a) + // MsgType(create), length
                            solace.Convert.int32ToStr(0) + // Session ID (first half)
                            solace.Convert.int32ToStr(0)        // Session ID (second half)
                    );
        }

        // Generate a full Transport Session Destroy header
        function genTsDestroyHeader(sid) {
            return (
                    genTsHeaderPreLength() + // Header up to the message length field
                            solace.Convert.int32ToStr(22) + // Total length
                            solace.Convert.int16ToStr(0x820a) + // MsgType(destroy), length
                            sid                                   // Session ID
                    );
        }

        // Generate a data token message
        function genTsDataTokenMsg(sid) {
            return (solace.Convert.int32ToStr(0x03940001) +
                    solace.Convert.int32ToStr(12) +
                    solace.Convert.int32ToStr(22) +
                    solace.Convert.int16ToStr(0x850a) +
                    sid);
        }

        function genTsDataMsgHeaderParts(sid) {
            return [(solace.Convert.int32ToStr(0x03940001) +
                    solace.Convert.int32ToStr(12)),
                (solace.Convert.int16ToStr(0x840a) +
                        sid)];

        }

        return {
            genTsDataMsgHeaderParts: genTsDataMsgHeaderParts,
            genTsDataTokenMsg: genTsDataTokenMsg,
            genTsDestroyHeader: genTsDestroyHeader,
            genTsCreateHeader: genTsCreateHeader
        };
    }());

}(solace));
//
/*global solace:true window console BlobBuilder ArrayBuffer Uint8Array SOLACE_FATAL SOLACE_ERROR SOLACE_WARN SOLACE_INFO SOLACE_DEBUG SOLACE_TRACE SOLACE_CONSOLE_FATAL SOLACE_CONSOLE_ERROR SOLACE_CONSOLE_WARN SOLACE_CONSOLE_INFO SOLACE_CONSOLE_DEBUG SOLACE_CONSOLE_TRACE */
//
//
//

(function(solace) {
    var USE_BASE64 = true;
    var USE_MAX_PAYLOAD_CHUNKING = true;

    /** ===========================================================================
     * TransportSessionEvent :
     *
     * Defines a Session Event
     *
     * @param {Object} {@link solace.TransportSessionEventCode}
     * @param {Object} infoStr
     * @param {Object} responseCode
     * @param {Object} sessionId
     *
     * ============================================================================
     */
    solace.TransportSessionEvent = function(TransportSessionEventCode, infoStr, responseCode, sessionId){
        this.m_sessionEventCode = TransportSessionEventCode;
        this.m_infoStr          = infoStr;
        this.m_responseCde      = responseCode;
        this.m_sid              = sessionId;
    };

// TransportSessionEvent functions

    solace.TransportSessionEvent.prototype.getSessionEventCode = function(){
        return this.m_sessionEventCode;
    };

    solace.TransportSessionEvent.prototype.getInfoStr = function(){
        return this.m_infoStr;
    };

    solace.TransportSessionEvent.prototype.getResponseCode = function(){
        return this.m_responseCde;
    };

    solace.TransportSessionEvent.prototype.getSessionId = function(){
        return this.m_sid;
    };

    solace.TransportSessionEvent.prototype.toString = function() {
        var buf = new solace.StringBuffer("Transport session event: ");
        buf.append("sessionEventCode=").append(this.m_sessionEventCode).append(", ");
        buf.append("infoStr=").append(this.m_infoStr||"").append(", ");
        buf.append("responseCode=").append(this.m_responseCde||"").append(", ");
        buf.append("sid=").append(this.m_sid ? solace.Util.formatHexString(this.m_sid) : "");
        return buf.toString();
    };

    /** ===========================================================================
     * TransportSession :
     *
     * This contains all data and code required to maintain transport sessions
     * with Solace routers
     * ============================================================================
     */
    solace.TransportSession = function TransportSession(baseUrl, eventCb, rxDataCb, props){

        // Set to true if we have the data token that we need for sending data to the router
        this.m_haveToken = true;

        // Callback for all transport session events
        this.m_eventCb = eventCb;

        // Callback for receiving data
        this.m_rxDataCb = rxDataCb;

        // Maximum amount of send data than can be queued
        this.m_sendBufferMaxSize = props.sendBufferMaxSize;

        // Maximum payload chunk size in web transport
        this.m_confMaxWebPayload = props.maxWebPayload;
        this.m_maxPayloadBytes = 0;

        // Maximum time to wait for a create session
        this.m_connectTimeout = props.connectTimeoutInMsecs;

        // Timer that will keep track of the connection time
        this.m_connectTimer = null;

        // Timer that will keep track of the destroy time
        this.m_destroyTimer = null;

        // The URL used for create messages
        this.m_createUrl = baseUrl;

        // The URL used for all other messages - it will have the router tag appended
        // after the session has been created
        this.m_routerUrl = this.m_createUrl;

        // Current state
        this.m_state = 0;

        // Send data connection (instantiated after session is created)
        this.m_httpSendConn = null;

        // Receive data connection (instantiated after session is created)
        this.m_httpReceiveConn = null;

        // Data SMF header - this is preformatted for performance
        // It will be set after session is created
        this.m_smfDataTSHeader = null;

        // Data Token SMF header - this is preformatted for performance
        // It will be set after session is created
        this.m_smfDataTokenTSHeader = null;

        // Router Tag - a string that will be added to HTTP request URLs
        this.m_routerTag = "";

        // Session ID - 8-byte identifier that will associate this client
        // with client resources on the router
        this.m_sid = null;

        // Queue to hold data to be sent to the router when we get back a
        // data token
        this.m_queuedData = [];

        // Number of bytes of queued data
        this.m_queuedDataSize = 0;

        // Remember if we have to send an event when there is room in the queue
        this.m_alertOnDequeue = false;

        // stats used for KA processing
        this.m_clientstats = {bytesWritten: 0, msgWritten: 0};

        if (props.transportScheme === solace.TransportScheme.HTTP_BASIC) {
            if (!solace.HttpConnection.browserSupportsXhrBinary()) {
                throw new solace.OperationError(
                        "Selected HTTP_BASIC transport, but browser does not support binary XmlHttpRequest.",
                        solace.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
            }
            this.m_useBinaryTransport = true;
            this.m_sniffed_base64_req = true; // don't auto-detect
        } else if (props.transportScheme === solace.TransportScheme.HTTP_BASE64) {
            this.m_useBinaryTransport = false;
            this.m_sniffed_base64_req = true; // don't auto-detect
        } else {
            // auto-detect
            this.m_useBinaryTransport = solace.HttpConnection.browserSupportsXhrBinary();
            // Tracks whether we've checked that we could do binary transport (no Base64)
            this.m_sniffed_base64_req = false;
        }
    };

    solace.TransportSession.prototype.updateMaxWebPayload = function() {
        // 22 Bytes of TransportSMF wrapping overhead
        var tr_less_encapsmf = this.m_confMaxWebPayload - 22;
        // Base64 has a 4:3 expansion
        this.m_maxPayloadBytes = this.m_useBinaryTransport ? tr_less_encapsmf : Math.floor(tr_less_encapsmf * 0.75);
    };

    solace.TransportSession.prototype.isUsingBinaryTransport = function() {
        return this.m_useBinaryTransport;
    };

    /**
     * Connect transport session to router
     */
    solace.TransportSession.prototype.connect = function(){

        // Check that we we are in an acceptable state for connection
        if (this.m_state !== 0) {
            return 4;
        }

        this.connectInternal();
        return 0;
    };

    solace.TransportSession.prototype.connectInternal = function() {
        // Create the XHR to talk to the router
        var myThis = this;
        try {
            this.m_createConn = new solace.HttpConnection(this.m_createUrl, !(this.m_useBinaryTransport), function(rc, data){
                    myThis.handleCreateResponse(rc, data);
                }, function(rc, data){
                    myThis.handleCreateConnFailure(rc, data);
            });
        } catch (e) {
            SOLACE_CONSOLE_ERROR("Failed to create connection to router: " + e);
            return 5;
        }
        if (typeof(this.m_createConn) === 'undefined' || this.m_createConn === null) {
            SOLACE_CONSOLE_ERROR("Failed to create connection to router");
            return 5;
        }

        // Get an SMF transport session create message
        var createMsg = solace.TsSmf.genTsCreateHeader();

        if (this.m_state === 1) {
            // already connecting (this is likely a retry with Base64 encoding)
            SOLACE_CONSOLE_DEBUG("Connect attempt while in WAITING_FOR_CREATE (retry)");
        } else {
            // Start a timer to guard against connect timeout
            this.m_connectTimer = setTimeout(function() {
                myThis.connectTimerExpiry();
            }, this.m_connectTimeout);

            // Set the current state
            this.m_state  = 1;

            this.m_eventCb(new solace.TransportSessionEvent(solace.TransportSessionEventCode.CONNECTING,
                                                            "Connection in progress",
                                                            0, 0));
        }

        // Send the create message to the router.  When the response is received, the
        // handleCreateResponse method will be called
        this.m_createConn.send(createMsg);
    };

    /**
     * Destroy transport session to router
     */
    solace.TransportSession.prototype.destroy = function(immediate, msg, subCode){
        SOLACE_CONSOLE_INFO("Destroy session when in state " + this.m_state);
        if (this.m_state === 4 ||
            this.m_state === 0) {
            // Nothing to do
            return 0;
        }

        if (this.m_state === 5 ||
                this.m_state === 1) {
            // The connections are in an unreliable state - we will just
            // kill our local object and let the router clean itself up with its inactivity timer
            SOLACE_CONSOLE_INFO("The connection is in unreliable state, close transport");
            this.destroyCleanup(true, msg, subCode);
            return 0;
        }

        if (immediate || this.m_haveToken) {
            SOLACE_CONSOLE_INFO("Destroy session immediately");
            // Set the current state
            this.m_state  = 4;

            // Abort any current requests for this session
            if (this.m_httpSendConn !== null) {
                this.m_httpSendConn.abort();
            }
            if (this.m_httpReceiveConn !== null) {
                this.m_httpReceiveConn.abort();
            }

            // Start a timer
            // Note that we use the connectTimeout value
            var myThis = this;
            this.m_destroyTimer = setTimeout(function(){
                    myThis.destroyTimerExpiry();
                }, this.m_connectTimeout);

            // Send the create message to the router.  When the response is received, the
            // handleCreateResponse method will be called
            if (this.m_httpSendConn !== null) {
                // Get an SMF transport session destroy message
                var destroyMsg = solace.TsSmf.genTsDestroyHeader(this.m_sid);

                SOLACE_CONSOLE_INFO("destroy message: " + solace.Convert.strToByteArray(destroyMsg));
                this.m_httpSendConn.send(destroyMsg);
            }
        }
        else {
            SOLACE_CONSOLE_INFO("Destroy pending");
            // Simply set the pending destroy state so that
            // we will issue the destroy request later
            this.m_state  = 3;

        }

        return 0;

    };

    function allowEnqueue(ts, datalen) {
        // Bug 32006: we always accept at least one message, if there's no queued data, even if it exceeds the sendBufferMaxSize.
        // If we reject enqueueing something too large because we already have queued data,
        // that guarantees when the data is flushed we will emit the alertOnDequeue event.

        return ts.m_queuedDataSize === 0 || ((datalen + ts.m_queuedDataSize) <= ts.m_sendBufferMaxSize);
    }

    function enqueue_fail_no_space(ts) {
        ts.m_alertOnDequeue = true;
        return 2;
    }

    /**
     * Send data over the connection - this requires a send token
     * @param {String} data
     * @return OK or NO_SPACE
     */
    solace.TransportSession.prototype.send = function(data, forceAllowEnqueue){
        //SOLACE_CONSOLE_DEBUG("TransportSession:send " + data.length + " bytes, tx_queued:" + this.m_queuedDataSize);
        if (this.m_state !== 2) {
            return 4;
        }

        this.m_clientstats.msgWritten++;

        // Check to see if we already have queued data
        if ((this.m_queuedData.length > 0) || (!this.m_haveToken)) {
            return this.enqueueData(data, forceAllowEnqueue);
        }

        // Check if we need to chop up the payload
        var remainder = null;
        if (USE_MAX_PAYLOAD_CHUNKING && (data.length > this.m_maxPayloadBytes)) {
            remainder = data.substr(this.m_maxPayloadBytes);
            data = data.substr(0, this.m_maxPayloadBytes);

            // If no space for remainder, return FAIL without sending anything.
            if (!allowEnqueue(this, remainder.length)) {
                return enqueue_fail_no_space(this);
            }

            //SOLACE_CONSOLE_DEBUG("$$ send dataChunk:" + data.length + ", remainderChunk:" + remainder.length);
        }
        
        // We have the token, so send the data
        this.m_haveToken = false;

        var transportPacketLen = this.m_smfDataTSHeaderParts[0].length + 4 + this.m_smfDataTSHeaderParts[1].length + data.length;

        this.m_httpSendConn.send(this.m_smfDataTSHeaderParts[0] +
                                 solace.Convert.int32ToStr(transportPacketLen) +
                                 this.m_smfDataTSHeaderParts[1] +
                                 data);
        this.m_clientstats.bytesWritten += data.length;

        /*
        if (remainder) {
            SOLACE_CONSOLE_DEBUG("$$ sendDone, enqueue remainder: " + remainder.length);
        }
        */
        if (remainder) {
            return this.enqueueData(remainder);
        } else {
            return 0;
        }
    };


    /**
     * Push data onto the pending send queue as long as it doesn't violate
     * the max stored message size
     */
    solace.TransportSession.prototype.enqueueData = function(data, forceAllowEnqueue) {

        //SOLACE_CONSOLE_DEBUG("enqueuing data: " + data.length + ", queue depth: " + this.m_queuedData.length);
        if (forceAllowEnqueue || allowEnqueue(this, data.length)) {
            this.m_queuedDataSize += data.length;
            this.m_queuedData.push(data);
        }
        else {
            return enqueue_fail_no_space(this);
        }

        return 0;
    };


    /**
     * Set the data in the preformatted headers.  The headers are set up this way
     * for performance reasons
     */
    solace.TransportSession.prototype.initPreformattedHeaders = function(sid) {

        // m_smfDataTSHeaderParts is a two entry array - one part before the total length
        // and the other after.  The total length is not know until actual data is sent
        this.m_smfDataTSHeaderParts = solace.TsSmf.genTsDataMsgHeaderParts(sid);

        // m_smfDataTokenTSHeader is a single header that all data-token messages require
        this.m_smfDataTokenTSHeader = solace.TsSmf.genTsDataTokenMsg(sid);

    };

    /**
     * Check if there is any data waiting to be sent to the router.
     * If there is, send it.
     */
    solace.TransportSession.prototype.sendQueuedData = function() {

        if (this.m_queuedData.length > 0) {
            this.m_haveToken = false;
            var data = this.m_queuedData.join("");

            // Check if we need to chop up the payload and enqueue remainder
            var remainder = null;
            if (USE_MAX_PAYLOAD_CHUNKING && (data.length > this.m_maxPayloadBytes)) {
                remainder = data.substr(this.m_maxPayloadBytes);
                data = data.substr(0, this.m_maxPayloadBytes);
            }
            this.m_queuedData = (remainder) ? [remainder] : [];
            this.m_queuedDataSize = (remainder) ? remainder.length : 0;
            //SOLACE_CONSOLE_DEBUG("$$ sendQueuedData dataChunk:" + (data ? data.length : "null") + ", remainderChunk:" + ((remainder!==null) ? remainder.length : 0) + ", queuedDataSz:" + this.m_queuedDataSize);

            /*
            if (this.m_queuedDataSize === 0) {
                SOLACE_CONSOLE_INFO("$$ sendQueuedData queue empty, len:" + this.m_queuedData.length);
            }
            */
            var transportPacketLen = this.m_smfDataTSHeaderParts[0].length + 4 + this.m_smfDataTSHeaderParts[1].length + data.length;

            this.m_httpSendConn.send(this.m_smfDataTSHeaderParts[0] +
                                     solace.Convert.int32ToStr(transportPacketLen) +
                                     this.m_smfDataTSHeaderParts[1] +
                                     data);
            this.m_clientstats.bytesWritten += data.length;

            if (this.m_alertOnDequeue) {
                this.m_alertOnDequeue = false;
                this.m_eventCb(new solace.TransportSessionEvent(solace.TransportSessionEventCode.CAN_ACCEPT_DATA,
                                                                "", 0, this.m_sid));
            }
        }
        else if (this.m_state === 3) {
            this.destroy(false);
        }

    };

// Internal Callbacks

// Called when a create response message has been received
    solace.TransportSession.prototype.handleCreateResponse = function(tsRc, response){        
        if (this.m_state === 4 ||
              this.m_state === 0) {
            SOLACE_CONSOLE_DEBUG("Received create response on a destroyed transport session, ignore");
            return;
        }

        // First, stop the connect timer
        if (this.m_connectTimer !== null) {
            clearTimeout(this.m_connectTimer);
            this.m_connectTimer = null;
        }

        // We know whether we're using Base64 or not, so update our max payload size.
        this.updateMaxWebPayload();
        this.m_sniffed_base64_req = true;

        if (tsRc !== 0) {
            if (tsRc === 3) {
                this.m_state = 0;
                this.destroyCleanup(true, "Received data decode error on create session response", solace.ErrorSubcode.DATA_DECODE_ERROR);
            }
            else {
                this.m_state = 0;
                this.destroyCleanup(true, "Failed to handle create session response", solace.ErrorSubcode.INTERNAL_CONNECTION_ERROR);
            }
            return;
        }

        // Parse the Transport Session SMF
        var parsedResponse = solace.smf.Codec.decodeCompoundMessage(response, 0);

        if (!parsedResponse) {
            this.m_state = 0;
            this.destroyCleanup(true, "Failed to parse create response message", solace.ErrorSubcode.INTERNAL_CONNECTION_ERROR);
            return;
        }

        var smfresponse = parsedResponse.getResponse();
        if (smfresponse.ResponseCode !== 200) {
            this.m_state = 0;
            this.destroyCleanup(true, "Transport create request failed: response code - " + smfresponse.ResponseCode +
                    ", " + smfresponse.ResponseCode, solace.ErrorSubcode.INTERNAL_CONNECTION_ERROR);
            return;
        }

        this.m_createConn.abort();
        this.m_createConn = null;
        this.m_state        = 2;
        this.m_sid          = parsedResponse.SessionId;
        this.m_routerTag    = parsedResponse.RouterTag;
        this.m_connectTimer = null;

        // Trim any parameters off the create url before using it for the routerUrl
        this.m_routerUrl    = this.m_createUrl.replace(/\?.*/, "");
        if (this.m_routerTag !== "") {
            this.m_routerUrl = this.m_routerUrl + this.m_routerTag;
        }

        this.initPreformattedHeaders(this.m_sid);


        // Create the two connections to the router
        // By now, getXhrObj() should not throw any exception inside solace.HttpConnection constructor
        var myThis = this;
        this.m_httpSendConn = new solace.HttpConnection(this.m_routerUrl, !(this.m_useBinaryTransport),
                                                        function(rc, data){ // RxData callback
                                                            myThis.handleRxDataToken(rc, data);
                                                        },
                                                        function(rc, data){ // connection close or error callback
                                                            myThis.handleConnFailure(rc, data);
                                                        });

        this.m_httpReceiveConn = new solace.HttpConnection(this.m_routerUrl, !(this.m_useBinaryTransport),
                                                           function(rc, data){ // RxData callback
                                                               myThis.handleRxData(rc, data);
                                                           },
                                                           function(rc,data){  // connection close or error callback
                                                               myThis.handleConnFailure(rc, data);
                                                           });

        // Give the router the data token so that it will be able to send data
        this.m_httpReceiveConn.send(this.m_smfDataTokenTSHeader);

        // Send the event to the application letting it know that the session is up
        this.m_eventCb(new solace.TransportSessionEvent(solace.TransportSessionEventCode.UP_NOTICE,
                                                        smfresponse.ResponseString,
                                                        0, parsedResponse.SessionId));
    };


// Called when receiving a destroy response
    solace.TransportSession.prototype.handleDestroyResponse = function(response) {
        SOLACE_CONSOLE_INFO("Handle destroy response");
        // First, stop the timer
        if (this.m_destroyTimer !== null) {
            clearTimeout(this.m_destroyTimer);
            this.m_destroyTimer = null;
        }

        var respString = response.getResponse().ResponseString || "";
        respString += " Handled Destroy Response addressed to session " + solace.Util.formatHexString(response.SessionId) + ", on session " + solace.Util.formatHexString(this.m_sid);

        this.destroyCleanup(true, respString);
    };


// Called when data is received on the connection
    solace.TransportSession.prototype.handleRxData = function(tsRc, data){
        this.m_httpReceiveConn.recStat("GotData");
        if (tsRc !== 0) {
            return this.handleRxError(tsRc, data);
        }

        // TODO:  We must have a fast path version of this - it is too slow to do a full parse for normal data messages
        //        Will wait for full implementation with benchmarks before embarking on this level of optimization
        var parsedResponse = solace.smf.Codec.decodeCompoundMessage(data, 0);

        if (!parsedResponse) {
            this.m_state = 5;
            this.m_eventCb(new solace.TransportSessionEvent(solace.TransportSessionEventCode.PARSE_FAILURE,
                                                            "Failed to parse received data message",
                                                            solace.ErrorSubcode.PROTOCOL_ERROR, this.m_sid));
            return;
        }

        if (parsedResponse.MessageType === 3) {
            this.handleDestroyResponse(parsedResponse);
            return;
        }

        if (parsedResponse.SessionId !== this.m_sid) {
            // The router may have given us an error code, if so, include in the error message.
            var smf_err_response = parsedResponse.getResponse();
            var response_err_str = (smf_err_response) ?
                    (" (" + smf_err_response.ResponseCode + " " + smf_err_response.ResponseString + ")" ) :
                    "";

            SOLACE_CONSOLE_DEBUG("HandleRxData Bad SID received in message.  Expected: " + solace.Convert.strToByteArray(this.m_sid) +
                      ", Received: " + solace.Convert.strToByteArray(parsedResponse.SessionId) + response_err_str);
            SOLACE_CONSOLE_DEBUG("First 64 bytes (or fewer) of message: " + solace.Convert.strToByteArray(data.substr(0, 64)));

            this.m_state = 5;
            this.m_eventCb(new solace.TransportSessionEvent(solace.TransportSessionEventCode.PARSE_FAILURE,
                "Session ID mismatch in data message, expected: " + solace.Util.formatHexString(this.m_sid) + ", got: " + solace.Util.formatHexString(parsedResponse.SessionId) + ", " + response_err_str,
                solace.ErrorSubcode.PROTOCOL_ERROR, this.m_sid));
            return;
        }
        if (parsedResponse.MessageType === 4) {
            if (this.m_state !== 2) {
                SOLACE_CONSOLE_INFO("Received data on session not in up state, state=" + this.m_state);
                return;
            }
            this.m_httpReceiveConn.send(this.m_smfDataTokenTSHeader);
            this.m_httpReceiveConn.recStat("ReturnToken");
            this.m_rxDataCb(parsedResponse.Payload);
        } else {
            // Unexpected message type
            throw(new solace.TransportError("Unexpected message type (" +
                                            parsedResponse.MessageType + ") on ReceiveData connection", 0));
        }
    };


// Called when data is received on the httpDataSend
    solace.TransportSession.prototype.handleRxDataToken = function(tsRc, data){

        if (tsRc !== 0) {
            return this.handleRxError(tsRc, data);
        }

        // TODO:  We must have a fast path version of this - it is too slow to do a full parse for normal data messages
        //        Will wait for full implementation with benchmarks before embarking on this level of optimization
        var parsedResponse = solace.smf.Codec.decodeCompoundMessage(data, 0);

        if (!parsedResponse) {
            if (this.m_state !== 4) {
                this.m_state = 5;
                this.m_eventCb(new solace.TransportSessionEvent(solace.TransportSessionEventCode.PARSE_FAILURE,
                                                                "Failed to parse received data message",
                                                                solace.ErrorSubcode.PROTOCOL_ERROR, this.m_sid));
            }
            else {
                this.destroyCleanup(true);
            }
            return;
        }

        if (parsedResponse.MessageType === 3) {
            this.handleDestroyResponse(parsedResponse);
            return;
        }

        if (parsedResponse.SessionId !== this.m_sid) {
            // The router may have given us an error code, if so, include in the error message.
            var smf_err_response = parsedResponse.getResponse();
            var response_err_str = (smf_err_response) ?
                    (" (" + smf_err_response.ResponseCode + " " + smf_err_response.ResponseString + ")" ) :
                    "";

            SOLACE_CONSOLE_DEBUG("HandleRxDataToken Bad SID received in message.  Expected: " + solace.Convert.strToByteArray(this.m_sid) +
                      ", Received: " + solace.Convert.strToByteArray(parsedResponse.SessionId) + response_err_str);
            SOLACE_CONSOLE_DEBUG("First 64 bytes (or fewer) of message: " + solace.Convert.strToByteArray(data.substr(0, 64)));

            if (this.m_state !== 4) {
                this.m_state = 5;
                this.m_eventCb(new solace.TransportSessionEvent(solace.TransportSessionEventCode.PARSE_FAILURE,
                    "Session ID mismatch in response message, expected: " + solace.Util.formatHexString(this.m_sid) + ", got: " + solace.Util.formatHexString(parsedResponse.SessionId) + ", " + response_err_str,
                    solace.ErrorSubcode.PROTOCOL_ERROR, this.m_sid));
            }
            else {
                this.destroyCleanup(true, "Session ID mismatch in response message", solace.ErrorSubcode.PROTOCOL_ERROR);
            }
            return;
        }

        if (parsedResponse.MessageType === 5 ||
            parsedResponse.MessageType === 6) {
            this.m_haveToken = true;
            this.m_httpSendConn.recStat("GotToken");
            //this.m_eventCb(new solace.TransportSessionEvent(solace.TransportSessionEventCode.NOTIFY_GOT_TOKEN, "", null, null));
            this.sendQueuedData();
        } else {
            // Unexpected message type
            throw(new solace.TransportError("Unexpected message type (" +
                                            parsedResponse.MessageType + ") on SendData connection", 0));
        }

    };


    solace.TransportSession.prototype.handleRxError = function(tsRc, data){
        this.m_state = 5;
        if (tsRc === 3) {
            this.m_eventCb(new solace.TransportSessionEvent(solace.TransportSessionEventCode.DATA_DECODE_ERROR,
                                                            "Received data decode error",
                                                            solace.ErrorSubcode.DATA_DECODE_ERROR, this.m_sid));
        }
        else {
            this.m_eventCb(new solace.TransportSessionEvent(solace.TransportSessionEventCode.CONNECTION_ERROR,
                                                            "Connection error",
                                                            solace.ErrorSubcode.INTERNAL_CONNECTION_ERROR, this.m_sid));
        }

    };


// Called when there is an error on a connection or the connection is aborted
    solace.TransportSession.prototype.handleConnFailure = function(status, msg){
        SOLACE_CONSOLE_INFO("Connection failure (" + msg + ") while in state " + this.m_state);
        if (this.m_state === 2) {
            this.m_state = 5;
            // Need to tear the session down
            this.m_eventCb(new solace.TransportSessionEvent(solace.TransportSessionEventCode.CONNECTION_ERROR,
                                                            "Connection error: " + msg,
                                                            solace.ErrorSubcode.INTERNAL_CONNECTION_ERROR, this.m_sid));
        }
        else if (this.m_state === 0 ||
                this.m_state === 4){
            if (status === 0) {
                SOLACE_CONSOLE_INFO("Ignore HTTP status 0");
            }
            else {
                this.destroyCleanup(true, "Connection error: " + msg, solace.ErrorSubcode.INTERNAL_CONNECTION_ERROR);
            }
        }
        else {
            this.m_state = 0;
            this.destroyCleanup(true, "Connection error: " + msg, solace.ErrorSubcode.INTERNAL_CONNECTION_ERROR);
        }
    };


// Called when there is an error on a connection for a session create request
    solace.TransportSession.prototype.handleCreateConnFailure = function(status, msg){
        SOLACE_CONSOLE_INFO("Connection create failure (" + msg + ") while in state " + this.m_state);
        if (this.m_state !== 0) {
            if (this.m_state !== 1) {
                // Not expected...  We will destroy the session
                this.destroy(true, "Connection create failure: " + msg, solace.ErrorSubcode.INTERNAL_CONNECTION_ERROR);
            } else {
                if (this.m_useBinaryTransport && !(this.m_sniffed_base64_req) ) {
                    // We need to try again with Base64 encoding of payloads
                    this.m_useBinaryTransport = false;
                    this.m_sniffed_base64_req = true;
                    SOLACE_CONSOLE_INFO("Retry base 64");
                    this.connectInternal(); // retry with Base64
                    return;
                }

                this.m_state = 0;
                this.destroyCleanup(true, "Connection create failure: " + msg, solace.ErrorSubcode.INTERNAL_CONNECTION_ERROR);
            }
        }

    };


// Called when the connect timer expires
    solace.TransportSession.prototype.connectTimerExpiry = function(){
        // Abort the request
        this.m_state = 0;
        this.m_createConn.abort();
        this.m_createConn = null;
        this.destroyCleanup(true, "Timeout during connection create", solace.ErrorSubcode.INTERNAL_CONNECTION_ERROR);
    };


// Called when the destroy timer expires
    solace.TransportSession.prototype.destroyTimerExpiry = function(){
        // Abort the destroy request
        if (this.m_httpSendConn !== null) {
            this.m_httpSendConn.abort();
        }

        this.destroyCleanup(true, "Destroy request timeout");
    };


    solace.TransportSession.prototype.destroyCleanup = function(sendEvent, infoStr, subCode) {
        SOLACE_CONSOLE_INFO("Destroy cleanup");
        // First change the state so that aborting connections don't get upset
        this.m_state  = 4;

        // Abort any current requests for this session
        if (this.m_httpSendConn !== null) {
            this.m_httpSendConn.abort();
        }
        if (this.m_httpReceiveConn !== null) {
            this.m_httpReceiveConn.abort();
        }

        // Clear most internal state
        this.m_createUrl              = null;
        this.m_routerUrl              = null;
        this.m_state                  = 0;
        this.m_httpSendConn           = null;
        this.m_httpReceiveConn        = null;
        this.m_smfDataTSHeader        = null;
        this.m_smfDataTokenTSHeader   = null;
        this.m_routerTag              = "";
        this.m_queuedData             = [];
        this.m_queuedDataSize         = 0;
        this.m_alertOnDequeue         = false;

        if (this.m_destroyTimer !== null) {
            clearTimeout(this.m_destroyTimer);
            this.m_destroyTimer = null;
        }

        if (this.m_connectTimer !== null) {
            clearTimeout(this.m_connectTimer);
            this.m_connectTimer = null;
        }

        if (sendEvent) {
            if (typeof(subCode) === 'undefined') {
                subCode = 0;
            }
            // Send the event to the application letting it know that the session is down
            if (this.m_eventCb) {
                this.m_eventCb(new solace.TransportSessionEvent(solace.TransportSessionEventCode.DESTROYED_NOTICE,
                        (typeof infoStr === "undefined" || infoStr === null || infoStr === "")?"Session is destroyed":infoStr,
                    subCode, this.m_sid));
            }
        }

        // release reference to smf client object
        this.m_rxDataCb = null;
        // release reference to session object
        this.m_eventCb = null;
    };

    solace.TransportSession.prototype.getInfoStr = function() {
        var str = "TransportSessionHttp; sid=" +
            solace.Util.formatHexString(this.m_sid) +
            "; routerTag=" + this.m_routerTag;
        return str;
    };

    function SMFClient(props, rxSmfCb, rxMessageErrorCb, rxTransportEventCb, session) {
        this.m_incomingBuffer = ""; // init incoming SMF buffer
        this.m_rxSmfCb = rxSmfCb; // callback for parsed msg
        this.m_rxMessageErrorCb = rxMessageErrorCb; // invalid UH, etc.
        this.m_rxTransportEventCb = rxTransportEventCb;
        this.m_correlationCounter = 0;
        this.m_session = session;
        this.m_stats = {bytesWritten: 0, msgWritten: 0};
        var mythis = this;
        // we pass-through TransportEventCb
        // new function to invoke incoming data to get 'this' set properly
        this.m_transportSession = new solace.TransportSession(
                props.url,
                function(tr_event) { mythis.handleTransportEvent(tr_event); },
                function(data) { mythis.rxDataCb(data); },
                props);
    }

    SMFClient.prototype = {
        handleTransportEvent: function handleTransportEvent(tr_event) {
            if (this.m_rxTransportEventCb) {
                this.m_rxTransportEventCb(tr_event);
            }
        },

        rxDataCb: function rxData(data) {
            /*
             Handles multiple SMF messages in input, as well as defragmenting partial SMF messages.
             The state we keep is in this.m_incomingBuffer.
             */
            if (this.m_session) {
                // each incoming data chunk resets KA counter
                this.m_session.resetKeepAliveCounter();
            }
            if (this.m_incomingBuffer.length === 0) {
                // optimization: set reference (cheaper than append)
                this.m_incomingBuffer = data;
            } else {
                // append to existing data
                this.m_incomingBuffer += data;
                if (this.m_incomingBuffer.length > 80000000) {
                    // sanity check
                    // 80 megabytes - lost SMF framing: may never complete
                    this.m_rxMessageErrorCb("Buffer overflow (length: " + this.m_incomingBuffer.length + ")");
                    this.m_incomingBuffer = "";
                }
            }
            var pos = 0;
            while ((pos < this.m_incomingBuffer.length) &&
                    (solace.smf.Codec.isSmfAvailable(this.m_incomingBuffer, pos))) {
                var incomingMsg = solace.smf.Codec.decodeCompoundMessage(this.m_incomingBuffer, pos);
                if (incomingMsg && incomingMsg.getSmfHeader()) {
                    pos += incomingMsg.getSmfHeader().m_messageLength;
                    this.m_rxSmfCb(incomingMsg); // hand over to core API callback
                } else {
                    // couldn't decode! Lost SMF framing.
                    SOLACE_CONSOLE_ERROR("SMFClient.rxData(): couldn't decode message.");
                    this.m_incomingBuffer = "";
                    var err_info = "Error parsing incoming SMF at position " + pos;
                    this.m_rxMessageErrorCb(err_info);
                    return; // throw away all we have for now
                }
            }
            if (pos < this.m_incomingBuffer.length) {
                // partial message remaining: keep it in incoming buffer
                var in_buf = this.m_incomingBuffer;
                this.m_incomingBuffer = in_buf.substr(pos, in_buf.length - pos);
            } else {
                // clear incoming buffer
                this.m_incomingBuffer = "";
            }
        },
        connect: function() {
            // pass-through to transport
            return this.m_transportSession.connect();
        },
        destroy: function(immediate, msg, subCode) {
            // pass-through to transport
            return this.m_transportSession.destroy(immediate, msg, subCode);
        },
        send: function send(message, forceAllowEnqueue) {
            var content = solace.smf.Codec.encodeCompoundMessage(message);
            return this.m_transportSession.send(content, forceAllowEnqueue);
        },
        getTransportSession: function() {
            return this.m_transportSession;
        },
        getClientStats: function() {
            return this.m_transportSession.m_clientstats;
        },
        getTransportSessionInfoStr: function() {
            return this.m_transportSession.getInfoStr();
        },
        nextCorrelationTag: function() {
            return ++this.m_correlationCounter;
        }
    };
    solace.SMFClient = SMFClient;

}(solace));
