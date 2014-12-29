/**
 * Created by Administrator on 2014/12/29.
 */
define(['TypeCheckExtender', 'CollectionPrototype'], function(TypeCheck, CollectionPrototype){

    var Proxy = {
        createCollectionProxy: function(fnTemplate){
            var ProxyPrototype = (function(){
                var _index = this.init();
                this.getIndex = function(){
                    return _index;
                };
                this.init = null;   //  Reset the function in order to overrides the prototype function and set it as a
                //  non-reference so that the instance could not access the function any longer.
            }).inherits(new CollectionPrototype(fnTemplate), fnTemplate);

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
                    if(!TypeCheck.isEmptyObject(obj)){
                        for (var key in obj) {
                            if (obj.hasOwnProperty(key)) {
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