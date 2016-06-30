/**
 * 下载app的banner
 * @require '/utils/utils.js'
 * @require '../_.js'
 */
window.RUI.bannerDownload = {
    template: __inline('banner-download.tpl'),
    ready: function() {
        this.show = (function() {
            var channelId = "channelId";
            if (document.cookie.length > 0) {
                var c_start = document.cookie.indexOf(channelId + "=");
                if (c_start != -1) {
                    return false;
                }
            }
            return true;
        }());
    },
    props: {
        show: {
            default: false
        }
    },
    methods: {
        download: window.RUtils.downloadAppRedirect,
        close: function() {
            this.show = false;
        }
    }
};

