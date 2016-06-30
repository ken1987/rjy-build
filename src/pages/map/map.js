/*
 * 地图
 * @require '/libs/vue.js'
 * @require "/components/components.js"
 * @require "/utils/utils.js"
 */
(function(window) {
    var Vue = window.Vue;
    var UI = window.RUI;
    var utils = window.RUtils;
    var xhr = utils.xhr;
    var search = utils.urlParse().search;
    var BMap = window.BMap;

    //视图
    new Vue({
        el: '#wrap',
        data: {
            title:'地图展示'
        },
        components: {
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack
        }
    });

    var lon = parseFloat(search.lon),
        lat = parseFloat(search.lat),
        name = window.decodeURIComponent(search.name||''),
        address = window.decodeURIComponent(search.address||'');

    // 百度地图API功能
    var map = new BMap.Map("mapContainer");
    var point = new BMap.Point(lon || 113.952893, lat || 22.559618);
    map.centerAndZoom(point, 16);

    function ComplexCustomOverlay(point, text, address, mouseoverText) {
        this._point = point;
        this._text = text;
        this._address = address;
        this._overText = mouseoverText;
    }
    ComplexCustomOverlay.prototype = new BMap.Overlay();
    ComplexCustomOverlay.prototype.initialize = function(map) {
        this._map = map;

        //容器
        var div = this._div = document.createElement("div");
        div.className='m-map-overlay';
        div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);

        //内容
        var _div = this._divText = document.createElement("div");
        div.appendChild(_div);
        _div.innerHTML='<div><b>'+this._text+'</b></div><div>'+this._address+'</div>';

        //箭头
        var arrow = this._arrow = document.createElement("div");
        arrow.className='m-map-overlay-tri';
        arrow.style.bottom = "-10px";
        arrow.style.left = "96px";
        div.appendChild(arrow);
        map.getPanes().labelPane.appendChild(div);
        return div;
    };
    ComplexCustomOverlay.prototype.draw = function() {
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._point);
        this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
        this._div.style.top = pixel.y - 30 + "px";
    };

    var myCompOverlay = new ComplexCustomOverlay(
            new BMap.Point(lon || 113.952893, lat || 22.559618),
            name, 
            address);

    map.addOverlay(myCompOverlay);
}(this));
