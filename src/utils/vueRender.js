var vueServer = require('vue-server');
var R = vueServer.renderer;
var Vue = new R();

module.exports = function (options) {
    return new Promise(function (resolve, reject) {
        var vm = new Vue(options);
        vm.$on('vueServer.htmlReady', resolve);
    });
};
