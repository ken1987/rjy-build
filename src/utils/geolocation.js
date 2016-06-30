/**
 * 地理定位
 * @require _.js
 */
(function(window) {
    /**
     * 获取错误提示信息
     * @param  {string} error 错误表示
     * @return {string}       提示
     */
    var getErrorTip = function(error) {
        var tip = '';
        if (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    tip = "用户拒绝使用地理定位";
                    break;
                case error.POSITION_UNAVAILABLE:
                    tip = "定位信息不可用";
                    break;
                case error.TIMEOUT:
                    tip = "请求超时";
                    break;
                case error.UNKNOWN_ERROR:
                    tip = "发生一个未知错误";
                    break;
            }
        } else {
            tip = '不支持地理定位';
        }
        return tip;
    };

    window.RUtils.geolocation = function(success, error, options) {
        var _success, _error;

        if (typeof success !== 'function') {
            return;
        }

        _success = function(position) {
            var coords = position.coords;
            var lon = coords.longitude;
            var lat = coords.latitude;
            success(lon, lat);
        };

        if (typeof error == 'function') {
            _error = function(data) {
                error(getErrorTip(data), data);
            };
        }

        //定位
        var g = window.navigator.geolocation;
            
        if (g) {
            //修改配置
            var setting = {
                enableHighAccuracy: true, //是否使用高精度设备获取值，gps>wifi>ip
                maximumAge: 30000, //表示浏览器重新获取位置信息的时间间隔
                timeout: 5000 //设定请求超时时间
            };
            if (options) {
                for (var a in options) {
                    setting[a] = options[a];
                }
            }
            g.getCurrentPosition(_success, _error, setting);
        } else {
            _error && _error(getErrorTip());
        }
    };
}(this));
