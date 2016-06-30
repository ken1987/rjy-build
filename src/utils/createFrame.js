/**
 * 创建iframe
 * @require _.js
 * @param  {string} src 地址
 * @return {object}     frame元素
 */
window.RUtils.createFrame = function(src) {
    var frame = document.createElement("iframe");
    frame.style.cssText = "position:absolute;left:0;top:0;width:0;height:0;visibility:hidden;";
    frame.frameBorder = "0";
    frame.src = src;
    document.body.appendChild(frame);
    return frame;
};