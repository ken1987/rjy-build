/**
 * 头部
 */
module.exports = {
    template: __inline('header.tpl'),
    props: ['title', 'type'],
    data: function () {
        return {
            showhead: true
        };
    },
    computed: {
        exClass: function () {
            return this.type ? 'm-header_style' + this.type : '';
        }
    }
};
