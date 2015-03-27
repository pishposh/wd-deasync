/**
 *  wd-deasync
 *
 *  A wrapper around wd.js to make all Webdriver and Element methods
 *  synchronous, using deasync. Adapted loosely from node-wd-sync.
 */

// jshint node:true

'use strict';

var wd      = require('wd');
var deasync = require('deasync');
var events  = require('events');


function wrapObject(target) {
    var wrapped = {};
    wrapped.wdOriginal = target; // preserve original

    var fname, f, isAsyncMethod;
    for (fname in target) {
        f = target[fname];
        if (typeof f !== 'function') continue;

        // deasync the same methods that would be promisified with wd's promise
        // chaining interface (promise-webdriver.js:14-20):
        isAsyncMethod =
            !/^newElement$|^toJSON$|^toString$|^_/.test(fname) &&
            !events.EventEmitter.prototype[fname];

        if (isAsyncMethod)
            f = deasync(f);

        wrapped[fname] = wrapMethod(target, f);
    }

    return wrapped;
}

function wrapMethod(target, f) {
    return function () {
        var fresult = f.apply(target, arguments);

        // make the returned object's methods synchronous too:
        if (isElement(fresult)) {
            fresult = wrapObject(fresult);
        } else if (Array.isArray(fresult)) {
            fresult = fresult.map(function (v) { return isElement(v) ? wrapObject(v) : v; });
        }

        return fresult;
    };
}

function isElement(obj) {
    return obj instanceof wd.Element;
}


var wdd = {
    remote: function () {
        return wrapObject(wd.remote.apply(wd, arguments));
    },

    SPECIAL_KEYS: wd.SPECIAL_KEYS,

    asserters: wd.asserters,

    TouchAction: wd.TouchAction,
    
    MultiAction: wd.MultiAction,

    wd: wd
};

module.exports = wdd;
