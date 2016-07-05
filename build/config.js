// 服务监听端口
var ports = {
    static: '9527', // 静态资源
    page: '3000' // 页面
};

// 代理服务
var proxy = {
    host: 'http://www.runjiaoyu.com.cn',
    match: /^\/api\//
};

// 七牛
var qiniu = {
    accessKey: 'KxlAO_L8DzANng3VufFsh62RkQYLRkqGe-TGYiR1',
    secretKey: 'VVgEmoIAnZwQAuEXRdih1p_-4e5MVPS3HIZiEacF',
    bucket: 'test',
    domain: 'http://7xru0b.com1.z0.glb.clouddn.com'
};

// var qiniu = {
//     accessKey: 'KxlAO_L8DzANng3VufFsh62RkQYLRkqGe-TGYiR1',
//     secretKey: 'VVgEmoIAnZwQAuEXRdih1p_-4e5MVPS3HIZiEacF',
//     bucket: 'runedu-h5',
//     domain: '//dn-runedu-h5.qbox.me'
// };

module.exports = {
    ports: ports,
    proxy: proxy,
    qiniu: qiniu
};
