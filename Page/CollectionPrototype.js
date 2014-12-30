/**
 * Created by Administrator on 2014/12/29.
 */
define(['TypeCheckExtender', 'CommonUtils'], function(TypeCheck, CommonUtils){
    function CollectionPrototype(fnTemplate){
        // a kind of Template accords with a CollectionPrototype instance
        // but if adding some extra properties based on the pre Template, how
        // to reuse the pre Template and extend the CollectionPrototype
        var _instanceList  = [];
        this.init = function(){
            return _instanceList.push(new fnTemplate()) - 1;
        };
        this.getProperty = function(key){
            var _val = (_instanceList[this.getIndex()])[key];
            return !TypeCheck.isUndefined(_val) ? _val : CommonUtils.VALUE_INVALID;
        };
        this.setProperty = function(key, value){
            var _self = _instanceList[this.getIndex()];
            if(!TypeCheck.isUndefined(_self[key])){
                _self[key] = value;
            }
            return this;
        };
        this.processAllData = function(fnProcess){
            var _obj = _instanceList[this.getIndex()];
            for(var key in _obj){
                if(_obj.hasOwnProperty(key)){
                    fnProcess(key, _obj[key]);
                }
            }
        };
        this.reInit = function(){
            _instanceList[this.getIndex()] = new fnTemplate();
        };
        this.destroy = function(){
            _instanceList[this.getIndex()].clearProperties();
            _instanceList[this.getIndex()] = 0;
            delete _instanceList[this.getIndex()];
            return this;
        };
        //define a prototype method with the same name as that of instance method so that instances could not access
        //this prototype method, yet available through constructor.prototype
        this.getIndex = function(){
            return _instanceList;
        };
    }

    var _createProxyConstructor = function(fnTemplate){
        return (function (){
            var _index = this.init();
            this.getIndex = function(){
                return _index;
            };
            this.init = null;   //  Reset the function in order to overrides the prototype function and set it as a
            //  non-reference so that the instance could not access the function any longer.
        }).inherits(new CollectionPrototype(fnTemplate), fnTemplate);
    };

    var Proxy = {
        createProxyFromTemplate: function(fnTemplate){
            var ProxyPrototype = _createProxyConstructor(fnTemplate);
            return {
                createInstance: function(obj){
                    var _instance = new ProxyPrototype();
                    if(TypeCheck.isNonEmptyObject(obj)){
                        for(var key in obj){
                            if(obj.hasOwnProperty(key)){
                                _instance.setProperty(key, obj[key]);
                            }
                        }
                    }
                    return _instance;
                }
            };
        },
        createCollectionProxy: function(fnTemplate){
            var ProxyPrototype = _createProxyConstructor(fnTemplate);
            var _getList = function(){
                return ProxyPrototype.prototype.getIndex();
            };
            var _checkItem = function(index){
                var _entity = (_getList())[index];
                if(!TypeCheck.isUndefined(_entity)){
                    return _entity;
                }
                return null;
            };

            return {
                createItem: function(obj){
                    var _instance = new ProxyPrototype();
                    if(TypeCheck.isNonEmptyObject(obj)){
                        for(var key in obj){
                            if(obj.hasOwnProperty(key)){
                                _instance.setProperty(key, obj[key]);
                            }
                        }
                    }
                    return _instance;
                },
                removeItem: function(index){
                    _checkItem(index) && (_getList().splice(index, 1));
                    return this;
                },
                removeLastItem: function(){
                    _getList().pop();
                    return this;
                },
                getItemProperty: function(index, key){
                    return (index = _checkItem(index)) && index[key];
                },
                setItemProperty: function(index, key, value){
                    (index = _checkItem(index)) && (index[key] = value);
                    return this;
                },
                getItemsCount: function(){
                    return _getList().length;
                }
            };
        }
    };

    return Proxy;
});