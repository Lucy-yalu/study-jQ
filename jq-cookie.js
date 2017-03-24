// 基于自己封装的jQuery封装cookie插件
(function(factory){
    if(typeof define === 'function' && define.amd){
        define(['jQuery'],factory);
    }else if(typeof exports !== 'undefined'){
        module.exports = factory(jQuery)
    }else {
        factory(jQuery);
    }
}(function ($) {
    // 编码 raw默认是false 表示编码 解码执行
    function encode(s) {
        return config.raw ?  s : window.encodeURIComponent(s);
    }
    function decode(s) {
        return config.raw ? s : window.decodeURIComponent(s);
    }
    // 如果配置了$.cookie.json为true, 是表示将val转化为json字符串， 否则就强制转换
    // 再将上述结果重新编码  （设置cookie时要使用字符串子形式）
    function stringifyCookieValue(val) {
        return encode(config.json ? JSON.stringify(val) : String(val));
    }
    // 将字符串转化为对应的数据类型 （获取cookie是要原样输出）
    function parseCookieValue(s) {
        if(s.indexOf('"')===0){
            s = s.slice(1, -1).replace(/\\\\/g,'\\').replace(/\\"/g,'"')
        }
        s = decode(s);
        return config.json ? jSON.parse(s) : s;
    }
    // 给jQuery函数添加 设置和获取cookie的方法
    var config = $.cookie = function (key, val, option) {
        // 设置cookie
        if(arguments.length > 1 && !$.isFunction(val)){
            option = $.extend({}, config.default, option || {});
            // 若果设置了过期时间 计算过期日期
            if(option.expires){
                var days = option.expires,
                    t = option.expires = new Date();
                t.setMilliseconds(t.getMilliseconds() + days * 24*60*60*1000)
            }
            document.cookie = [
                encode(key),
                '=',
                stringifyCookieValue(val),
                t ? '; expires=' + t.toUTCString() : '',
                option.path ? '; path=' + option.path : '',
                option.domain ? '; domain=' + option.domain : '',
                option.secure ? '; secure' : ''
            ].join('');
        // 获取cookie
        }else {
            var result = key ? undefined : {};
            var cookies = window.document.cookie.split('; ');
            for(var i=0; i<cookies.length; i++){
                var parts = cookies[i].split('=');
                var name = decode(parts.shift());
                if(name === key){
                    result = typeof val === 'function' ?
                        val(parseCookieValue(parts.join('='))) :
                        parseCookieValue(parts.join('='));
                    break;
                }
                // 没有key 表示获取所有cookie
                if (!key){
                    result[name] = parseCookieValue(parts.join('='));
                }
            }
            return result;
        }
    };
    // 默认配置项
    $.cookie.default = {};
    // 删除cookie的方法  让过期就ok
    $.removeCookie = function (key, option) {
        $.cookie(key, '', $.extend({}, option, {expires: -1}));
        return !$.cookie(key);
    }

}));
