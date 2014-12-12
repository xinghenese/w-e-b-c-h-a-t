/**
 * Created by Reco on 2014/12/7.
 */
define(function(){
    var CookieUtil = {
        getCookie: function(key){
            if(document.cookie.match(new RegExp("^.*(;\\s?)?" + key + "=(.+?)(;|$).*$")) != null){
                return decodeURIComponent(RegExp.$2);
            }
            return "";
        },
        setCookie: function(key, value, expire, domain){
            var _cookie = "";
            if(typeof value == "object"){
                var _val = "";
                for(var prop in value){
                    if(value.hasOwnProperty(prop)){
                        _val += "&" + prop + "=" + value[prop];
                    }
                }
                value = _val.substring(1);
            }
            _cookie += key + "=" + encodeURIComponent(value);
            if(document.cookie){
                _cookie = ";" + _cookie;
            }
            if(expire){
                var _date = new Date();
                _date.setTime(_date.getTime() + expire);
                _cookie += ";expires=" + _date.toUTCString();
            }
            if(domain){
                _cookie += ";domain=" + encodeURIComponent(domain);
            }
            document.cookie = _cookie;
            return this;
        },
        removeCookie: function(key){
            if(this.getCookie(key)){
                this.setCookie(key, "", -1);
            }
            return this;
        }
    };
    return CookieUtil;
});