/**
 * 发布相关配置
 */

var domain = require('./config').qiniu.domain;

// 参考：https://github.com/postcss/autoprefixer
var autoprefixer = require('autoprefixer');
autoprefixer({
    browsers: ['not ie <= 8', '> 5% in CN', 'last 3 versions']
});

// 排除指定目录和文件
fis.set('project.ignore', [
    '**/___*.png' // 过滤三下划线开头的预览图片
]);

// 发布环境静态资源
fis.set('domain', domain);

// 参考：https://github.com/kangax/html-minifier
fis.config.set('settings.optimizer.rjy-html-minifier', {
    collapseWhitespace: true, // 折叠空白
    removeComments: true, // 删除注释
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    ignoreCustomComments: [/ignore/], // 保留自定义注释，必须是正则表达式
    processConditionalComments: true // 保留条件注释
});

// 参考：https://github.com/fex-team/fis-optimizer-uglify-js
fis.config.set('settings.optimizer.uglify-js', {
    mangle: {
        except: 'exports, module, require, define' // 不需要混淆的关键字
    },
    compress: {
        drop_console: true // 自动删除console
    }
});

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
    })
    // 压缩打包
    .match('*.html', {
        optimizer: fis.plugin('rjy-html-minifier')
    })
    .match('*.js', {
        useHash: true,
        optimizer: fis.plugin('uglify-js')
    })
    .match('{views,libs}/**.js', {
        useHash: false
    })
    .match('components/**.js', {
        packTo: 'base.js'
    })
    .match('*.{css,less}', {
        useHash: true,
        useSprite: true,
        optimizer: fis.plugin('clean-css')
    })
    .match('/components/**/*.{css,less}', {
        packTo: 'base.css'
    })
    .match('*.{png,jpg,jpeg,gif,ico}', {
        useHash: true
    })
    .match('*.png', {
        optimizer: fis.plugin('png-compressor', {
            type: 'pngquant' // pngcrush or pngquant default is pngcrush
        })
    });
