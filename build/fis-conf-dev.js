/**
 * 开发相关配置
 */

var config = require('./config').fis;

// 排除指定目录和文件
fis.set('project.ignore', [
    '**/___*.png' // 过滤三下划线开头的预览图片
]);

// 发布环境静态资源
fis.set('domain', config.domain.dev);

// 参考：https://github.com/ken1987/fis-postprocessor-rjy-postcss
fis.config.set('settings.postprocessor.rjy-postcss', {
    addPlugins: function () {
        var plugins = [];

        // 参考：https://github.com/postcss/autoprefixer
        var pl = require('autoprefixer');
        pl({
            browsers: ['not ie <= 8', '> 5% in CN', 'last 3 versions']
        });

        plugins.push(pl);

        return plugins;
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
