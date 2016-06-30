/**
 * 本地存储
 * @require _.js
 */
window.RUtils.store = (function(window) {
    var localStorage = window.localStorage;
    var deserialize = function(value) {
        if (typeof value != 'string') {
            return undefined;
        }
        try {
            return JSON.parse(value);
        } catch (e) {
            return value || undefined;
        }
    };
    return {
        set: function(key, val) {
            if (val === undefined) {
                return localStorage.removeItem(key);
            }
            localStorage.setItem(key, JSON.stringify(val));
            return val;
        },
        get: function(key, defaultVal) {
            var val = deserialize(localStorage.getItem(key));
            return (val === undefined ? defaultVal : val);
        },
        remove: function(key) {
            localStorage.removeItem(key);
        },
        clear: function() {
            localStorage.clear();
        }
    };
}(window));
