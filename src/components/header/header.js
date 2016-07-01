/**
 * 头部
 */
module.exports = {
    data: function () {
        return {
            showhead: true
        };
    },
    props: ['title', 'type'],
    template: __inline('header.tpl'),
    computed: {
        exClass: function () {
            return this.type ? 'm-header_style' + this.type : '';
        }
    },
    ready: function () {
        if (this.title) {
            if (this.title.indexOf('img') > 0) {
                return;
            } else {
                // alert(navigator.userAgent);
                document.title = this.title;
            }
        }
    }

};
