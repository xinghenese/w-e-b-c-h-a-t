/**
 * Created by Administrator on 2014/12/17.
 */
define(['Base', 'Utils/CommonUtils', 'Logger/Logger'], function(Base, CommonUtils, Logger){
    var serverInfoList = [];

    var socketConfigAdapter = {
        host: CommonUtils.STRING_NOT_SET,
        port: CommonUtils.STRING_NOT_SET,
    };

    var socketListenerAdapter = {
//        onopen: CommonUtils.FUNCTION_NOT_SET,
        onmessage: CommonUtils.FUNCTION_NOT_SET,
        onclose: CommonUtils.FUNCTION_NOT_SET,
        onerror: CommonUtils.FUNCTION_NOT_SET
    };

    var SocketPrototype = {
        connect: function(){
            var url = "ws://" + this.host + ":" + this.port;
            var socket = new WebSocket(url);
            socket.onopen = this.onopen;
        },
        onopen: function(){

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