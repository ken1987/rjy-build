var router = require('koa-router')();

var serverGroups = function* () {
    yield [];
    return '机构列表第' + (this.params.page || 1) + '页';
};

router
    .get('/', function* (next) {
        this.body = yield serverGroups;
    })
    .get('/:groupPage', function* (next) {
        this.body = yield serverGroups;
    });

module.exports = router.routes();
