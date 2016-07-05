var qiniu = require('./config').qiniu;

// 排除指定目录和文件
fis.set('project.ignore', [
    '**/*.{htm,html,tpl}' // 特别注意，七牛在体验帐号中，限制了类似html的文件上传
]);

// 因为上传的已经是产出物，所以直接关闭fis自带的编译功能
fis.match('**', {
    isHtmlLike: false,
    isCssLike: false,
    isJsLike: false,
    deploy: fis.plugin('qiniu', {
        accessKey: qiniu.accessKey,
        secretKey: qiniu.secretKey,
        bucket: qiniu.bucket
    })
});
