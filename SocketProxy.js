/**
 * Created by Administrator on 2014/12/17.
 */
define(['Base', 'Utils/CommonUtils', 'Logger/Logger'], function(Base, CommonUtils, Logger){
    var serverInfoList = [];

    var socketConfigAdapter = {
        host: CommonUtils.STRING_NOT_SET,
        port: CommonUtils.STRING_NOT_SET
    };

    var socketListenerAdapter = {
//        onopen: CommonUtils.FUNCTION_NOT_SET,
        onConnected: CommonUtils.FUNCTION_NOT_SET,
        onConnectedFailed: CommonUtils.FUNCTION_NOT_SET,
        onClose: CommonUtils.FUNCTION_NOT_SET,
        onClosedByRemote: CommonUtils.FUNCTION_NOT_SET,
        onData: CommonUtils.FUNCTION_NOT_SET,
        onError: CommonUtils.FUNCTION_NOT_SET
    };

    var SocketPrototype = {
        connect: function(){
            var _self = this;
            var url = "ws://" + _self.host + ":" + _self.port;
            var socket = new WebSocket(url);
            socket.onopen = _self.onConnected;
            socket.onmessage = _self.onData;
            socket.onerror = _self.onError;
            socket.onclose = function(evt){
                if(socket.readyState == 0){
                    _self.onConnectedFailed(evt);
                }
                else{
                    if(evt.code == 1000){
                        _self.onClose(evt);
                    }
                    else{
                        _self.onClosedByRemote(evt);
                    }
                }
            }
        }
    };

    var Socket = function(obj){
        CommonUtils.COMMON_CONSTRUCTOR.call(this, obj, socketConfigAdapter);
        CommonUtils.COMMON_CONSTRUCTOR.call(this, obj, socketListenerAdapter);
    };
    Socket.inherits(SocketPrototype);

    var SocketProxy = (function(){
        var _id = 0, currentSocket = null;
        return {
            request: function(obj){
                if(!currentSocket){
                    currentSocket = new Socket(obj);
                }
                currentSocket.connect();
            },
            terminate: function(){

            },
            reconnect: function(){
                this.terminate();
                this.connect();
            }
        };
    })();

    return SocketProxy;

});