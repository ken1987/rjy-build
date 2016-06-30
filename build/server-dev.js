var path = require('path');
var koa = require('koa');
var appForHtml = koa();
var appForStatic = koa();
var logger = require('koa-logger');
var error = require('koa-error');
var compress = require('koa-compress');
var serve = require('koa-static');
var proxy = require('koa-proxy');

var router = require('./server/router');
var config = require('./config');
var serverListenPorts = config.serverListenPorts;
var proxyConfig = config.proxy;

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

// api代理
appForHtml.use(proxy(proxyConfig));

// 路由
appForHtml.use(router);

// 开启监听
appForHtml.listen(serverListenPorts.page, function () {
    console.log('pages server listen: ' + serverListenPorts.page);
});

// ---------------------------------------------------------------------------- 静态资源服务
// 日志
appForStatic.use(logger());

// 静态文件服务
appForStatic.use(serve(path.resolve('dist'), {
    maxage: 3600 * 24 * 365 // 强缓存1年
}));

// 开启监听
appForStatic.listen(serverListenPorts.static, function () {
    console.log('static file server listen: ' + serverListenPorts.static);
});
