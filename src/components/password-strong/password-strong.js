/**
 * 通用列表组件
 * @require '../_.js'
 */
window.RUI.passwordStrong = {
    template: __inline('password-strong.tpl'),
    props: ['password'],
    computed: {
        // 密码强度判断逻辑
        // 把字符分成四类：数字、小写英文、大写英文、符号
        // 然后按照组合复杂度来直接判断强弱程度:
        // <1>单一，小于12位即“弱”，达到12位以上即“中”
        // <2>两两组合，小于12位即“中”，达到12位以上即“强”
        // <3>超过两种组合，满足6位以上即“强”
        status: function() {
            var password = this.password;
            var len = password ? password.length : 0;
            
            if (!len || len < 6) {
                return ''; //弱密码
            }

            //模式
            var Modes = 0;
            for (var i = 0; i < len; i++) {
                var charType = 0;
                var t = password.charCodeAt(i);
                if (t >= 48 && t <= 57) { //数字
                    charType = 1;
                } else if (t >= 65 && t <= 90) { //小写字母
                    charType = 2;
                } else if (t >= 97 && t <= 122) { //大写字母
                    charType = 4;
                } else {
                    charType = 8; //符号
                }
                Modes |= charType;
            }
            //密码模式
            var m = 0;
            for (i = 0; i < 4; i++) {
                if (Modes & 1) {
                    m++;
                }
                Modes >>>= 1;
            }

            //密码强度
            if (m < 2) {
                return len > 11 ? 'z-strong' : '';
            } else {
                if (len > 11 || m > 2) {
                    return 'z-stronger';
                } else {
                    return 'z-strong';
                }
            }
        }
    }
};
