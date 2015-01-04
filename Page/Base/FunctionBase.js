/**
 * Created by Administrator on 2015/1/4.
 */
define(['../TypeCheck'], function(TypeCheck){
    var _topClass = [];

    Function.prototype.getName = function(){
        return ((this.toString()).match(/function\s(.*?)\(/))[1] || "Anonymous";
    };

    Function.prototype.superMethod = function(name){
        return (this.getAdapter() || this.prototype)[name];
    };

    /*
     *  @param funcObj: a simple key-method map or an defined object
     *  @param arrMethods:  an array
     *  @param fnProcess:   a function
     *  @return this
     */
    Function.prototype.implementMethods = function(funcObj, arrMethods, fnProcess){
        if(TypeCheck.isObject(funcObj) && funcObj){
            var _proto = this.prototype, _methods, _name;
            if(!this.hasOwnProperty("_methods")){
                this._methods = [];
            }
            _methods = this._methods;

            var _fn = function(process){
                return function(key){
                    var _method = funcObj[key];
                    if(TypeCheck.isFunction(_method)){
                        _proto[key] = process && process(_method) || _method;
                        _methods.push(key);
                    }
                }
            };

            if(TypeCheck.isArray(arrMethods) && arrMethods){
                if(TypeCheck.isFunction(fnProcess) && fnProcess){
                    arrMethods.each(_fn(fnProcess));
                }
                else{
                    arrMethods.each(_fn());
                }
            }
            else{
                funcObj.iterate(_fn());
            }

            if(!_topClass.contains(_name = this.getName())){
                _topClass.unshift(_name);
            }
//            console.info("_topClass: ");
//            console.log("[" + _topClass + "]");
//            console.log(_name + "  %cImplements: ", "color:green; font-weight:bold;");
//            console.log("[" + _methods + "]");
        }
        return this;
    };

    Function.prototype.overrides = function(funcObj){
        if(TypeCheck.isObject(funcObj) && funcObj){
            var _proto = this.prototype, _methods, _super_methods, _name;
            if(!this.hasOwnProperty("_methods")){
                this._methods = [];
            }
            _methods = this._methods;

//        //Test
//        var _item = "";
            _topClass.each(function(item){
                return (_proto instanceof (item = window[item])) && (_super_methods = item._methods);
            });

            if(_super_methods){
                _super_methods.each(function(item){
                    if(funcObj.hasOwnProperty(item) && TypeCheck.isFunction(funcObj[item])){
                        _proto[item] = funcObj[item];
                        _methods.push(item);
                    }
                });

                if(!_topClass.contains(_name = this.getName())){
                    _topClass.unshift(_name);
                }
//            console.info("_topClass: ");
//            console.log("[" + _topClass + "]");
//            console.log(_name + "  %cOverrides: ", "color:red; font-weight:bold;", _item);
////
//            console.log("[" + _methods + "]");
            }


//        else{
//            funcObj.iterate(function(key){
//                if(TypeCheck.isFunction(_proto[key])){
//                    _proto[key] = this[key];
//                }
//            });
//        }
        }
        return this;
    };

    Function.prototype.redefine = function(funcObj){
        var _proto = this.prototype;
        if(TypeCheck.isObject(funcObj) && funcObj){
            funcObj.iterate(function(key, value){
                if(TypeCheck.isFunction(_proto[key]) && TypeCheck.isFunction(value)){
                    _proto[key] = value;
                }
            });
        }
        return this;
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
        if (TypeCheck.isFunction(func) && TypeCheck.isString(type)){
            this[type] = func;
        }
        return this;
    };
});