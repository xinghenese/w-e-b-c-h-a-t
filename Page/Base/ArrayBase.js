/**
 * Created by Administrator on 2015/1/4.
 */
define(['../TypeCheck'], function(TypeCheck){
    Array.prototype.each = function(fn, args){
        if(TypeCheck.isFunction(fn)){
            var _fn = fn.length ?
                //needs more info about the items and array
                function(item, index, args){
                    return fn(item, index, args);
                } :
                //needs no other info except for items.
                //items treated as subjects more than objects of the process.
                function(item){
                    return fn.call(item);
                };
            for(var i  = 0, len = this.length; i < len; i++){
                if(_fn(this[i], i, args)){
                    break;
                }
            }
        }
        return this;
    };

    Array.prototype.contains = function(item){
        var _contains = false;
        this.each(function(_item){
            return (_contains = _item == item);
        });
        return _contains;
    };
});