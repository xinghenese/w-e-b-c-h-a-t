/**
 * Created by Administrator on 2014/12/3.
 */
define(function() {
    Object.prototype.basicClone = function () {
        var _copy = new this.constructor;
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                if (typeof(this[prop]) != "function") {
                    _copy[prop] = this[prop];
                }
            }
        }
        return  _copy;
    };

    Object.prototype.addProperty = function (key, value) {
        if (typeof(this[key]) == "undefined") {
            this[key] = value;
        }
        return this;
    };

    Object.prototype.addPropFromTemplate = function (objTemplate) {
        for (var prop in objTemplate) {
            if (objTemplate.hasOwnProperty(prop)) {
                this[prop] = objTemplate[prop];
            }
        }
        return this;
    };

    Object.prototype.clearProperties = function () {
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                if (typeof(this[prop]) == "function") {
                    this[prop] = null;
                }
                else if (typeof(this[prop]) != "object") {
                    delete prop;
                }
                else {
                    this[prop].clearProperties();
                }
            }
        }
    };

    Object.prototype.superMethod = function(name, args){
        var func = (this.constructor.getAdapter())[name] || (this.constructor.prototype)[name];
        if(typeof func === 'function'){
            func.apply(this, args);
        }
        return this;
    };

    Function.prototype.method = function (type, func) {
        if (!this.prototype[type]) {
            this.prototype[type] = func;
        }
        return this;
    };

    Function.prototype.superMethod = function(name){
        return (this.getAdapter() || this.prototype)[name];
    };

    Function.prototype.implementMethods = function (funcObj) {
        for (var key in funcObj) {
            if (funcObj.hasOwnProperty(key) && typeof funcObj[key] == "function") {
                this.prototype[key] = funcObj[key];
            }
        }
    };

    Function.prototype.inherits = function (protoObj, fConstructor) {
        if(typeof protoObj == "object"){
            this.prototype = protoObj;
            this.prototype.constructor = fConstructor || this;
        }
        else if(typeof protoObj == "function"){
            this.prototype = new protoObj();
            this.prototype.constructor = fConstructor || protoObj || this;
        }
        return this;
    };

    Function.prototype.staticMethod = function (type, func) {
        if (!this[type]) {
            this[type] = func;
        }
        return this;
    };

//    Interface Tree{
//        getTreeType();
//        getRoot();
//    }
//    Interface Node{
//        checkSubNodes();
//        getSubNodeByKey(key);
//        parseAttributes(targetNode, mapConversion);
//        copyAttributes(key, value);
//        createAndAppendChild(tag, tree, mapConversion);
//      }

    Object.implementMethods({
        getTreeType: function(){
            return TypeMap.Object;
        },
        getRoot: function(){
            return this;
        }
    });

    Object.implementMethods({
        checkSubNodes: function(){
            var _self = this;
            var _hasChild = false;
            var _subNodeKeys = [_self];
            for(var key in _self){
                if(_self.hasOwnProperty(key)){
                    if(_self[key] && typeof(_self[key]) == "object"){
                        _subNodeKeys.push(key);
                        _hasChild = true;
                    }
                }
            }
            return _hasChild ? _subNodeKeys : null;
        },
        getSubNodeByKey: function(key){
            //key = (mapConversion && mapConversion[key]) || key;
            return this[key];
        },
        parseAttributes: function(targetNode, mapConversion){
            var _self = this;
            for(var key in _self){
                if(_self.hasOwnProperty(key)){
                    var _value = _self[key];
                    if(typeof(_value) != "function" && typeof(_value) != "object"){
                        key = (mapConversion && mapConversion[key]) || key;
//                        console.log("key: " + key);
                        targetNode.copyAttributes(key, _value);
                    }
                }
            }
        },
        copyAttributes: function(key, value){
            this[key] = ClassMap[value] ? {} : value;
        },
        createAndAppendChild: function(tag, tree, mapConversion){
            var _self = this;
            tag = (mapConversion && mapConversion[tag]) || tag;
//        console.log("tag: " + tag);
            _self[tag] = {};
            return _self[tag];
        }
    });

    Document.implementMethods({
        getTreeType: function(){
            return TypeMap.XMLDocument;
        },
        getRoot: function(){
            return this.documentElement;
        }
    });

    Element.implementMethods({
        checkSubNodes: function(){
            var _self = this;
            var _subNodeKeys = [_self];
            if(_self.hasChildNodes()){
                var _len = _self.childNodes.length;
                for(var i = 0; i < _len; i++){
                    _subNodeKeys.push(i);
                }
                return _subNodeKeys;
            }
            return null;
        },
        getSubNodeByKey: function(key){
            return this.childNodes[key];
        },
        parseAttributes: function(targetNode, toType, mapConversion){
            if(this.hasAttributes()){
                var _attrs = this.attributes, i = 0;
                do{
                    var _key = (mapConversion && mapConversion[_attrs[i].name]) || _attrs[i].name;
//                console.log("_key: " + _key);
                    targetNode.copyAttributes(_key, _attrs[i].value);
                }while(typeof(_attrs[++i]) != "undefined");
            }
        },
        copyAttributes: function(key, value){
            this.setAttribute(key, (ClassMap[value] ? "" : value));
        },
        createAndAppendChild: function(tag, tree, mapConversion){
            tag = (mapConversion && mapConversion[tag]) || tag;
            return this.appendChild(tree.createElement(tag));
        }
    });

    Document.prototype.simpleParse = function(){
        return this.documentElement.parseAttributes();
    };

});