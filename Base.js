/**
 * Created by Administrator on 2014/12/3.
 */
define(['Page/TreeType', 'TypeCheck', 'CSSUtil'], function(TreeType, TypeCheck, CSSUtil){

    Object.prototype.basicClone = function () {
        var _copy = new this.constructor;
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                if(!TypeCheck.isFunction(this[prop])){
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
                if(TypeCheck.isFunction(this[prop])) {
                    this[prop] = null;
                }
                else if(!TypeCheck.isObject(this[prop])) {
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
            if (funcObj.hasOwnProperty(key) && TypeCheck.isFunction(funcObj[key])) {
                this.prototype[key] = funcObj[key];
            }
        }
    };

    Function.prototype.inherits = function (protoObj, fConstructor) {
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

    Function.prototype.staticMethod = function (type, func) {
        if (!this[type]) {
            this[type] = func;
        }
        return this;
    };

    /*
         Interface Tree{
             getTreeType();
             getRoot();
         }
         Interface Node{
             checkSubNodes();
             getSubNodeByKey(key);
             parseAttributes(targetNode, mapConversion);
             copyAttributes(key, value);
             createAndAppendChild(tag, tree, mapConversion);
         }
     */

    Object.implementMethods({
        getTreeType: function(){
            return TreeType.Object;
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
                    if(_self[key]){
                        if(TypeCheck.isArray(_self[key])){
                            var _len = _self[key].length;
                            for(var i = 0; i < _len; i++){
                                _subNodeKeys.push(key + "-" + i);
                            }
                            _hasChild = true;
                        }
                        else if(TypeCheck.isObject(_self[key])){
                            if(key == "style"){
                                _self[key] = CSSUtil.toCSSText(_self[key]);
                            }
                            else{
                                _subNodeKeys.push(key);
                                _hasChild = true;
                            }
                        }
                        else if(key == "text"){
                            _subNodeKeys.push(key + '-' + _self[key]);
                            _hasChild = true;
                        }
                    }
                }
            }
            return _hasChild ? _subNodeKeys : null;
        },
        getSubNodeByKey: function(key){
            //key = (mapConversion && mapConversion[key]) || key;
            var _info = key.split('-'),
                _key = _info[0],
                _index = _info[1];
            if(TypeCheck.likeNumber(_index)){
                return this[_key][_index];
            }
            return this[_key];
        },
        parseAttributes: function(targetNode, mapConversion){
            var _self = this;
            for(var key in _self){
                if(_self.hasOwnProperty(key)){
                    var _value = _self[key];
                    if(!TypeCheck.isFunction(_value) && !TypeCheck.isObject(_value)){
                        key = (mapConversion && mapConversion[key]) || key;
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
            _self[tag] = {};
            return _self[tag];
        }
    });

    Document.implementMethods({
        getTreeType: function(){
            return TreeType.XMLDocument;
        },
        getRoot: function(){
            return this.documentElement;
        }
    });

    HTMLDocument.implementMethods({
        getTreeType: function(){
            return TreeType.HTMLDocument;
        },
        getRoot: function(){
            if(!this.root){
                this.root = document.createElement("div");
            }
            return this.root;
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
                    targetNode.copyAttributes(_key, _attrs[i].value);
                }while(typeof(_attrs[++i]) != "undefined");
            }
        },
        copyAttributes: function(key, value){
            this.setAttribute(key, (ClassMap[value] ? "" : value));
        },
        createAndAppendChild: function(tag, tree, mapConversion){
            var arr = tag.split('-');
            tag = (mapConversion && mapConversion[arr[0]]) || arr[0];
            return this.appendChild(tree.createElement(tag));
        }
    });

    HTMLElement.implementMethods({
        getSubNodeByKey: function(key){
            //key = (mapConversion && mapConversion[key]) || key;
            if(key != "text"){
                var _info = key.split('-'),
                    _key = _info[0],
                    _index = _info[1];
                if(typeof _index !== "undefined"){
                    return this[_key][_index];
                }
            }
            return this[_key];
        },
        createAndAppendChild: function(tag, tree, mapConversion){
            var arr = tag.split('-');
            tag = (mapConversion && mapConversion[arr[0]]) || arr[0];
            if(tag == "text"){
                return this.appendChild(tree.createTextNode(arr[1] || ""));
            }
            return this.appendChild(tree.createElement(tag));
        }
    });

    Document.prototype.simpleParse = function(){
        return this.documentElement.parseAttributes();
    };

});