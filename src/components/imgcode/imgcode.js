/**
 * 二维码
 * @require '../_.js' * 
 * @require /configs/configs.js
 * @require /utils/utils.js
 */
window.RUI.imgcode = (function(window) {
    var config = window.RConfigs.api;
    var utils = window.RUtils;
    var xhr = utils.xhr;
    return {
        template: __inline('imgcode.tpl'),
        props: ['token'],
        data: function() {
            return {
                src: ''
            };
        },
        methods: {
            getImgCode: function() {
                var that = this;
                xhr({
                    url: '{common}/verifycode/token',
                    success: function(data) {
                        that.token = data.token;
                        that.src = config["common"] + '/verifycode?token=' + data.token;
                    },
                    error: function() {
                        that.token = '';
                        that.src = '';
                    }
                });
            }
        },
        ready: function() {
            this.getImgCode();
        }
    };
}(window));
