var request = require('../request-promise');
module.exports = function (groupId) {
    return request({
        url: '/student/v3/group/home',
        qs: {
            'groupId': groupId
        }
    });
};
