/*
 * 下载APP
 * @require /utils/utils.js
 */
document.getElementById('btn').onclick = function() {
    this.innerHTML = '正在前往下载页...';
    this.onclick = null;
    window.RUtils.downloadAppRedirect();
};
