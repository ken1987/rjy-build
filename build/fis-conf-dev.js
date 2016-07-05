/**
 * 开发相关配置
 */
var port = require('./config').ports.static;

// 参考：https://github.com/postcss/autoprefixer
var autoprefixer = require('autoprefixer');
autoprefixer({
    browsers: ['not ie <= 8', '> 5% in CN', 'last 3 versions']
});

// 排除指定目录和文件
fis.set('project.ignore', [
    '**/___*.png' // 过滤三下划线开头的预览图片
]);

// 发布静态资源
fis.set('domain', 'http://127.0.0.1:' + port);

// 参考：https://github.com/ken1987/fis-postprocessor-rjy-postcss
fis.config.set('settings.postprocessor.rjy-postcss', {
    addPlugins: function () {
        return [autoprefixer];
    }
});

fis
    .match('*.{css,less}', {
        postprocessor: fis.plugin('rjy-postcss')
    })
    .match('*.less', {
        parser: fis.plugin('less'),
        rExt: '.css'
    })
    // 配置：https://github.com/fex-team/fis3-postpackager-loader
    .match('::package', {
        postpackager: fis.plugin('loader')
    })
    // 所有默认资源都产出到static目录下
    .match('**', {
        isMod: true,
        useSameNameRequire: true, // 开启同名依赖
        domain: '${domain}'
    });
