var path = require('path');
var fs = require('co-fs');
var request = require('../../../utils/request-promise');
var vueRender = require('../../../utils/vueRender');
var componentsHeader = require('../../../components/header/header');
var componentsHeaderBack = require('../../../components/header-back/header-back');

/**
 * 格式化数据
 */
var format = function (data) {
    // 地图链接
    data.mapUrl = '/pages/map/map.html' +
        '?lon=' + (data.lon || '') +
        '&lat=' + (data.lat || '') +
        '&address=' + (data.address || data.addressDetail || '') +
        '&name=' + (data.groupName || '');

    return data;
};

module.exports = function* (next) {
    // 获取数据
    try {
        var data = yield request({
            url: '/student/v3/group/home',
            qs: {
                'groupId': this.params.groupId
            }
        });

        data = format(data);
    } catch (e) {
        this.status = 400;
        this.body = e;
        return;
    }

    // 生成body部分
    try {
        var templateBody = yield fs.readFile(
            path.resolve('dist/views/group/index/body.tpl'),
            'utf8'
        );
    } catch (e) {
        this.throw(e);
        return;
    }

    var body = yield vueRender({
        template: templateBody,
        computed: {
            tpl: function () {
                var template = this.template;
                if (template) {
                    return 'style' + template.theme + ' layout' + template.style;
                }
                return '';
            }
        },
        components: {
            'ui-header': componentsHeader,
            'ui-header-back': componentsHeaderBack
        },
        data: data
    });

    // 生成html全部
    try {
        var templateHTML = yield fs.readFile(
            path.resolve('dist/views/group/index/index.html'),
            'utf8'
        );
    } catch (e) {
        this.throw(e);
        return;
    }

    this.body = yield vueRender({
        template: templateHTML,
        data: {
            title: 'test',
            keywords: '123,123,ddfd',
            description: '123123213',
            body: body
        }
    });
};
