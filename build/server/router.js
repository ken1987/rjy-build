var group = require('./routers/group.js');
var groups = require('./routers/groups.js');
var router = require('koa-router')({
    prefix: '/r'
});

// 路由嵌套
router.use('/groups', groups);
router.use('/group', group);

module.exports = router.routes();
