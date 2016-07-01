var request = require('request');
var version = 'v4';
module.exports = function (options) {
    options = options || {};

    // 添加前缀
    options.url = options.url || '';
    options.url = 'http://www.rjy.rd/api' + options.url;

    // 替换版本号,只替换一次
    options.url.replace(/\/v[0-9]+\//, '/' + version + '/');

    return new Promise(function (resolve, reject) {
        request(options, function (error, response, data) {
            if (!error && response.statusCode === 200 && data) {
                data = JSON.parse(data);
                var h = data.h;
                if (h.code === 200) {
                    resolve(data.b);
                } else {
                    reject({
                        message: h && h.msg
                    });
                }
            } else {
                reject(error);
            }
        });
    });
};
