/**
 * Created by Administrator on 2014/12/9.
 */
define(['Utils/CommonUtils', 'Logger/Logger'], function(CommonUtils, Logger){
    //Adapter: define methods which can overrides.
    var threadAdapter = {
//        worker: "",
        url:        CommonUtils.STRING_NOT_SET,
        arguments:  CommonUtils.OBJECT_NOT_SET,
        task:       CommonUtils.STRING_NOT_SET,
        handler:    CommonUtils.FUNCTION_NOT_SET,
        error:      CommonUtils.FUNCTION_NOT_SET
    };

    //Prototype: define methods which are shared by all instances and cannot overrides
    var ThreadPrototype = function(){
        var _id = 0;
        var _workers = [];
        return{
            //Create Worker when firstly started
            getId: function(){

            },
            getWorker: function(){

            },
            start: function(){
                Logger.log("thread starts");
                if(!this.worker){
                    this.worker = new Worker(this.url);
                }
                var worker = this.worker;
                worker.onmessage = this.handler;
                worker.postMessage({
                    arguments: JSON.stringify(this.arguments),
                    task: this.task
                });
            },
            stop: function(){
                if(this.worker){
                    this.worker.terminate();
                }
            },
            reuse: function(obj){
                Logger.log("thread reuse");
                if(!obj){
                    return null;
                }
                if(obj.handler){
                    this.handler = obj.handler;
                }
                if(obj.arguments){
                    this.arguments = obj.arguments;
                }
                this.start();
            }
        };
    }();

    //Constructor: to create an instance which inherits the Prototype
    var Thread = function(){

    };
    Thread.inherits(ThreadPrototype);

    //Proxy: a wrapper provides external interfaces avoiding from directly create instance
    //with "new" operator !!incorrect(and access the instance)
    var ThreadProxy = {
        //an external interface to create instance by cloning obj and adapter
        createThread: function(obj){
            var thread = new Thread(), adapter = threadAdapter;
            for(var key in adapter){
                if(adapter.hasOwnProperty(key)){
                    thread[key] = obj[key] || adapter[key];
                }
            }
            return thread;
        }
    };

    return ThreadProxy;
});