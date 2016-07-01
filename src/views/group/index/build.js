var path = require('path');
var fs = require('co-fs');
var componentsHead = require('../../../components/head/head');
var componentsHeader = require('../../../components/header/header');
var componentsHeaderBack = require('../../../components/header-back/header-back');
var request = require('../../../utils/request-promise');
var vueRender = require('../../../utils/vueRender');

/**
 * 格式化数据
 */
var format = function (data) {
    var model = {};

    // 地图链接
    data.mapUrl = '/pages/map/map.html' +
        '?lon=' + (data.lon || '') +
        '&lat=' + (data.lat || '') +
        '&address=' + (data.address || data.addressDetail || '') +
        '&name=' + (data.groupName || '');

    // 头部
    model.head = {
        title: '机构主页',
        keywords: '联盟机构 润教育 机构名字',
        description: '123123123'
    };

    // 主体
    model.body = data;

    return model;
};

module.exports = function* (next) {
    try {
        var data = yield request({
            url: '/student/v3/group/home',
            qs: {
                'groupId': this.params.groupId
            }
        });
    } catch (e) {
        this.status = 400;
        this.body = e;
        return;
    }

    try {
        var template = yield fs.readFile(
            path.resolve('dist/views/group/index/index.tpl'),
            'utf8'
        );
    } catch (e) {
        this.throw(e);
        return;
    }

    this.body = yield vueRender({
        template: template,
        components: {
            'ui-head': componentsHead,
            'ui-header': componentsHeader,
            'ui-header-back': componentsHeaderBack
        },
        data: format(data)
    });
};
