/*
 * 验证配置
 * @require _.js
 */
(function(window) {
    /**
     * 字符数
     * @param  {string}  str            待检验的字符
     * @param  {boolean} checkChinese   中文换成2个非中文字符
     * @return {number}                 字符长度
     */
    var getLength = function(str, checkChinese) {
        if (checkChinese) {
            str.replace(/[\u4e00-\u9fa5]/g, "xx");
        }
        return str.length;
    };
    //-----------------------------常用类型检测
    //身份证
    var isIdCard = function(val) {
        if ((/^\d{17}[0-9xX]$/).test(val)) {
            var vs = "1,0,x,9,8,7,6,5,4,3,2".split(","),
                ps = "7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2".split(","),
                ss = val.toLowerCase().split(""),
                r = 0;
            for (var i = 0; i < 17; i++) {
                r += ps[i] * ss[i];
            }
            return vs[r % 11] == ss[17];
        }
        return false;
    };
    //手机号码
    var isMobile = function(val) {
        return /^13[0-9]{9}$|^14[57][0-9]{8}$|^15[012356789][0-9]{8}$|^18[0123456789][0-9]{8}$|^17[0-9]{9}$/.test(val);
    };
    //固定电话
    var isLandlines = function(val) {
        return /0\d{2,3}[-\s]?\d{7,8}/.test(val);
    };
    //邮箱
    var isEmail = function(val) {
        return /^([A-Z0-9]+[_|\_|\.]?)*[A-Z0-9]+@([A-Z0-9]+[_|\_|\.]?)*[A-Z0-9]+\.[A-Z]{2,3}$/i.test(val);
    };
    //url
    var isUrl = function(val) {
        return /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/.test(val);
    };
    //qq
    var isQQ = function(val) {
        return /^[1-9]\d{4,10}$/.test(val);
    };
    //字母
    var isLetter = function(val) {
        return /^[a-z]+$/i.test(val);
    };
    //中文
    var isChinese = function(val) {
        return /^[\u4e00-\u9fa5]+$/.test(val);
    };
    //数字
    var isNumber = function(val) {
        return /^[0-9]+$/.test(val);
    };
    //数值
    var isNumberVal = function(val) {
        return /^\-?\d+(\.?\d+)?$/.test(val);
    };
    //整数
    var isInteger = function(val) {
        return /^(0|\-?[1-9]\d*)$/.test(val);
    };
    //非负整数
    var isNNInt = function(val) {
        return /^(0|[1-9]\d*)$/.test(val);
    };
    //小数
    var isDecimal = function(val, digit) {
        return new RegExp('^-?\\d+(\\.?\\d{0,' + (digit || '') + '})?$').test(val);
    };
    //---------------------------------字符长度
    //字符数
    var length = function(val, len, checkChinese) {
        return getLength(val, checkChinese) == parseInt(len, 10);
    };
    //最少字符数
    var minlength = function(val, len, checkChinese) {
        return getLength(val, checkChinese) >= parseInt(len, 10);
    };
    //最大字符数
    var maxlength = function(val, len, checkChinese) {
        return getLength(val, checkChinese) <= parseInt(len, 10);
    };
    //---------------------------------数值大小比较
    //大于或等于
    var min = function(val, num) {
        return parseFloat(val) >= parseFloat(num);
    };
    //小于或等于
    var max = function(val, num) {
        return parseFloat(val) <= parseFloat(num);
    };
    //相等
    var eq = function(val, num) {
        return parseFloat(val) == parseFloat(num);
    };

    window.RUtils.validators = {
        integer:isInteger,
        idcard: isIdCard,
        mobile: isMobile,
        email: isEmail,
        landlines: isLandlines,
        len: length,
        maxlength: maxlength,
        minlength: minlength,
        min: min,
        max: max,
        eq: eq
    };
}(this));
