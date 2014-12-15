/**
 * Created by Administrator on 2014/12/4.
 */
define(['Utils/CommonUtils', 'CoreSettings', 'Logger/Logger', 'Base'], function(CommonUtils, CoreSettings, Logger){
    var PacketConfigAdapter = {
        method: "POST",
        urlRoot: CoreSettings.getHttpRequestUrlRoot,
        urlPath: "",
        requestData: "",
        needDecrypt: true,
        timeout: CommonUtils.CONNECT_TIMEOUT
    };

    var PacketProcessorAdapter = {
        callback: CommonUtils.FUNCTION_NOT_SET,
        onFailed: CommonUtils.FUNCTION_NOT_SET,
        onComplete: CommonUtils.FUNCTION_NOT_SET,
        onData: function(data){
            var result = (JSON.parse(data))["r"];
            if(result === 0){
                this.onDataSuccess((JSON.parse(data))["data"]);
                this.callback();
            }
            else{
                this.onDataInvalid(result);
            }

        },
        onDataSuccess: function(data){

        },
        onDataInvalid: function(result){

        },
        onTimeout: function(){
            Logger.error("Http", " http connection timeout");
        },
        configHttpRequest: function(xhr){

        }
    };

    var HttpProtocolPacketPrototype = {
        sendHttpRequest: function() {
            var _send, _self = this;
            var xhr = new XMLHttpRequest();
            if (typeof xhr.timeout != "undefined") {
                xhr = null;
                _send = function () {
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                                Logger.info("http response", "->" + _self.urlRoot + _self.urlPath + ", data: " + xhr.responseText);
                                if(!xhr.responseText){
                                    Logger.warn("ResponseDataError");
                                    return;
                                }
                                _self.onData(JSON.parse(xhr.responseText));
                                xhr = null;
                            }
                            else{
                                _self.onFailed();
                            }
                            _self.onComplete();
                        }
                    };
                    xhr.open(_self.method, _self.urlRoot + _self.urlPath);
                    _self.configHttpRequest(xhr);
                    xhr.timeout = _self.timeout;
                    xhr.onTimeout = _self.onTimeout;
                    xhr.send(JSON.stringify(_self.requestData));
                    Logger.info("http request", "-<" + _self.urlRoot + _self.urlPath + ", data: " + JSON.stringify(_self.requestData));
                };
            }
            else {
                xhr = null;
                _send = function () {
                    var xhr = new XMLHttpRequest();
                    var timedout = false;
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            if (timedout) {
                                _self.onTimeout();
                                return;
                            }
                            clearTimeout(timer);
                            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                                Logger.info("http response", "->" + _self.urlRoot + _self.urlPath + ", data: " + xhr.responseText);
                                if(!xhr.responseText){
                                    Logger.warn("ResponseDataError");
                                    return;
                                }
                                _self.onData(JSON.parse(xhr.responseText));
                                xhr = null;
                            }
                            else{
                                _self.onFailed();
                            }
                            _self.onComplete();
                        }
                    };
                    xhr.open(_self.method, _self.urlRoot + _self.urlPath);
                    _self.configHttpRequest(xhr);
                    var timer = setTimeout(function () {
                        timedout = true;
                        xhr.abort();
                    }, _self.timeout);
                    xhr.send(JSON.stringify(_self.requestData));
                    Logger.info("http request", "-<" + _self.urlRoot + _self.urlPath + ", data: " + JSON.stringify(_self.requestData));
                };
            }
            HttpProtocolPacketPrototype.sendHttpRequest = _send;
            return HttpProtocolPacketPrototype.sendHttpRequest();
        }
    };

    var HttpProtocolPacket = function(obj){
        CommonUtils.COMMON_CONSTRUCTOR.call(this, obj, PacketConfigAdapter);
        CommonUtils.COMMON_CONSTRUCTOR.call(this, obj, PacketProcessorAdapter);
    };

    HttpProtocolPacket.inherits(HttpProtocolPacketPrototype);
    HttpProtocolPacket.getAdapter = function(){
        return PacketConfigAdapter;
    };

    return {
        request: function(obj){
            var _packet = new HttpProtocolPacket(obj);
            _packet.sendHttpRequest();
        }
    };
});