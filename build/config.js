// 服务监听端口
var serverListenPorts = {
    static: '4000', // 静态资源
    page: '3000' // 页面
};

// 代理服务
var proxy = {
    host: 'http://www.runjiaoyu.com.cn',
    match: /^\/api\//
};

// fis
var fis = {
    domain: {
        dev: '//127.0.0.1:' + serverListenPorts.static,
        prod: '' // '//dn-runedu-h5.qbox.me'
    }
};

module.exports = {
    serverListenPorts: serverListenPorts,
    proxy: proxy,
    fis: fis
};
