/**
 * Created by Administrator on 2015/1/4.
 */
define(['../TypeCheck'], function(TypeCheck){
    Object.prototype.iterate = function(fn, args){
        for(var key in this){
            if(this.hasOwnProperty(key)){
                fn.call(this, key, this[key], args);
            }
        }
        return this;
    };

    Object.prototype.basicClone = function(){
        var _copy = new this.constructor;
        this.iterate(function(key){
            if(!TypeCheck.isFunction(this[key])){
                _copy[key] = this[key];
            }
        });
        return  _copy;
    };

    Object.prototype.addProperty = function(key, value){
        if (TypeCheck.isUndefined(this[key])){
            this[key] = value;
        }
        return this;
    };

    Object.prototype.merge = function(objTemplate){
        var _self = this;
        if(TypeCheck.isObject(objTemplate)){
            objTemplate.iterate(function(key){
                _self[key] = objTemplate[key];
            });
        }
        return this;
    };

    Object.prototype.addPropFromTemplate = function(objTemplate){
        return this.merge(objTemplate);
    };

    Object.prototype.superMethod = function(name, args){
        var func = (this.constructor.getAdapter())[name] || (this.constructor.prototype)[name];
        if(TypeCheck.isFunction(func)){
            func.apply(this, args);
        }
        return this;
    };

    Object.prototype.clearProperties = function(){
        for (var prop in this){
            if (this.hasOwnProperty(prop)){
                if(TypeCheck.isFunction(this[prop])){
                    this[prop] = null;
                }
                else if(!TypeCheck.isObject(this[prop])){
                    delete this[prop];
                }
                else{
                    this[prop].clearProperties();
                }
            }
        }
    };
});