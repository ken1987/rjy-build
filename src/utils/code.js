/**
 * 解析用户代理
 * @param  {string} type 查询类型
 * @return {number}      类型是否匹配 0 不匹配 1 匹配 -1 查询类型不存在 
 */
var parseUserAgent = (function() {
    var userAgent = navigator.userAgent;

    //是不是润教育APP
    var isRUNEDU = function() {
        return /RUNEDU/i.test(userAgent);
    };

    //是不是微信
    var isWeChat = function() {
        return /MicroMessenger/i.text(userAgent);
    };

    //方法集合
    var methods = {
        isWeChat: isWeChat,
        isRUNEDU: isRUNEDU
    };

    return function(type) {
        var method = methods[type];
        if (typeof method == 'function') {
            return +method();
        } else {
            return -1;
        }
    };
}());

/**
 * 创建iframe
 * @param  {string} src 地址
 * @return {object}     frame元素
 */

var createNewFrame = function(src) {
    var frame = document.createElement("iframe");
    frame.style.cssText = "position:absolute;left:0;top:0;width:0;height:0;visibility:hidden;";
    frame.frameBorder = "0";
    frame.src = src;
    document.body.appendChild(frame);
    return frame;
};

/**
 * 简单随机数
 * @return {string} 简单的随机数
 */
var createGuid = function() {
    return 'xxxxxxxy'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};


/**
 * 给润教育app发送消息
 */
var sendMessage2RUNEDU = (function() {
    /**
     * 创建全局的临时函数
     * @param  {Function} callback 回调函数
     * @param  {object}   thisObj  上下文
     * @return {string}            创建的全局函数的函数名
     */
    var createFunction = function(callback, thisObj) {
        var name = '__RUNEDUCallback' + createGuid() + "__";
        window[name] = function() {
            typeof callback == 'function' && callback.apply(thisObj, arguments);
            delete window[name];
            callback = null;
            thisObj = null;
        };
        return name;
    };

    /**
     * 获取登录信息
     * 如果用户在app登录了则返回jsonString和token，否则：
     * ————必须登录时，app先让用户登录，然后再返回jsonString和token
     * ————非必须登录，就不返回
     * 这里不保存用户登录态，调用者在回调时自行记录
     * @param  {boolean}  mustLogin 是不是必须登录
     * @param  {Function} callback  回调函数
     * @param  {[type]}   thisObj   上下文
     */
    var login = function(mustLogin, callback, thisObj) {
        var name = createFunction(callback, thisObj);
        createNewFrame('runedu://mod=login' + (mustLogin ? 2 : 1) + '&callback=' + name);
    };
    /**
     * 被动分享
     * 通过顶部菜单中的分享按钮分享，分享当前url
     * 需要在head标签中加入<meta name="runedu:share:switch" content="1" />
     * content为0，表示在app顶部菜单拦不显示分享按钮
     */

    /**
     * 主动分享
     * @param  {object} obj 配置
     * @param  {string} obj.shareUrl        分享地址  app接口不支持&参数的网址，目前方案使用百度短网址分享
     * @param  {string} obj.title           标题  
     * @param  {string} obj.description     描述
     * @param  {string} obj.image           图片地址
     */
    var share = function(obj) {
        createNewFrame('runedu://mod=share2&shareObj=' + encodeURIComponent(JSON.stringify(obj)));
    };

    /**
     * 跳转到app相关页面
     * @param  {string} type 类型  
     *                       1 机构主页
     *                       2 课程详情
     *                       3 活动
     *                       4 润秀场详情
     *                       5 调用app直接播放视频
     * @param  {object} obj  配置
     *                       1 {id:111}
     *                       2 {id:111}
     *                       3 {id:111}
     *                       4 {id:111}
     *                       5 {url:"xxjkjkdjfk.m3u8"}
     */
    var switchApp = function(type, obj) {
        createNewFrame('runedu://mod=switch' + type + '&switchObj=' + encodeURIComponent(JSON.stringify(obj)));
    };

    return {
        login: login,
        share: share,
        switchApp: switchApp
    };
    
}());
