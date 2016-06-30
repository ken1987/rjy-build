var path = require('path');
var koa = require('koa');
var appForHtml = koa();
var logger = require('koa-logger');
var error = require('koa-error');
var compress = require('koa-compress');

var router = require('./server/router');
var config = require('./config');
var serverListenPorts = config.serverListenPorts;

// ---------------------------------------------------------------------------- HTML服务
// 日志
appForHtml.use(logger());

// 错误打印
appForHtml.use(error({
    engine: 'ejs',
    template: path.resolve('build/error.ejs'),
    cache: process.env !== 'development'
}));

// 压缩服务
appForHtml.use(compress({
    flush: require('zlib').Z_SYNC_FLUSH
}));

// 响应头
appForHtml.use(function* (next) {
    yield next;
    this.set('Content-Type', 'html');
});

// 路由
appForHtml.use(router);

// 开启监听
appForHtml.listen(serverListenPorts.page, function () {
    console.log('pages server listen: ' + serverListenPorts.page);
});
