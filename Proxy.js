/**
 * Created by Administrator on 2014/12/3.
 */
define(['Base', 'CommonUtils', 'Logger/Logger'], function(B, CommonUtils, Logger){
    function CollectionPrototype(objTemplate){
        // a kind of Template accords with a CollectionPrototype instance
        // but if adding some extra properties based on the pre Template, how
        // to reuse the pre Template and extend the CollectionPrototype
        var _instanceList  = [];
//        var _counter = 0;
        this.init = function() {
            return _instanceList.push(objTemplate.basicClone());
//            return _counter++;
        };
//        this.isInstanceOf = function(clz){
//            return (_instanceList[this.getIndex()]) instanceof clz;
//        };
//        this.getConstructor = function(){
//            return _instanceList[this.getIndex()].constructor;
//        };
        this.getProperty = function(key){
            var _val = (_instanceList[this.getIndex()])[key];
            return  typeof(_val) != "undefined" ? _val : CommonUtils.VALUE_INVALID;
        };
        this.setProperty = function(key, value){
            var _self = _instanceList[this.getIndex()];
            if(typeof(_self[key]) != "undefined"){
                _self[key] = value;
            }
            else{
                Logger.error("parameters invalid at CollectionProperty.setProperty\t[" +
                    objTemplate._constructor + "]\t" + key);
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
            _instanceList[this.getIndex()] = objTemplate.basicClone();
        };
        this.fillData = function(objData, objList){
            if(!objList){
                return this;
            }
            var _self = _instanceList[this.getIndex()];
            for(var prop in objData){
                if(objData.hasOwnProperty(prop)){
                    _self[objList[prop]] = objData[prop]
                }
            }
            return this;
        };
        this.destroy = function(){
            _instanceList[this.getIndex()].clearProperties();
            _instanceList[this.getIndex()] = 0;
            delete _instanceList[this.getIndex()];
            return this;
        };
    }

    CollectionPrototype.implementMethods({
        getTreeType: function(){
            return TypeMap.Wrapper;
        },
        getRoot: function(){
            return this;
        }
    });

    CollectionPrototype.implementMethods({
        checkSubNodes: function(){
            var _self = this;
            var _hasChild = false;
            var _subNodeKeys = [_self];
            _self.processAllData(function(key, value){
                if(value != null && typeof(value) != "function" && typeof(value) == "object"){
                    _subNodeKeys.push(key);
                    _hasChild = true;
                }
            });
            return _hasChild ? _subNodeKeys : null;
        },
        getSubNodeByKey: function(key){
            //key = (mapConversion && mapConversion[key]) || key;
            return this.getProperty(key);
        },
        parseAttributes: function(targetNode, toType, mapConversion){
            var _self = this;
            console.log("targetNode: " + targetNode);
            _self.processAllData(function(key, value){
                if(typeof(value) != "function" && typeof(value) != "object"){
                    key = (mapConversion && mapConversion[key]) || key;
                    targetNode.copyAttributes(key, value);
                }
            })
        },
        copyAttributes: function(key, value){
            this.setProperty(key, value);
        },
        createAndAppendChild: function(tag, tree, mapConversion){
            var _self = this;
            tag = (mapConversion && mapConversion[tag]) || tag;
            var _clzString = _self.getProperty(tag);
            var _value = (ClassMap[_clzString] && ClassMap[_clzString].createInstance()) || {};
            _self.setProperty(tag, _value);
            return _value;//_self.getProperty(tag);
        }
    });

    var Proxy = {
        createProxyFromTemplate: function(objTemplate){
            var _constructor = objTemplate._constructor || objTemplate.constructor;
            var _objTemplate = objTemplate._parent === undefined ? objTemplate :
                objTemplate._parent.getTemplate().basicClone().addPropFromTemplate(objTemplate);
            var ProxyPrototype = function(){
                var _index = this.init();
                this.getIndex = function(){
                    return _index;
                };
                this.init = null;   //  Reset the function in order to overrides the prototype function and set it as a
                //  non-reference so that the instance could not access the function any longer.
            }.
                inherits(new CollectionPrototype(_objTemplate), _constructor).
                staticMethod("createInstance", function(obj){
                    var _instance = new ProxyPrototype();
                    if(obj){
                        for(var key in obj){
                            if(obj.hasOwnProperty(key)){
                                _instance.setProperty(key, obj[key]);
                            }
                        }
                    }
                    return _instance;
                }).
                staticMethod("getTemplate", function(){
                    return _objTemplate;
                });
            return ProxyPrototype;
        }
    };

    return Proxy;
});