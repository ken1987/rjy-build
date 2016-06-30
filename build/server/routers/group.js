var path = require('path');
var fs = require('co-fs');
var router = require('koa-router')();
var vueRender = require('../vueRender');

var homePage = require('../api/group-home');

var aboutPage = function* () {
    yield [];
    return '机构简介' + this.params.groupId;
};

var commentPage = function* () {
    yield [];
    return '学院评论' + this.params.groupId;
};

var activitysPage = function* () {
    yield [];
    return '机构活动' + this.params.groupId + '列表第' + (this.params.activitysPage || 1) + '页';
};

var coursesPage = function* () {
    yield [];
    return '机构课程' + this.params.groupId + '列表第' + (this.params.coursesPage || 1) + '页';
};

// 机构详情路由
router
    .get('/', function* (next) {
        this.redirect('/groups'); // 重定向到机构列表路由
    })
    .get('/:groupId', function* (next) {
        this.body = yield vueRender({
            template: yield fs.readFile(path.resolve('build/views/group-home.tpl')),
            data: yield homePage(this.params.groupId)
        });
    })
    .get('/:groupId/about', function* (next) {
        this.body = yield aboutPage;
    })
    .get('/:groupId/comment', function* (next) {
        this.body = yield commentPage;
    })
    .get('/:groupId/activitys', function* (next) {
        this.body = yield activitysPage;
    })
    .get('/:groupId/activitys/:activitysPage', function* (next) {
        this.body = yield activitysPage;
    })
    .get('/:groupId/courses', function* (next) {
        this.body = yield coursesPage;
    })
    .get('/:groupId/courses/:coursesPage', function* (next) {
        this.body = yield coursesPage;
    });

module.exports = router.routes();
