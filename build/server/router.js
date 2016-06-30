var router = require('koa-router')();
var group = require('./routers/group.js');
var groups = require('./routers/groups.js');


// 根路由
router.get('/', function* (next) {
    this.body = 123;
});

// 路由嵌套
router.use('/groups', group);
router.use('/group', groups);

module.exports = router.routes();
