/**
 * Created by Administrator on 2014/12/3.
 */
define(['TypeCheck'], function(TypeCheck){

    Object.prototype.basicClone = function(){
        var _copy = new this.constructor;
        for (var prop in this){
            if (this.hasOwnProperty(prop)){
                if(!TypeCheck.isFunction(this[prop])){
                    _copy[prop] = this[prop];
                }
            }
        }
        return  _copy;
    };

    Object.prototype.addProperty = function(key, value){
        if (TypeCheck.isUndefined(this[key])){
            this[key] = value;
        }
        return this;
    };

    Object.prototype.addPropFromTemplate = function(objTemplate){
        for (var prop in objTemplate){
            if (objTemplate.hasOwnProperty(prop)){
                this[prop] = objTemplate[prop];
            }
        }
        return this;
    };

    Object.prototype.merge = function(objTemplate){
        for (var prop in objTemplate){
            if (objTemplate.hasOwnProperty(prop)){
                this[prop] = objTemplate[prop];
            }
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
                    delete prop;
                }
                else{
                    this[prop].clearProperties();
                }
            }
        }
    };

    Object.prototype.superMethod = function(name, args){
        var func = (this.constructor.getAdapter())[name] || (this.constructor.prototype)[name];
        if(TypeCheck.isFunction(func)){
            func.apply(this, args);
        }
        return this;
    };

//    Object.prototype.each = function(fn, args){
//        if(TypeCheck.likeArray(this)){
//            for(var i  = 0, len = this.length; i < len; i++){
//                fn.apply(this[i], args);
//            }
//        }
//        return this;
//    };

    Function.prototype.method = function(type, func){
        if (!this.prototype[type]){
            this.prototype[type] = func;
        }
        return this;
    };

    Function.prototype.superMethod = function(name){
        return (this.getAdapter() || this.prototype)[name];
    };

    Function.prototype.implementMethods = function(funcObj){
        for (var key in funcObj){
            if (funcObj.hasOwnProperty(key) && TypeCheck.isFunction(funcObj[key])){
                this.prototype[key] = funcObj[key];
            }
        }
    };

    Function.prototype.implementStaticMethods = function(funcObj){
        for (var key in funcObj){
            if (funcObj.hasOwnProperty(key) && TypeCheck.isFunction(funcObj[key])){
                this[key] = funcObj[key];
            }
        }
    };

    Function.prototype.inherits = function(protoObj, fConstructor){
        if(TypeCheck.isObject(protoObj)){
            this.prototype = protoObj;
            this.prototype.constructor = fConstructor || this;
        }
        else if(TypeCheck.isFunction(protoObj)){
            this.prototype = new protoObj();
            this.prototype.constructor = fConstructor || protoObj || this;
        }
        return this;
    };

    Function.prototype.staticMethod = function(type, func){
        if (!this[type]){
            this[type] = func;
        }
        return this;
    };

});