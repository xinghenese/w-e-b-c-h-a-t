/**
 * Created by Administrator on 2014/12/3.
 */
define(['Utils/CommonUtils'], function(CommonUtils){
    var _Network = ["_INTERNET", "_INTRANET", "_DEV_INTRANET", "_LOCAL"];
    function UrlDecorator(str1, str2, str3, str4, str5) {
        this._RESOURCE_URL_PREFIX = str1;
        this._HTTP_REQUEST_URL_ROOT = str2;
        this._HTTP_REQUEST_URL_ROOT_STATIC = str3;
        this._HTTP_REQUEST_RESOURCE_RELATED_URL_ROOT = str4;
        this._HTTP_REQUEST_URL_ROOT_PROXY_SERVER_INFO = str5;
    }
    var _InterUrlDec = new UrlDecorator("http://r.liao.com/", "http://api.liao.com/", "http://staticapi.liao.com/", "http://uapi.liao.com/", "http://oir.liao.com/");
    var _IntraUrlDec = new UrlDecorator("http://r.topcmm.net/", "http://api.liao.com/", "http://staticapi.liao.com/", "http://uapi.liao.com/", "http://oir.liao.com/");
    var _DevUrlDec = new UrlDecorator("http://dev.r.topcmm.net/", "http://api.topcmm.net/", "http://staticapi.topcmm.net/", "http://uapi.topcmm.net/", "http://oir.topcmm.net/");
    var _LocalDec = new UrlDecorator("http://r.liao.local/", "http://www.liao.local/", "http://staticapi.liao.local/", "http://uapi.liao.local/", "http://oir.liao.local/");

    var _URL = {
        _INTERNET: _InterUrlDec,
        _INTRANET: _IntraUrlDec,
        _DEV_INTRANET: _DevUrlDec,
        _LOCAL: _LocalDec
    };

    var _CURRENT_NETWORK = _Network[3];
    var CoreSettings = {
        MESSAGE_SEND_TIMEOUT: 300000,
        getResourceUrlPrefix: function(){
            try{
                CommonUtils.checkArgument(_CURRENT_NETWORK);
            }
            catch(e){
                alert(e.message);
                return null;
            }
            return _URL[_CURRENT_NETWORK]._RESOURCE_URL_PREFIX;
        },
        getHttpRequestUrlRoot: function(){
            try{
                CommonUtils.checkArgument(_CURRENT_NETWORK);
            }
            catch(e){
                alert(e.message);
                return null;
            }
            return _URL[_CURRENT_NETWORK]._HTTP_REQUEST_URL_ROOT;
        },
        getHttpRequestResourceRelatedUrlRoot: function(){
            try{
                CommonUtils.checkArgument(_CURRENT_NETWORK);
            }
            catch(e){
                alert(e.message);
                return null;
            }
            return _URL[_CURRENT_NETWORK]._HTTP_REQUEST_RESOURCE_RELATED_URL_ROOT;
        },
        getHttpRequestUrlRootStatic: function(){
            try{
                CommonUtils.checkArgument(_CURRENT_NETWORK);
            }
            catch(e){
                alert(e.message);
                return null;
            }
            return _URL[_CURRENT_NETWORK]._HTTP_REQUEST_URL_ROOT_STATIC;
        },
        getHttpRequestUrlRootForProxyServerInfo: function(){
            try{
                CommonUtils.checkArgument(_CURRENT_NETWORK);
            }
            catch(e){
                alert(e.message);
                return null;
            }
            return _URL[_CURRENT_NETWORK]._HTTP_REQUEST_URL_ROOT_PROXY_SERVER_INFO;
        }
    };
    return CoreSettings;
});