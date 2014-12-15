/**
 * Created by Administrator on 2014/12/9.
 */
define(['Utils/CommonUtils', 'Logger/Logger'], function(CommonUtils, Logger){
    //Adapter: define methods which can overrides.
    var threadAdapter = {
        url:        CommonUtils.STRING_NOT_SET,
        arguments:  CommonUtils.OBJECT_NOT_SET,
        task:       CommonUtils.STRING_NOT_SET,
        handler:    CommonUtils.FUNCTION_NOT_SET,
        error:      CommonUtils.FUNCTION_NOT_SET
    };

    //Prototype: define methods which are shared by all instances and cannot overrides
    var ThreadPrototype = function(){
        return{
            //Create Worker when firstly started
            start: function(){
                Logger.info("Thread " + this.id, "thread starts");
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
                Logger.info("Thread " + this.id, "thread stops");
                if(this.worker){
                    this.worker.terminate();
                    delete this.worker;
                }
            },
            reuse: function(obj){
                Logger.info("Thread " + this.id, "thread reuses");
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
    var Thread = function(obj){
        CommonUtils.COMMON_CONSTRUCTOR.call(this, obj, threadAdapter);
    };
    Thread.inherits(ThreadPrototype);

    //Proxy: a wrapper provides external interfaces avoiding from directly create instance
    //with "new" operator !!incorrect(and access the instance)
    var ThreadProxy = (function(){
        var _id = 0, currentThread = null;
        return {
            //an external interface to create instance by cloning obj and adapter
            createThread: function(obj){
                return new Thread(obj);
            },
            startThread: function(obj){
                this.stopThread();
                currentThread = new Thread(obj);
                currentThread.id = _id ++;
                currentThread.start();
            },
            stopThread: function(){
                if(currentThread !== null){
                    currentThread.stop();
                    currentThread = null;
                }
            }
        };
    })();

    return ThreadProxy;
});