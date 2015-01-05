/**
 * Created by Administrator on 2014/12/22.
 */
define(['Base', 'TypeCheckExtender', 'Utils/CommonUtils'], function(Base, TypeCheck, CommonUtils){
    if(!window.Worker){
        var WorkerPrototype = {
            onerror: CommonUtils.FUNCTION_NOT_SET,
            onmessage: CommonUtils.FUNCTION_NOT_SET,
            postMessage: function(msg){
                if(TypeCheck.isNonEmptyObject(msg)){
                    var args = msg.arguments || "",
                        task = msg.task || "",
                        _module = require(this._url),
                    //a map from name of task, which includes big loops and inevitably costs rather long time, to that
                    //of small monomers.
                        _map = _module && _module.mapMonomer,
                        _method = task && _map &&  _map[task];
                    if(TypeCheck.isFunction(_method) && _method){
                        try{
                            var _f = _process(_premise, _method, _limit),
                                _args = _initialize(args);
                            this.onmessage({
                                data: _f(_args)
                            });
                        }
                        catch(e){
                            this.onerror(e);
                        }

                    }
                }

            }
        };

        var _initialize = function(){

        };

        var premise = function(){

        };

        function _checkArguments(){

        }

        function _process(premise, execution, limit){
            var _f =  function(){
                for(var i = 0; premise(arguments) && i < limit; i++){
                    execution(arguments);
                }
                if(premise(arguments)){
                    setTimeout(function(){
                        _f(arguments);
                    }, 0);
                }
                else{
                    return arguments;
                }
            };
            return _f;
        }

        var Worker = window.Worker = (function(url){

            this._url = (url.split(".js"))[0];  //url = url.replace(/^(.+)\.js/, '$1'); url = url.replace(/.js/g, '');

        }).inherits(WorkerPrototype);

        return Worker;

    }
});