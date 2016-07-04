var router = require('koa-router')({
    prefix: '/:groupId'
});

var homePage = require('../../../dist/views/group/index/build');

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
        console.log(this.url);
        // 判断是否是斜杠结尾，不是重定向到斜杠结尾
        if (/\/$/.test(this.url)) {
            yield next;
        } else {
            this.redirect(this.url + '/');
            this.status = 301; // 永久重定向
        }
    }, homePage)
    .get('/about', function* (next) {
        this.body = yield aboutPage;
    })
    .get('/comment', function* (next) {
        this.body = yield commentPage;
    })
    .get('/activitys', function* (next) {
        this.body = yield activitysPage;
    })
    .get('/activitys/:activitysPage', function* (next) {
        this.body = yield activitysPage;
    })
    .get('/courses', function* (next) {
        this.body = yield coursesPage;
    })
    .get('/courses/:coursesPage', function* (next) {
        this.body = yield coursesPage;
    });

module.exports = router.routes();
